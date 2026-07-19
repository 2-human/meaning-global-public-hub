#!/usr/bin/env node
/* validate-content.mjs — validate a proposal-hub content.js against content.schema.json.
 *
 *   node validate-content.mjs [path/to/content.js]   (defaults to ./content.js)
 *
 * Dependency-free: loads content.js in a vm sandbox with a `window` shim to capture
 * window.HUB, then walks the JSON Schema (the subset the schema uses: type/required/
 * properties/items/enum/additionalProperties/oneOf) and runs a few semantic cross-
 * checks the schema cannot express. Exit 1 on any error (CI gate). See FEATURE.md. */
import { readFileSync } from "node:fs";
import { createContext, runInContext } from "node:vm";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const contentPath = resolve(process.cwd(), process.argv[2] || resolve(HERE, "content.js"));
const schema = JSON.parse(readFileSync(resolve(HERE, "content.schema.json"), "utf8"));

// ---- load window.HUB from the content file ---------------------------------
function loadHub(path) {
  const src = readFileSync(path, "utf8");
  const sandbox = { window: {}, document: { title: "" } };
  createContext(sandbox);
  runInContext(src, sandbox, { filename: path });
  if (!sandbox.window.HUB) throw new Error("content did not assign window.HUB");
  return sandbox.window.HUB;
}

// ---- minimal JSON Schema walker --------------------------------------------
const errors = [];
const err = (p, m) => errors.push(`${p || "(root)"}: ${m}`);
const typeOf = (v) => (v === null ? "null" : Array.isArray(v) ? "array" : typeof v === "number" ? "number" : typeof v === "boolean" ? "boolean" : typeof v === "string" ? "string" : "object");

function checkType(val, t) {
  const types = Array.isArray(t) ? t : [t];
  const actual = typeOf(val);
  return types.some((ty) => (ty === "integer" ? actual === "number" : actual === ty));
}

function walk(val, sch, path) {
  if (!sch || typeof sch !== "object") return;
  if (sch.oneOf) {
    const ok = sch.oneOf.filter((s) => { const before = errors.length; const tmp = []; walkInto(val, s, path, tmp); return tmp.length === 0; });
    if (ok.length !== 1) err(path, `did not match exactly one of the allowed shapes (matched ${ok.length})`);
    return;
  }
  if (sch.type && !checkType(val, sch.type)) {
    err(path, `expected ${Array.isArray(sch.type) ? sch.type.join("|") : sch.type}, got ${typeOf(val)}`);
    return; // type wrong — deeper checks would be noise
  }
  if (sch.enum && !sch.enum.includes(val)) err(path, `value ${JSON.stringify(val)} not in enum [${sch.enum.join(", ")}]`);
  const t = typeOf(val);
  if (t === "object") {
    for (const req of sch.required || []) if (!(req in val)) err(path, `missing required property "${req}"`);
    for (const [k, v] of Object.entries(val)) {
      const sub = sch.properties && sch.properties[k];
      if (sub) walk(v, sub, path ? `${path}.${k}` : k);
      else if (sch.additionalProperties && typeof sch.additionalProperties === "object") walk(v, sch.additionalProperties, path ? `${path}.${k}` : k);
    }
  } else if (t === "array" && sch.items) {
    val.forEach((el, i) => walk(el, sch.items, `${path}[${i}]`));
  }
}
// oneOf helper: collect errors into a scratch array without polluting the main list
function walkInto(val, sch, path, sink) {
  const saved = errors.splice(0, errors.length);
  walk(val, sch, path);
  const produced = errors.splice(0, errors.length);
  errors.push(...saved);
  sink.push(...produced);
}

// ---- run ----
let HUB;
try { HUB = loadHub(contentPath); }
catch (e) { console.error(`✗ could not load ${contentPath}: ${e.message}`); process.exit(1); }

walk(HUB, schema, "");

// ---- semantic cross-checks (beyond the schema) -----------------------------
const stageKeys = new Set(Object.keys(HUB.STAGES || {}));
(HUB.leads || []).forEach((l, i) => {
  if (l.stage && !stageKeys.has(l.stage)) err(`leads[${i}].stage`, `"${l.stage}" is not a key of STAGES`);
});
const pfKeys = new Set(Object.keys(HUB.PF || {}));
(HUB.social || []).forEach((s, i) => {
  for (const k of Object.keys(s.posts || {})) if (!pfKeys.has(k)) err(`social[${i}].posts`, `platform "${k}" is not declared in PF`);
});
// nav views must resolve to an html entry or a built-in renderer type
const BUILTIN = new Set(["social", "ads", "gbp", "tp", "crm", "who"]);
const htmlKeys = new Set(Object.keys(HUB.html || {}));
const navViews = [];
(HUB.nav || []).forEach((sec) => (sec.items || []).forEach((it) => navViews.push(it.view)));
navViews.forEach((v) => {
  const vtype = (HUB.VIEWS && HUB.VIEWS[v] && HUB.VIEWS[v].type) || v;
  if (!htmlKeys.has(v) && !BUILTIN.has(v) && !["social", "ads", "gbp", "tp", "crm", "clients"].includes(vtype)) {
    err(`nav`, `view "${v}" has neither an html entry nor a built-in renderer`);
  }
});
// data-driven editorial must carry the mount contract
[["gbp", HUB.gbp], ["tp", HUB.tp]].forEach(([v, data]) => {
  if (data && HUB.html && HUB.html[v] && !/data-hub-mount/.test(HUB.html[v])) err(`html.${v}`, "missing the <div data-hub-mount> the renderer targets");
});
if ((HUB.clients || []).length && HUB.html && HUB.html.who && !/data-hub-mount/.test(HUB.html.who)) err("html.who", "clients supplied but html.who has no <div data-hub-mount>");
// defaultView should be a real nav view
if (HUB.defaultView && !navViews.includes(HUB.defaultView)) err("defaultView", `"${HUB.defaultView}" is not one of the nav views`);

// ---- report ----
if (errors.length) {
  console.error(`✗ ${contentPath}\n  ${errors.length} problem(s):`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log(`✓ ${contentPath} is a valid proposal-hub content instance (chassis 2.0.0).`);

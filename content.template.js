/* ============================================================================
 * proposal-hub — CONTENT TEMPLATE  (blank, annotated `window.HUB`)
 * ----------------------------------------------------------------------------
 * The human-readable schema. The machine contract is content.schema.json
 * (validate with `node validate-content.mjs`). `hub.html` is the generic,
 * version-pinned chassis and is never edited per pitch; it renders entirely
 * from window.HUB. To start a pitch, copy the neutral sample content.js and
 * replace its values, keeping this shape.
 *
 * BOUNDARY: agency brand (colours, fonts, logo, name, language) is config in
 * `agency`. Platform-faithful colours (Google/Trustpilot/Facebook/social) are
 * chassis constants, never here. Images are PATHS in the data (the chassis owns
 * no asset root); the conventional layout is assets/{social,clients,people,ads,gbp}/.
 *
 * VOICE RULES (house style — apply to every string):
 *   - No em-dashes. No emojis/exclamation marks in agency-voice copy (the
 *     social/ads MOCKUP captions may use them; they imitate the feed).
 *   - Second person, sentence-case long headings, American English.
 *   - Hedge current-state audits with "may / could / might". Never overclaim.
 * ========================================================================== */

var WEB = "website/";   // base path the embedded website prototype is served at.

window.HUB = {

  /* ---- AGENCY (the pitching org; fixed across this agency's pitches) -------
   * Pure config. The chassis holds a brand-NEUTRAL default and overrides from here. */
  agency: {
    name: "Agency",                 // sidebar brand line 1
    unit: "Studio",                 // sidebar brand line 2 (small-caps subtitle)
    org:  "Agency Studio",          // full name; used in the document title
    lang: "en",                     // <html lang>
    logo: "<svg viewBox='0 0 32 32'>…</svg>",   // inline SVG string, OR { src: "logo.svg" }
    favicon: "favicon.svg",
    tokens: {                       // any subset; omitted keys keep the neutral default
      accent: "#4f46e5", accentStrong: "#4338ca", accentSoft: "#e7e7fb",
      ink: "#111114", ink2: "#1c1c22", inkMuted: "rgba(17,17,20,.56)",
      sidebar: "#111114", bg: "#f7f7f5", bgAlt: "#ededea", hairline: "rgba(17,17,20,.12)",
      onDark: "#f7f7f5",            // logo / brand text on the dark sidebar
    },
    fonts: {                        // optional; omit for a dependency-free system stack
      display: "Georgia,serif", body: "system-ui,sans-serif",
      // import: "https://fonts.googleapis.com/css2?family=…",  // injects a <link>
    },
  },

  /* ---- PITCH (who this hub is for) --------------------------------------- */
  brand: {
    proposalFor: "Client Name",                 // "Proposal for <b>___</b>"
    foot: "Agency Studio.<br>A proposal for Client Name. " +
          "Surfaces are review candidates, not the live site.",
  },
  favicon: "favicon.svg",                        // fallback if agency.favicon is unset
  // title: "Proposal for Client Name",          // optional document-title override
  defaultView: "intro",                          // hub root + no-hash opens here
  WEB: "website/",

  /* ---- NAV (order, labels, per-view icon, section groups, badges) --------
   * Each item maps to <section id="view-{view}"> and to an html key OR a built-in
   * renderer (social/ads/gbp/tp/crm/clients). `icon` is an inline SVG (the chassis
   * ships none). To TURN A SECTION OFF: delete its item (and its html/data). `badge`
   * is the count chip. */
  nav: [
    { section: "Project", items: [
      { view: "intro",   label: "Intro",           icon: "<svg class='ic' …></svg>" },
      { view: "recs",    label: "Recommendations", icon: "<svg class='ic' …></svg>" },
      { view: "who",     label: "Who We Are",      icon: "<svg class='ic' …></svg>" },
      { view: "people",  label: "Key People",      icon: "<svg class='ic' …></svg>" },
    ]},
    { section: "Website Hub", items: [
      { view: "website", label: "Website",         icon: "<svg class='ic' …></svg>" },
      { view: "cluster", label: "Content Cluster", icon: "<svg class='ic' …></svg>" },
    ]},
    { section: "Social Hub", items: [
      { view: "social",  label: "Organic Posts",  icon: "<svg class='ic' …></svg>", badge: 0 },
      { view: "ads",     label: "Meta Ads",       icon: "<svg class='ic' …></svg>", badge: 0 },
      { view: "gbp",     label: "Google Business", icon: "<svg class='ic' …></svg>" },
      { view: "tp",      label: "Trustpilot",     icon: "<svg class='ic' …></svg>" },
    ]},
    { section: "CRM", items: [
      { view: "crm",     label: "Leads &amp; pipeline", icon: "<svg class='ic' …></svg>", badge: 0 },
    ]},
  ],

  /* ---- PER-VIEW TOOLBAR + TYPE -------------------------------------------
   * Keyed by view. Fields: title, sub, open+openLabel (top-right button; omit
   * `open` to hide it), tbBadge (pill), infoPane (side-pane button), and `type`
   * (which VIEW_TYPES renderer mounts it — default "static" = html-only). A new
   * KIND of service view sets `type` here and registers that type in hub.html's
   * VIEW_TYPES registry. */
  VIEWS: {
    intro:   { title: "Intro", sub: "One-line framing", open: WEB, openLabel: "Open the website ↗" },
    website: { title: "Website", sub: "Functional prototype", open: WEB, openLabel: "Open in new tab ↗",
               tbBadge: "Functional prototype", infoPane: true },
    // ...one entry per view. See content.js for the full set.
  },

  /* ---- SOCIAL: platform chrome + organic posts --------------------------
   * PF declares the platforms. The Organic Posts view is PLATFORM-AGNOSTIC: the
   * chips and card grids derive from whichever PF platforms the posts below use.
   * Each post img is a PATH in the data. */
  PF: {
    linkedin:  { name: "LinkedIn",  cls: "li", tag: "in" },
    facebook:  { name: "Facebook",  cls: "fb", tag: "f"  },   // drop if unused
    instagram: { name: "Instagram", cls: "ig", tag: "◉" },   // drop if unused
  },
  // Optional heading/lede/allLabel; omit and the chassis derives them from counts.
  // socialMeta: { heading: "Social hub: <campaign>", lede: "… &middot; …", allLabel: "All platforms" },
  // crmMeta:    { heading: "Leads & pipeline", lede: "Every enquiry captured with source …" },
  social: [   // one entry per project; renders a card per platform the post has
    { slug: "project-slug", title: "Project title", location: "Town",
      img: "assets/social/project-slug.png",
      article: WEB + "resources/projects/project-slug/",
      posts: {                       // include only the platforms this pitch uses
        linkedin:  { cap: "Long-form, story-led.", tags: ["#Tag"] },
        facebook:  { cap: "Warmer; feed emoji ok.", tags: [] },
        instagram: { cap: "Punchy; link in bio.", tags: ["#tag"] },
      }},
  ],

  /* ---- CRM: stages (ORDERED map; chassis derives filter order from key order) --- */
  STAGES: { "New":"st-new","Contacted":"st-contacted","Site visit booked":"st-visit",
            "Quoted":"st-quoted","Won":"st-won","Lost":"st-lost" },
  leads: [   // field names below are what the renderer reads (drawer + table)
    { id: "L-1001", name: "Lead Name", email: "name@email.com", phone: "07700 900000",
      postcode: "SK0 0AA", projectType: "Project type", idealStart: "In 3 to 6 months",
      message: "What they asked for.",
      page: "Meta Instant Form · Ad 2", pageUrl: null,     // pageUrl: a link, or null
      srcShort: "Meta lead form", srcKind: "paid",         // srcKind: paid|social|organic|direct
      utm: { source: "facebook", medium: "paid-social", campaign: "-", content: "-", term: "-" },
      stage: "New",                                        // MUST be a key of STAGES
      date: "1 Jul 2026", notes: "Internal note." },
  ],

  /* ---- GOOGLE BUSINESS PROFILE (mockup data) ----------------------------
   * name falls back to brand.proposalFor. photos/posts/products carry image PATHS.
   * dist:[{s,p}] drives the rating bars (nothing hardcoded). Editorial + the
   * <div data-hub-mount> live in html.gbp. */
  gbp: { /* name, category, address, hours, phone, website, attrs, photos:[path],
            rating, reviewCount, dist:[{s,p}], reviews:[{author,when,rating,text,ownerReply}],
            posts:[{type,title,body,cta,img}], products:[{name,price,desc,img}], qa:[{q,a}] */ },

  /* ---- TRUSTPILOT (mockup data) ------------------------------------------
   * name falls back to brand.proposalFor. Editorial + <div data-hub-mount> in html.tp. */
  tp:  { /* name, domain, score, reviewCount, label, dist:[{s,p}],
            reviews:[{author,loc,nrev,rating,when,title,body,doe,reply}] */ },

  /* ---- WEBSITE INFO-PANE (optional side panel; injected when infoPane:true) --- */
  sitepane: "<!-- optional: <p class=\"sitepane__lede\">…</p> + sp-point blocks -->",

  /* ---- CLIENT WALL (Who We Are) — rendered into html.who's <div data-hub-mount> --- */
  clients: [
    { name: "Client", logo: "assets/clients/client.svg",   // path, or omit for a text mark
      desc: "One line on who they are.",
      did:  "Condensed scope of what we did." },
  ],

  /* ---- EDITORIAL / STATIC-HTML VIEWS ------------------------------------
   * Bespoke HTML strings, keyed by view. A DATA-DRIVEN view's editorial (gbp/tp/who)
   * must contain exactly one <div data-hub-mount></div> where the mockup renders. */
  html: {
    intro:   "<!-- see content.js (neutral sample) for the full markup -->",
    recs:    "<!-- 01 Where you stand today → 02 The strategy → 03 What we build → 04 How it adds up -->",
    who:     "<!-- approach + service lines + <div class=\"cwall\" data-hub-mount></div> -->",
    people:  "<!-- key-people cards -->",
    website: "<iframe title=\"Website prototype\" srcdoc=\"…\"></iframe>",
    cluster: "<!-- content-cluster SVG map -->",
    ads:     "<!-- Meta feed ad + lead-form carousel + lead modal -->",
    gbp:     "<!-- audit editorial + <div class=\"g\" data-hub-mount></div> -->",
    tp:      "<!-- audit editorial + <div class=\"tp\" data-hub-mount></div> -->",
  },

};

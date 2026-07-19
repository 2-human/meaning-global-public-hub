/* review-mode.js — review widget (loads ONLY on ?review=1). Classic script.
 *
 * Light cut (Credo shape): banner + comments sidebar (Active / Applied / Archived)
 * + floating add-comment pill + composer modal. Three-state comment lifecycle
 * (pending | applied | archived) per comment-lifecycle.md. Name-prompt on first
 * comment. NO auth, NO Firebase required — persists to localStorage, keyed by
 * page path. A clearly-marked Firebase seam (§FIREBASE SEAM) is left for a later
 * upgrade per firebase-rtdb-adapter.md, but the widget is fully functional without it.
 *
 * IIFE-wrapped per js-isolation.md — every helper (el, esc, render, init, state,
 * counters, …) is a local binding of this IIFE and NEVER occupies the host page's
 * top-level scope. The only cross-boundary surface is a single window.__review
 * namespace. Config is read through window.MG_REVIEW_CONFIG (may be absent) and
 * labels through window.MG_REVIEW_LABELS — never through bare host globals.
 *
 * TDZ-safe init order per FEATURE.md: the cfg-guard + init() are the FINAL
 * statements in this file, after every module-level const has executed.
 */
(function () {
  'use strict';

  /* ---- Config + labels (both optional; degrade to localStorage cleanly) ---- */
  var CFG = window.MG_REVIEW_CONFIG || {};

  var LABELS = Object.assign({
    bannerTitle: 'Review mode',
    localOnly: 'Local draft',
    exit: 'Exit review',
    sidebarTitle: 'Comments',
    tabActive: 'Active',
    tabApplied: 'Applied',
    tabArchived: 'Archived',
    emptyActive: 'No open comments yet. Hover any heading, paragraph, or list item and click the +.',
    emptyApplied: 'Nothing applied yet.',
    emptyArchived: 'Nothing archived.',
    addTitle: 'Add a comment',
    editTitle: 'Edit comment',
    commentLabel: 'Comment',
    commentPlaceholder: 'What should change, and why?',
    replacementLabel: 'Suggested replacement',
    replacementPlaceholder: 'Optional — paste the exact wording you would use instead.',
    requiredError: 'Add a comment or a suggested replacement.',
    save: 'Post comment',
    saveEdit: 'Save changes',
    cancel: 'Cancel',
    apply: 'Apply',
    edit: 'Edit',
    archive: 'Archive',
    restore: 'Restore',
    del: 'Delete',
    confirmDelete: 'Delete this comment?',
    namePrompt: 'Your name (shown next to your comments):',
    anon: 'Anonymous',
    toggleButton: 'Comments',
    toggleButtonTitle: 'Open comment review mode',
    savedToast: 'Comment saved',
    appliedToast: 'Marked applied',
    archivedToast: 'Archived',
    restoredToast: 'Restored to active',
    deletedToast: 'Deleted'
  }, CFG.REVIEW_LABELS || {}, window.MG_REVIEW_LABELS || {});

  /* ============================ FIREBASE SEAM ============================
   * The light cut ships WITHOUT Firebase and never touches the network. To
   * upgrade to shared/multi-reviewer persistence later (per firebase-rtdb-adapter.md):
   *   1. Set window.MG_REVIEW_CONFIG.FIREBASE_CONFIG = { apiKey, databaseURL, ... }.
   *   2. Implement firebaseAdapter() below (dynamic-import the v10 modular SDK,
   *      subscribe broad to /comments, filter by `page` client-side; the 4-op
   *      interface — subscribe / create / update / remove — is already what the
   *      widget calls, so nothing else changes).
   * FB_OK stays false unless a real (non-placeholder) config is present, so the
   * localStorage adapter is the default and only active path today. */
  var FB = CFG.FIREBASE_CONFIG || {};
  var FB_OK = !!(FB.apiKey && FB.apiKey.indexOf('PASTE') !== 0 &&
                 FB.databaseURL && FB.databaseURL.indexOf('PASTE') < 0);
  /* function firebaseAdapter() { ... }  // <- implement here when FB_OK can be true */
  /* ====================================================================== */

  /* ---- Storage: localStorage with an in-memory fallback ---- */
  var _MEM = {};
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return (k in _MEM) ? _MEM[k] : null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { _MEM[k] = v; } }
  };

  /* ---- Page slug + per-page storage key ---- */
  function pageSlug() {
    var p = window.location.pathname.replace(/\/index\.html?$/i, '');
    if (p === '' || p === '/') return 'home';
    return p.replace(/^\/|\/$/g, '').replace(/\//g, '-') || 'home';
  }
  var SLUG = pageSlug();
  var STORE_KEY = 'mg_review_comments:' + SLUG;   // localStorage light-cut key, per page path
  var NAME_KEY = 'mg_review_reviewer';

  /* ---- Reviewer identity (prompt on first comment) ---- */
  function reviewer() {
    var n = store.get(NAME_KEY);
    if (!n) {
      n = (window.prompt(LABELS.namePrompt, '') || LABELS.anon).trim() || LABELS.anon;
      store.set(NAME_KEY, n);
    }
    return n;
  }

  /* ---- Status normalize (reader shim for legacy boolean records) ---- */
  function statusOf(c) {
    if (!c) return 'pending';
    if (c.status === 'applied' || c.status === 'archived' || c.status === 'pending') return c.status;
    if (c.archived === true) return 'archived';
    if (c.applied === true) return 'applied';
    return 'pending';
  }

  /* ---- localStorage adapter (same 4-op interface a Firebase adapter fills) ---- */
  function localAdapter() {
    var cb = null;
    var read = function () { try { return JSON.parse(store.get(STORE_KEY) || '{}'); } catch (e) { return {}; } };
    var write = function (o) { store.set(STORE_KEY, JSON.stringify(o)); };
    var ping = function () { if (cb) cb(read()); };
    return {
      local: true,
      subscribe: function (fn) {
        cb = fn; fn(read());
        window.addEventListener('storage', function (e) { if (e.key === STORE_KEY && cb) cb(read()); });
        return function () { cb = null; };
      },
      create: function (rec) {
        var o = read(); var id = 'c' + Date.now() + Math.random().toString(36).slice(2, 7);
        o[id] = rec; write(o); ping(); return Promise.resolve(id);
      },
      update: function (id, patch) {
        var o = read(); o[id] = Object.assign({}, o[id], patch); write(o); ping(); return Promise.resolve();
      },
      remove: function (id) { var o = read(); delete o[id]; write(o); ping(); return Promise.resolve(); }
    };
  }

  /* ---- DOM + text helpers (all IIFE-local) ---- */
  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  function esc(s) {
    return (s == null ? '' : String(s)).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function when(ts) {
    var d = new Date(ts || Date.now());
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  function sel(anchor) {
    return '[data-comment-id="' + (window.CSS && CSS.escape ? CSS.escape(anchor) : anchor) + '"]';
  }
  function emit(name, detail) {
    try { document.dispatchEvent(new CustomEvent('review:' + name, { detail: detail })); } catch (e) {}
  }

  /* ---- Anchoring ---- */
  // Prose blocks PLUS media, interactive controls and the site's own components,
  // so a reviewer can comment on everything on a page, not just text. Because
  // anchorPass() tags the INNERMOST matching element under the cursor, a card and
  // the heading/paragraph/image inside it are each independently commentable.
  var ANCHOR_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'blockquote',
    'img', 'figure', 'video',                                  // media
    '.btn', '.nav__link', '.cta-row',                          // interactive / calls to action
    '.card', '.pcard', '.media-card', '.svc', '.rung',         // cards, tiles, rows
    '.pullpanel', '.split', '.credbar', '.quote',              // panels and pull-content
    '.hero', '.imghead', '.sec-head',                          // page and section heads
    '.founder', '.founder__book', '.founder__actions',         // founder band
    '.tslider', '.tslide',                                     // testimonial slider
    '.hexseg', '.hexstage']                                    // the interactive hexagon
    .concat(Array.isArray(CFG.ANCHOR_TAGS_EXTRA) ? CFG.ANCHOR_TAGS_EXTRA : []);
  // Only the widget's OWN chrome is off-limits; the site's header/nav/footer are
  // page content a reviewer may want to comment on.
  var CHROME_SEL = '.review-banner,.review-sidebar,.review-modal-overlay,.review-pill,' +
    '.review-toast,[data-review-skip]';

  function anchorPass() {
    var seen = new Set(), counters = {};
    var opt = Array.prototype.slice.call(document.querySelectorAll('[data-comment-target]'));
    var tagged = Array.prototype.slice.call(document.querySelectorAll(ANCHOR_TAGS.join(',')));
    opt.concat(tagged).forEach(function (elm) {
      if (seen.has(elm)) return; seen.add(elm);
      if (elm.closest(CHROME_SEL)) return;
      if (elm.hasAttribute('data-comment-id')) return;
      var mediaSelf = /^(img|video|picture|svg)$/i.test(elm.tagName);
      if (!mediaSelf && (elm.textContent || '').trim().length < 2 && !elm.querySelector('img,video,svg')) return;
      var tag = elm.tagName.toLowerCase();
      counters[tag] = (counters[tag] || 0) + 1;
      elm.setAttribute('data-comment-id', SLUG + '-' + tag + '-' + counters[tag]);
    });
  }

  /* ---- Module state ---- */
  var state = { cfg: CFG, me: null, adapter: null, comments: {}, filter: 'active', selId: null, selAnchor: null };
  var els = { side: null, list: null, tabs: null, pill: null, pillCur: null };
  var hideTimer = null;
  var TAB_STATUS = { active: 'pending', applied: 'applied', archived: 'archived' };

  /* ---- Toast ---- */
  function toast(msg, isErr) {
    var t = el('div', 'review-toast' + (isErr ? ' err' : ''), esc(msg));
    document.body.appendChild(t);
    setTimeout(function () { t.parentNode && t.parentNode.removeChild(t); }, 2200);
  }

  /* ---- Chrome (banner + sidebar + pill) ---- */
  function buildChrome() {
    var ban = el('div', 'review-banner');
    ban.innerHTML = '<span class="title">' + esc(LABELS.bannerTitle) + '</span>' +
      (state.adapter.local ? '<span class="local">' + esc(LABELS.localOnly) + '</span>' : '') +
      '<span class="spacer"></span><span class="name">' + esc(state.me) + '</span>';
    var exit = el('button', null, esc(LABELS.exit));
    exit.onclick = function () {
      var u = new URL(location.href); u.searchParams.delete('review'); location.href = u.toString();
    };
    ban.appendChild(exit);
    document.body.appendChild(ban);

    els.side = el('aside', 'review-sidebar');
    els.side.appendChild(el('h3', null, esc(LABELS.sidebarTitle)));
    els.tabs = el('div', 'review-tabs');
    [['active', LABELS.tabActive], ['applied', LABELS.tabApplied], ['archived', LABELS.tabArchived]].forEach(function (pair) {
      var k = pair[0];
      var b = el('button', k === state.filter ? 'on' : null, esc(pair[1]) + ' <span class="count">0</span>');
      b.dataset.k = k;
      b.onclick = function () {
        state.filter = k;
        els.tabs.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x.dataset.k === k); });
        render();
      };
      els.tabs.appendChild(b);
    });
    els.side.appendChild(els.tabs);
    els.list = el('div', 'review-list');
    els.side.appendChild(els.list);
    document.body.appendChild(els.side);

    els.pill = el('button', 'review-pill', esc('+ ' + LABELS.addTitle));
    els.pill.type = 'button';
    els.pill.setAttribute('data-review-skip', '');
    document.body.appendChild(els.pill);
    els.pill.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
    els.pill.addEventListener('mouseleave', hidePillSoon);
    els.pill.addEventListener('click', function () { if (els.pillCur) openComposer(els.pillCur.getAttribute('data-comment-id'), els.pillCur); });
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(CHROME_SEL)) return;
      var a = e.target.closest('[data-comment-id]');
      if (a) { clearTimeout(hideTimer); placePill(a); }
    });
    document.addEventListener('mouseout', function (e) {
      var to = e.relatedTarget;
      if (to && (to === els.pill || (to.closest && to.closest('[data-comment-id]')))) return;
      hidePillSoon();
    });
    window.addEventListener('scroll', function () { if (els.pillCur && els.pill.style.display === 'block') placePill(els.pillCur); }, true);
  }
  function placePill(elm) {
    els.pillCur = elm;
    els.pill.style.display = 'block';
    var r = elm.getBoundingClientRect();
    els.pill.style.top = Math.max(52, Math.min(r.top + 6, window.innerHeight - 34)) + 'px';
    els.pill.style.left = Math.max(6, r.right - els.pill.offsetWidth - 8) + 'px';
  }
  function hidePillSoon() {
    hideTimer = setTimeout(function () { els.pill.style.display = 'none'; els.pillCur = null; }, 140);
  }

  /* ---- Composer modal ---- */
  function modal(title, ctx, initText, initRepl, onSave) {
    var ov = el('div', 'review-modal-overlay');
    var m = el('div', 'review-modal');
    m.innerHTML = '<h4>' + esc(title) + '</h4><div class="ctx">' + esc(ctx) + '</div>';
    var lc = el('label', null, esc(LABELS.commentLabel));
    var ta = el('textarea'); ta.placeholder = LABELS.commentPlaceholder; ta.value = initText || '';
    var lr = el('label', null, esc(LABELS.replacementLabel));
    var tr = el('textarea'); tr.placeholder = LABELS.replacementPlaceholder; tr.value = initRepl || ''; tr.style.minHeight = '48px';
    var errBox = el('div', 'err'); errBox.style.display = 'none';
    var acts = el('div', 'modal-acts');
    var cancel = el('button', 'review-btn review-btn--secondary', esc(LABELS.cancel));
    cancel.onclick = function () { ov.remove(); };
    var save = el('button', 'review-btn review-btn--primary', esc(initText != null || initRepl != null ? LABELS.saveEdit : LABELS.save));
    save.onclick = function () {
      var t = ta.value.trim(), r = tr.value.trim();
      if (!t && !r) { errBox.textContent = LABELS.requiredError; errBox.style.display = 'block'; return; }
      onSave(t, r); ov.remove();
    };
    acts.appendChild(cancel); acts.appendChild(save);
    m.appendChild(lc); m.appendChild(ta); m.appendChild(lr); m.appendChild(tr); m.appendChild(errBox); m.appendChild(acts);
    ov.appendChild(m);
    ov.onclick = function (e) { if (e.target === ov) ov.remove(); };
    document.body.appendChild(ov);
    ta.focus();
  }
  function openComposer(anchor, elm) {
    if (!state.me) state.me = reviewer();
    var prev = (elm.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80) ||
      ((elm.querySelector('img,video,svg') || /^(img|video|picture|svg)$/i.test(elm.tagName)) ? '[media]' : '');
    modal(LABELS.addTitle, anchor, null, null, function (text, repl) {
      state.adapter.create({
        comment: text, replacement: repl || null, anchor: anchor, page: SLUG, author: state.me,
        status: 'pending', timestamp: Date.now(), text_preview: prev,
        url: location.href, user_agent: navigator.userAgent
      }).then(function () { toast(LABELS.savedToast); emit('comment-created', { anchor: anchor, page: SLUG }); })
        .catch(function (e) { toast(String(e), true); });
    });
  }

  /* ---- Row action helper ---- */
  function actBtn(label, cls, fn) {
    var b = el('button', cls, esc(label));
    b.onclick = function (ev) { ev.stopPropagation(); fn(); };
    return b;
  }
  function transition(id, patch, event, toastMsg) {
    state.adapter.update(id, patch)
      .then(function () { toast(toastMsg); emit(event, { id: id }); })
      .catch(function (e) { toast(String(e), true); });
  }

  /* ---- Render ---- */
  function render() {
    var all = Object.keys(state.comments).map(function (id) { return [id, state.comments[id]]; })
      .filter(function (kv) { return kv[1] && kv[1].page === SLUG; });

    var counts = { pending: 0, applied: 0, archived: 0 };
    all.forEach(function (kv) { var s = statusOf(kv[1]); counts[s] = (counts[s] || 0) + 1; });
    els.tabs.querySelectorAll('button').forEach(function (b) {
      b.querySelector('.count').textContent = counts[TAB_STATUS[b.dataset.k]] || 0;
    });

    // Outline decoration on anchored elements
    document.querySelectorAll('.has-comment,.has-applied-comment').forEach(function (e) {
      e.classList.remove('has-comment', 'has-applied-comment');
    });
    all.forEach(function (kv) {
      var s = statusOf(kv[1]);
      if (s === 'archived') return;
      document.querySelectorAll(sel(kv[1].anchor)).forEach(function (a) {
        a.classList.add(s === 'applied' ? 'has-applied-comment' : 'has-comment');
      });
    });

    // Rows for the current tab
    var want = TAB_STATUS[state.filter];
    var rows = all.filter(function (kv) { return statusOf(kv[1]) === want; })
      .sort(function (a, b) { return (a[1].timestamp || 0) - (b[1].timestamp || 0); });
    els.list.innerHTML = '';
    if (!rows.length) {
      var msg = state.filter === 'applied' ? LABELS.emptyApplied : state.filter === 'archived' ? LABELS.emptyArchived : LABELS.emptyActive;
      els.list.appendChild(el('div', 'empty', esc(msg)));
      applyActive();
      return;
    }
    rows.forEach(function (kv) {
      var id = kv[0], c = kv[1], s = statusOf(c);
      var row = el('div', 'review-comment' + (id === state.selId ? ' rw-selected' : ''));
      row.innerHTML =
        '<div class="meta"><b>' + esc(c.author || LABELS.anon) + '</b>' +
        '<span class="badge rw-' + s + '">' + esc(s) + '</span>' +
        '<span>' + when(c.timestamp) + (c.edited_at ? ' · edited' : '') + '</span></div>' +
        (c.comment ? '<div class="text">' + esc(c.comment) + '</div>' : '') +
        (c.replacement ? '<div class="replacement">↳ ' + esc(c.replacement) + '</div>' : '') +
        '<div class="anchor">' + esc(c.anchor) + '</div>';
      var acts = el('div', 'actions');
      // Full three-state button sets (comment-lifecycle.md §"commentLifecycleMode: 'full'")
      if (s === 'pending') {
        acts.appendChild(actBtn(LABELS.apply, 'apply-btn', function () {
          transition(id, { status: 'applied', applied_at: Date.now() }, 'comment-applied', LABELS.appliedToast);
        }));
        acts.appendChild(actBtn(LABELS.edit, 'edit-btn', function () {
          modal(LABELS.editTitle, c.anchor, c.comment || '', c.replacement || '', function (t, r) {
            transition(id, { comment: t, replacement: r || null, edited_at: Date.now() }, 'comment-edited', LABELS.savedToast);
          });
        }));
        acts.appendChild(actBtn(LABELS.archive, 'archive-btn', function () {
          transition(id, { status: 'archived', archived_at: Date.now() }, 'comment-archived', LABELS.archivedToast);
        }));
      } else if (s === 'applied') {
        acts.appendChild(actBtn(LABELS.restore, 'restore-btn', function () {
          transition(id, { status: 'pending', applied_at: null }, 'comment-restored', LABELS.restoredToast);
        }));
        acts.appendChild(actBtn(LABELS.archive, 'archive-btn', function () {
          transition(id, { status: 'archived', archived_at: Date.now() }, 'comment-archived', LABELS.archivedToast);
        }));
      } else { // archived
        acts.appendChild(actBtn(LABELS.restore, 'restore-btn', function () {
          transition(id, { status: 'pending', archived_at: null }, 'comment-restored', LABELS.restoredToast);
        }));
      }
      acts.appendChild(actBtn(LABELS.del, 'delete-btn', function () {
        if (!window.confirm(LABELS.confirmDelete)) return;
        state.adapter.remove(id).then(function () { toast(LABELS.deletedToast); emit('comment-deleted', { id: id, snapshot: c }); })
          .catch(function (e) { toast(String(e), true); });
      }));
      row.appendChild(acts);
      row.onclick = function () { state.selId = id; spotlight(c.anchor); render(); };
      els.list.appendChild(row);
    });
    applyActive();
  }

  /* ---- Spotlight (persistent strong ring + one-shot pulse) ---- */
  function applyActive() {
    document.querySelectorAll('.rw-active-anchor').forEach(function (e) { e.classList.remove('rw-active-anchor'); });
    if (!state.selAnchor) return;
    document.querySelectorAll(sel(state.selAnchor)).forEach(function (a) { a.classList.add('rw-active-anchor'); });
  }
  function spotlight(anchor) {
    state.selAnchor = anchor;
    applyActive();
    var a = document.querySelector(sel(anchor));
    emit('spotlight-activated', { anchor: anchor });
    if (!a) return;
    a.scrollIntoView({ behavior: 'smooth', block: 'center' });
    a.classList.remove('rw-spot'); void a.offsetWidth; a.classList.add('rw-spot');
    setTimeout(function () { a.classList.remove('rw-spot'); }, 1200);
  }

  /* ---- init ---- */
  function init() {
    state.adapter = localAdapter(); // FIREBASE SEAM: swap to firebaseAdapter() when FB_OK
    buildChrome();
    anchorPass();
    // Dynamic content added after init picks up anchors on the next observer tick.
    try {
      // The widget's own chrome (banner/sidebar/pill/modal/toast) lives inside
      // <body>, so render()'s writes to the sidebar list would retrigger this
      // observer and loop forever, freezing the page. Only react to mutations
      // that add real page content — never the widget's own chrome.
      var CHROME_ROOTS = '.review-banner,.review-sidebar,.review-pill,.review-modal-overlay,.review-toast';
      var isChrome = function (n) {
        return !!(n && n.nodeType === 1 && n.closest && n.closest(CHROME_ROOTS));
      };
      var mo = new MutationObserver(function (muts) {
        var relevant = muts.some(function (m) {
          if (isChrome(m.target)) return false;            // change within chrome
          return Array.prototype.some.call(m.addedNodes || [], function (n) {
            return n.nodeType === 1 && !isChrome(n) &&
                   !(n.matches && n.matches(CHROME_ROOTS)); // a non-chrome node was added
          });
        });
        if (relevant) { anchorPass(); render(); }
      });
      mo.observe(document.body, { childList: true, subtree: true });
      document.addEventListener('review:exited', function () { mo.disconnect(); });
    } catch (e) {}
    state.adapter.subscribe(function (data) { state.comments = data || {}; render(); });
    emit('review-entered', { page: SLUG });
  }

  /* ---- Namespaced cross-boundary export (the ONLY global the widget occupies) ---- */
  window.__review = window.__review || {};
  window.__review.refresh = render;   // re-render hook (e.g. variant-anchors)
  window.__review.state = state;      // debug handle only

  /* ---- cfg-guard + init() as the FINAL statements (TDZ-safe) ----
   * FB_OK is false in the light cut, so the localStorage fallback always runs. */
  if (FB_OK || /* localStorage fallback */ true) init();
})();

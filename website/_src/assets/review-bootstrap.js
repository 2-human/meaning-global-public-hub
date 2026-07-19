/* review-bootstrap.js — inert-by-default loader for the review widget.
 *
 *   No ?review=1  -> injects ONLY a floating entry button (bottom-right).
 *                    No widget chrome, no CSS load, no JS module load, no backend.
 *   ?review=1     -> sets <html data-review-mode="on">, then dynamically loads
 *                    review-mode.css + review-mode.js and the widget comes up.
 *
 * Light cut (Credo shape): localStorage-backed, no auth, no Firebase required.
 *
 * IIFE-wrapped per js-isolation.md — none of its helpers reach the host page's
 * top-level scope. Asset paths resolve relative to THIS script's own <script src>
 * (not the page URL) per FEATURE.md §"Asset-path resolution (multi-depth sites)",
 * because pages sit at varying depths under website/ and a bare "review-mode.css"
 * would 404 against whatever depth the current page happens to live at.
 */
(function () {
  'use strict';

  var cfg = window.MG_REVIEW_CONFIG || {};
  var L = Object.assign({}, cfg.REVIEW_LABELS || {}, window.MG_REVIEW_LABELS || {});
  var active = new URLSearchParams(window.location.search).get('review') === '1';

  /* Resolve this bootstrap's own directory so review-mode.{css,js} load from
   * beside the widget files regardless of the host page's path depth. With
   * `defer` (the recommended tag), document.currentScript is null at run time,
   * so fall back to scanning for the script whose src ends in review-bootstrap.js. */
  function selfBaseDir() {
    var s = document.currentScript;
    if (!s || !s.src) {
      var all = document.getElementsByTagName('script');
      for (var i = all.length - 1; i >= 0; i--) {
        if (all[i].src && /review-bootstrap\.js(\?|$)/.test(all[i].src)) { s = all[i]; break; }
      }
    }
    var src = (s && s.src) || '';
    // Strip the filename (+ any ?query#hash), keep the trailing directory.
    return src.replace(/[?#].*$/, '').replace(/[^\/]*$/, '');
  }

  /* ---- Inert path: entry button only (per inert-entry-button.md) ---- */
  if (!active) {
    var injectEntryButton = function () {
      if (document.querySelector('.review-toggle-btn')) return;
      /* Self-contained inline <style> — review-mode.css is NOT loaded on the
       * inert path. Colors resolved to the Meaning Global palette (primary-deep
       * navy #1B2A4A, primary-darker #12203A, surface-base bone #F5F1E9); a
       * stylesheet's CSS vars are unavailable here, so tokens are inlined. */
      var st = document.createElement('style');
      st.textContent =
        '.review-toggle-btn{position:fixed;bottom:20px;right:20px;z-index:9990;' +
        'background:#1B2A4A;color:#F5F1E9;border:none;padding:12px 20px;border-radius:999px;' +
        'cursor:pointer;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;' +
        'font-size:13px;font-weight:600;letter-spacing:.04em;box-shadow:0 4px 14px rgba(12,15,22,.18);' +
        'transition:transform .15s,box-shadow .15s,background .15s;display:inline-flex;align-items:center;gap:8px}' +
        '.review-toggle-btn:hover{transform:translateY(-1px);background:#12203A;box-shadow:0 6px 20px rgba(12,15,22,.24)}' +
        '.review-toggle-btn:active{transform:translateY(0)}' +
        '.review-toggle-btn::before{content:"\\1F4AC";font-size:14px;line-height:1}' +
        '@media print{.review-toggle-btn{display:none}}';
      document.head.appendChild(st);

      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'review-toggle-btn';
      b.setAttribute('data-review-skip', '');
      b.title = L.toggleButtonTitle || 'Open comment review mode';
      b.textContent = L.toggleButton || 'Comments';
      b.addEventListener('click', function () {
        var u = new URL(window.location.href);
        u.searchParams.set('review', '1');
        window.location.href = u.toString(); // hard reload — activates on next load
      });
      document.body.appendChild(b);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectEntryButton);
    } else {
      injectEntryButton();
    }
    return; // inert path stops here — no widget chrome, no asset loads
  }

  /* ---- Active path: bring up the widget ---- */
  var base = selfBaseDir();
  document.documentElement.setAttribute('data-review-mode', 'on');

  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = base + 'review-mode.css';
  document.head.appendChild(css);

  var js = document.createElement('script');
  js.src = base + 'review-mode.js';
  js.defer = true;
  document.body.appendChild(js);
})();

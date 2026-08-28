/* SSC pre-login welcome screen. Vanilla JS, no dependencies.
   - Shows only while body.firebase-auth-required (login overlay state).
   - Dismissed once per session (sessionStorage) so a failed login does not
     bounce the user back to the welcome page.
   - Hands the typed email straight into #fbLoginEmail and focuses password. */
(function () {
  'use strict';

  var SEEN_KEY = 'ssc-welcome-seen';
  var FADE_MS = 500;
  var FADE_OUT_BEFORE_END_S = 0.55;

  function seen() {
    try { return sessionStorage.getItem(SEEN_KEY) === '1'; } catch (e) { return false; }
  }
  function markSeen() {
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch (e) { /* ignore */ }
  }

  function init() {
    var root = document.getElementById('sscWelcome');
    if (!root) return;
    var body = document.body;

    if (seen()) return; /* leave hidden — login overlay shows normally */
    body.classList.add('ssc-welcome-active');

    /* If auth resolves to "authenticated" (remember-me), the welcome
       element is display:none via CSS, but drop the class anyway so the
       body overflow lock is released. */
    var mo = new MutationObserver(function () {
      if (body.classList.contains('firebase-authenticated')) {
        body.classList.remove('ssc-welcome-active');
        mo.disconnect();
      }
    });
    mo.observe(body, { attributes: true, attributeFilter: ['class'] });

    /* ---------- hero video crossfade loop ---------- */
    var video = root.querySelector('.w-hero-video');
    if (video) {
      var raf = null, fadingOut = false;
      var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      var cancelFade = function () { if (raf !== null) { cancelAnimationFrame(raf); raf = null; } };
      var fadeTo = function (target, done) {
        cancelFade();
        if (reduced) { video.style.opacity = String(target); if (done) done(); return; }
        var from = parseFloat(video.style.opacity || '0');
        var start = performance.now();
        var step = function (now) {
          var t = Math.min((now - start) / FADE_MS, 1);
          video.style.opacity = String(from + (target - from) * t);
          if (t < 1) { raf = requestAnimationFrame(step); }
          else { raf = null; if (done) done(); }
        };
        raf = requestAnimationFrame(step);
      };

      video.addEventListener('canplay', function () {
        if (!video.paused) return;
        var p = video.play(); if (p && p.catch) p.catch(function () {});
        fadeTo(1);
      });
      video.addEventListener('timeupdate', function () {
        if (!video.duration || fadingOut) return;
        if (video.duration - video.currentTime <= FADE_OUT_BEFORE_END_S) { fadingOut = true; fadeTo(0); }
      });
      video.addEventListener('ended', function () {
        cancelFade();
        video.style.opacity = '0';
        setTimeout(function () {
          video.currentTime = 0;
          fadingOut = false;
          var p = video.play(); if (p && p.catch) p.catch(function () {});
          fadeTo(1);
        }, 100);
      });
    }

    /* ---------- scroll reveals (IntersectionObserver, once) ---------- */
    var reveals = root.querySelectorAll('.w-reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { root: root, rootMargin: '0px 0px -100px 0px', threshold: 0.05 });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add('in'); });
    }

    /* ---------- hand-off to Firebase login ---------- */
    var emailInput = root.querySelector('#sscWelcomeEmail');

    function leave(prefillEmail) {
      markSeen();
      root.classList.add('is-leaving');
      var fbEmail = document.getElementById('fbLoginEmail');
      var fbPass = document.getElementById('fbLoginPassword');
      if (prefillEmail && fbEmail && !fbEmail.value) {
        fbEmail.value = prefillEmail;
        fbEmail.dispatchEvent(new Event('input', { bubbles: true }));
      }
      setTimeout(function () {
        body.classList.remove('ssc-welcome-active');
        root.classList.remove('is-leaving');
        var target = (prefillEmail && fbPass) ? fbPass : (fbEmail || null);
        if (target) { try { target.focus({ preventScroll: true }); } catch (e) { target.focus(); } }
      }, 450);
    }

    root.querySelectorAll('[data-welcome-login]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        leave(emailInput ? emailInput.value.trim() : '');
      });
    });

    var form = root.querySelector('#sscWelcomeForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        leave(emailInput ? emailInput.value.trim() : '');
      });
    }

    /* in-page anchors scroll inside the fixed layer */
    root.querySelectorAll('[data-welcome-scroll]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var sel = a.getAttribute('data-welcome-scroll');
        var el = sel && root.querySelector(sel);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

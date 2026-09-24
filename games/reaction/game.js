(function () {
  'use strict';
  var box = document.getElementById('box');
  var msg = document.getElementById('msg');
  var bestEl = document.getElementById('best');
  var lastEl = document.getElementById('last');

  var state = 'idle';
  var t0 = 0;
  var timer = null;
  var best = parseInt(localStorage.getItem('funhouse.reaction.best') || '0', 10) || 0;
  if (best) bestEl.textContent = best + ' ms';

  function paint(bg, text) {
    box.style.background = bg;
    msg.textContent = text;
  }

  function arm() {
    state = 'wait';
    paint('#8b8fa3', 'Wait for green...');
    timer = setTimeout(function () {
      state = 'go';
      t0 = performance.now();
      paint('#22c55e', 'CLICK!');
    }, 1200 + Math.random() * 2500);
  }

  function hit() {
    if (state === 'wait') {
      clearTimeout(timer);
      state = 'idle';
      paint('#ef4444', 'Too soon! Click to try again.');
      return;
    }
    if (state === 'go') {
      var ms = Math.round(performance.now() - t0);
      state = 'idle';
      lastEl.textContent = ms + ' ms';
      var isBest = !best || ms < best;
      if (isBest) {
        best = ms;
        bestEl.textContent = ms + ' ms';
        try { localStorage.setItem('funhouse.reaction.best', String(ms)); } catch (e) {}
      }
      paint('#111318', ms + ' ms' + (isBest ? ' — new best!' : '') + ' Click to go again.');
      return;
    }
    arm();
  }

  box.addEventListener('pointerdown', function (e) { e.preventDefault(); hit(); });
  window.addEventListener('keydown', function (e) {
    if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); hit(); }
  });
})();

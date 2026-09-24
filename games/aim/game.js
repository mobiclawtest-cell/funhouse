(function () {
  'use strict';
  var field = document.getElementById('field');
  var hitsEl = document.getElementById('hits');
  var missEl = document.getElementById('miss');
  var accEl = document.getElementById('acc');
  var timeEl = document.getElementById('time');
  var bestEl = document.getElementById('best');
  var msg = document.getElementById('msg');

  var target = null;
  var hideTimer = null;
  var clockTimer = null;
  var hits = 0;
  var missed = 0;
  var timeLeft = 30;
  var running = false;
  var best = parseInt(localStorage.getItem('funhouse.aim.best') || '0', 10) || 0;
  if (best) bestEl.textContent = String(best);

  function refresh() {
    hitsEl.textContent = String(hits);
    missEl.textContent = String(missed);
    var total = hits + missed;
    accEl.textContent = total ? Math.round(hits / total * 100) + '%' : '—';
  }

  function clearTarget() {
    clearTimeout(hideTimer);
    if (target) { field.removeChild(target); target = null; }
  }

  function spawn() {
    if (!running) return;
    var r = field.getBoundingClientRect();
    var size = 56;
    var x = Math.random() * Math.max(1, r.width - size);
    var y = Math.random() * Math.max(1, r.height - size);
    var d = document.createElement('div');
    d.className = 'target';
    d.style.left = x + 'px';
    d.style.top = y + 'px';
    d.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (!running) return;
      hits++;
      refresh();
      clearTarget();
      spawn();
    });
    field.appendChild(d);
    target = d;
    hideTimer = setTimeout(function () {
      if (!running) return;
      missed++;
      refresh();
      clearTarget();
      spawn();
    }, Math.max(540, 1150 - hits * 28));
  }

  function start() {
    hits = 0;
    missed = 0;
    timeLeft = 30;
    running = true;
    refresh();
    timeEl.textContent = '30.0';
    msg.textContent = 'Go!';
    clearTarget();
    spawn();
    clearInterval(clockTimer);
    clockTimer = setInterval(function () {
      timeLeft = Math.max(0, timeLeft - 0.1);
      timeEl.textContent = timeLeft.toFixed(1);
      if (timeLeft <= 0) stop();
    }, 100);
  }

  function stop() {
    running = false;
    clearInterval(clockTimer);
    clearTarget();
    if (hits > best) {
      best = hits;
      bestEl.textContent = String(best);
      try { localStorage.setItem('funhouse.aim.best', String(best)); } catch (e) {}
    }
    msg.textContent = 'Time! ' + hits + ' hits. Tap inside the box to play again.';
  }

  field.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    if (!running) start();
  });

  timeEl.textContent = '30.0';
  refresh();
})();

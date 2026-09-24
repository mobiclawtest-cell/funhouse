(function () {
  'use strict';
  var grid = document.getElementById('grid');
  var scoreEl = document.getElementById('score');
  var timeEl = document.getElementById('time');
  var bestEl = document.getElementById('best');
  var msg = document.getElementById('msg');

  var holes = [];
  var score = 0;
  var timeLeft = 30;
  var running = false;
  var current = -1;
  var spawnTimer = null;
  var clockTimer = null;
  var best = parseInt(localStorage.getItem('funhouse.whack.best') || '0', 10) || 0;
  if (best) bestEl.textContent = String(best);

  function hideCurrent() {
    if (current > -1) holes[current].classList.remove('up');
    current = -1;
  }

  function spawn() {
    if (!running) return;
    hideCurrent();
    current = (Math.random() * 9) | 0;
    holes[current].classList.add('up');
    var life = Math.max(430, 900 - score * 14);
    spawnTimer = setTimeout(spawn, life);
  }

  function start() {
    score = 0;
    timeLeft = 30;
    running = true;
    scoreEl.textContent = '0';
    timeEl.textContent = '30.0';
    msg.textContent = 'Go!';
    hideCurrent();
    spawn();
    clockTimer = setInterval(function () {
      timeLeft = Math.max(0, timeLeft - 0.1);
      timeEl.textContent = timeLeft.toFixed(1);
      if (timeLeft <= 0) stop();
    }, 100);
  }

  function stop() {
    running = false;
    clearTimeout(spawnTimer);
    clearInterval(clockTimer);
    hideCurrent();
    if (score > best) {
      best = score;
      bestEl.textContent = String(best);
      try { localStorage.setItem('funhouse.whack.best', String(best)); } catch (e) {}
    }
    msg.textContent = 'Time! You got ' + score + '. Tap a hole to play again.';
  }

  function onHole(e) {
    e.preventDefault();
    if (!running) { start(); return; }
    if (holes.indexOf(this) === current) {
      score++;
      scoreEl.textContent = String(score);
      hideCurrent();
    }
  }

  for (var i = 0; i < 9; i++) {
    var h = document.createElement('div');
    h.className = 'hole';
    h.addEventListener('pointerdown', onHole);
    grid.appendChild(h);
    holes.push(h);
  }
})();

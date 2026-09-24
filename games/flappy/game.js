(function () {
  'use strict';
  var cv = document.getElementById('cv');
  var ctx = cv.getContext('2d');
  var scoreEl = document.getElementById('score');
  var bestEl = document.getElementById('best');

  var W = cv.width;
  var H = cv.height;
  var GRAV = 1500;
  var FLAP = -430;
  var PW = 62;
  var GAP = 152;
  var SPEED = 148;
  var BX = 110;
  var BR = 13;

  var bird, pipes, score, dead, spawnT, lastTs;
  var best = parseInt(localStorage.getItem('funhouse.flappy.best') || '0', 10) || 0;
  if (best) bestEl.textContent = String(best);

  function reset() {
    bird = { y: H * 0.42, vy: 0 };
    pipes = [];
    score = 0;
    dead = false;
    spawnT = 0;
    lastTs = 0;
    scoreEl.textContent = '0';
  }

  function die() {
    dead = true;
    if (score > best) {
      best = score;
      bestEl.textContent = String(best);
      try { localStorage.setItem('funhouse.flappy.best', String(best)); } catch (e) {}
    }
  }

  function flap() {
    if (dead) { reset(); return; }
    bird.vy = FLAP;
  }

  function spawnPipe() {
    var top = 70 + Math.random() * (H - GAP - 150);
    pipes.push({ x: W + 10, top: top, passed: false });
  }

  function update(dt) {
    if (dead) return;
    bird.vy += GRAV * dt;
    bird.y += bird.vy * dt;
    if (bird.y - BR < 0 || bird.y + BR > H) { die(); return; }

    spawnT += dt;
    if (spawnT >= 1.35) { spawnT = 0; spawnPipe(); }

    for (var i = pipes.length - 1; i >= 0; i--) {
      var p = pipes[i];
      p.x -= SPEED * dt;
      if (!p.passed && p.x + PW < BX - BR) {
        p.passed = true;
        score++;
        scoreEl.textContent = String(score);
      }
      if (p.x + PW < -12) { pipes.splice(i, 1); continue; }
      if (BX + BR > p.x && BX - BR < p.x + PW) {
        if (bird.y - BR < p.top || bird.y + BR > p.top + GAP) { die(); return; }
      }
    }
  }

  function draw() {
    ctx.fillStyle = '#0e1116';
    ctx.fillRect(0, 0, W, H);

    for (var i = 0; i < pipes.length; i++) {
      var p = pipes[i];
      ctx.fillStyle = '#2f9fd6';
      ctx.fillRect(p.x, 0, PW, p.top);
      ctx.fillRect(p.x, p.top + GAP, PW, H - p.top - GAP);
      ctx.fillStyle = '#8ff3f5';
      ctx.fillRect(p.x, p.top - 8, PW, 8);
      ctx.fillRect(p.x, p.top + GAP, PW, 8);
    }

    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(BX, bird.y, BR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111318';
    ctx.beginPath();
    ctx.arc(BX + 4, bird.y - 4, 2.4, 0, Math.PI * 2);
    ctx.fill();

    if (dead) {
      ctx.fillStyle = 'rgba(6,8,12,.76)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.font = 'bold 26px system-ui, sans-serif';
      ctx.fillText('Splat', W / 2, H / 2 - 6);
      ctx.font = '15px system-ui, sans-serif';
      ctx.fillText('Pipes ' + score + ' — tap to retry', W / 2, H / 2 + 24);
    }
  }

  cv.addEventListener('pointerdown', function (e) { e.preventDefault(); flap(); });
  window.addEventListener('keydown', function (e) {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'Enter') { e.preventDefault(); flap(); }
  });

  function loop(ts) {
    if (!lastTs) lastTs = ts;
    var dt = Math.min((ts - lastTs) / 1000, 0.033);
    lastTs = ts;
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  reset();
  requestAnimationFrame(loop);
})();

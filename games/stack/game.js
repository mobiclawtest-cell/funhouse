(function () {
  'use strict';
  var cv = document.getElementById('cv');
  var ctx = cv.getContext('2d');
  var scoreEl = document.getElementById('score');
  var bestEl = document.getElementById('best');

  var W = cv.width;
  var H = cv.height;
  var BH = 26;
  var BASE_W = 210;

  var blocks, moving, camY, camTarget, score, dead, lastTs;
  var best = parseInt(localStorage.getItem('funhouse.stack.best') || '0', 10) || 0;
  if (best) bestEl.textContent = String(best);

  function camFor(n) {
    return 0.56 * H - (H - 60 - (n - 1) * BH);
  }

  function startMoving() {
    var last = blocks[blocks.length - 1];
    var fromLeft = Math.random() < 0.5;
    moving = {
      x: fromLeft ? 0 : W - last.w,
      w: last.w,
      dir: fromLeft ? 1 : -1,
      speed: 90 + Math.min(150, blocks.length * 7)
    };
  }

  function reset() {
    blocks = [{ x: (W - BASE_W) / 2, w: BASE_W }];
    score = 0;
    dead = false;
    lastTs = 0;
    scoreEl.textContent = '0';
    camY = camFor(1);
    camTarget = camFor(1);
    startMoving();
  }

  function die() {
    dead = true;
    moving = null;
    if (score > best) {
      best = score;
      bestEl.textContent = String(best);
      try { localStorage.setItem('funhouse.stack.best', String(best)); } catch (e) {}
    }
  }

  function drop() {
    if (dead) { reset(); return; }
    if (!moving) return;
    var last = blocks[blocks.length - 1];
    var x1 = Math.max(moving.x, last.x);
    var x2 = Math.min(moving.x + moving.w, last.x + last.w);
    var overlap = x2 - x1;
    if (overlap <= 0) { die(); return; }
    blocks.push({ x: x1, w: overlap });
    score++;
    scoreEl.textContent = String(score);
    camTarget = camFor(blocks.length);
    startMoving();
  }

  function update(dt) {
    if (moving && !dead) {
      moving.x += moving.dir * moving.speed * dt;
      if (moving.x < 0) { moving.x = 0; moving.dir = 1; }
      if (moving.x + moving.w > W) { moving.x = W - moving.w; moving.dir = -1; }
    }
    camY += (camTarget - camY) * Math.min(1, dt * 7);
  }

  function draw() {
    ctx.fillStyle = '#0e1116';
    ctx.fillRect(0, 0, W, H);

    for (var i = 0; i < blocks.length; i++) {
      var b = blocks[i];
      ctx.fillStyle = i === 0 ? '#39465a' : (i % 2 ? '#2f9fd6' : '#8ff3f5');
      ctx.fillRect(b.x, H - 60 - i * BH + camY, b.w, BH - 2);
    }

    if (moving && !dead) {
      ctx.fillStyle = '#ffd166';
      ctx.fillRect(moving.x, H - 60 - blocks.length * BH + camY, moving.w, BH - 2);
    }

    if (dead) {
      ctx.fillStyle = 'rgba(6,8,12,.76)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.font = 'bold 26px system-ui, sans-serif';
      ctx.fillText('Tower fell', W / 2, H / 2 - 6);
      ctx.font = '15px system-ui, sans-serif';
      ctx.fillText('Height ' + score + ' — tap to retry', W / 2, H / 2 + 24);
    }
  }

  cv.addEventListener('pointerdown', function (e) { e.preventDefault(); drop(); });
  window.addEventListener('keydown', function (e) {
    if (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowDown') { e.preventDefault(); drop(); }
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

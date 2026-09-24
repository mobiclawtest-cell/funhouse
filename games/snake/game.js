(function () {
  'use strict';
  var cv = document.getElementById('cv');
  var ctx = cv.getContext('2d');
  var scoreEl = document.getElementById('score');
  var bestEl = document.getElementById('best');

  var N = 20;
  var CELL = cv.width / N;
  var snake, dir, nextDir, food, dead, acc, tick, score;
  var lastTs = 0;
  var best = parseInt(localStorage.getItem('funhouse.snake.best') || '0', 10) || 0;
  if (best) bestEl.textContent = String(best);

  function reset() {
    snake = [{ x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    dead = false;
    acc = 0;
    tick = 0.13;
    score = 0;
    scoreEl.textContent = '0';
    lastTs = 0;
    placeFood();
  }

  function placeFood() {
    var tries = 0;
    while (tries++ < 600) {
      var f = { x: (Math.random() * N) | 0, y: (Math.random() * N) | 0 };
      var clash = false;
      for (var i = 0; i < snake.length; i++) {
        if (snake[i].x === f.x && snake[i].y === f.y) { clash = true; break; }
      }
      if (!clash) { food = f; return; }
    }
    food = { x: 0, y: 0 };
  }

  function die() {
    dead = true;
    if (score > best) {
      best = score;
      bestEl.textContent = String(best);
      try { localStorage.setItem('funhouse.snake.best', String(best)); } catch (e) {}
    }
  }

  function step() {
    dir = nextDir;
    var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    if (head.x < 0 || head.y < 0 || head.x >= N || head.y >= N) { die(); return; }
    for (var i = 0; i < snake.length - 1; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) { die(); return; }
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score++;
      scoreEl.textContent = String(score);
      tick = Math.max(0.055, 0.13 - score * 0.003);
      placeFood();
    } else {
      snake.pop();
    }
  }

  function draw() {
    ctx.fillStyle = '#0e1116';
    ctx.fillRect(0, 0, cv.width, cv.height);

    ctx.fillStyle = '#ff6b8a';
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL * 0.32, 0, Math.PI * 2);
    ctx.fill();

    for (var i = 0; i < snake.length; i++) {
      ctx.fillStyle = i === 0 ? '#8ff3f5' : '#2f9fd6';
      var pad = i === 0 ? 1 : 2;
      ctx.fillRect(snake[i].x * CELL + pad, snake[i].y * CELL + pad, CELL - pad * 2, CELL - pad * 2);
    }

    if (dead) {
      ctx.fillStyle = 'rgba(6,8,12,.74)';
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.font = 'bold 26px system-ui, sans-serif';
      ctx.fillText('Game over', cv.width / 2, cv.height / 2 - 6);
      ctx.font = '15px system-ui, sans-serif';
      ctx.fillText('Score ' + score + ' — tap or press a key to retry', cv.width / 2, cv.height / 2 + 24);
    }
  }

  function turn(x, y) {
    if (x === -dir.x && y === -dir.y) return;
    nextDir = { x: x, y: y };
  }

  var KEYS = {
    ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
    KeyW: [0, -1], KeyS: [0, 1], KeyA: [-1, 0], KeyD: [1, 0]
  };

  window.addEventListener('keydown', function (e) {
    if (dead) { reset(); return; }
    var m = KEYS[e.code];
    if (!m) return;
    e.preventDefault();
    turn(m[0], m[1]);
  });

  var sx = 0, sy = 0;
  cv.addEventListener('pointerdown', function (e) {
    if (dead) { reset(); return; }
    sx = e.clientX;
    sy = e.clientY;
  });
  cv.addEventListener('pointerup', function (e) {
    if (dead) return;
    var dx = e.clientX - sx;
    var dy = e.clientY - sy;
    if (Math.abs(dx) < 18 && Math.abs(dy) < 18) return;
    if (Math.abs(dx) > Math.abs(dy)) turn(dx > 0 ? 1 : -1, 0);
    else turn(0, dy > 0 ? 1 : -1);
  });

  function loop(ts) {
    if (!lastTs) lastTs = ts;
    var dt = Math.min((ts - lastTs) / 1000, 0.05);
    lastTs = ts;
    if (!dead) {
      acc += dt;
      var guard = 0;
      while (acc >= tick && !dead && guard++ < 5) { acc -= tick; step(); }
    }
    draw();
    requestAnimationFrame(loop);
  }

  reset();
  requestAnimationFrame(loop);
})();

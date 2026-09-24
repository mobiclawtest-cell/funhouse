(function () {
  'use strict';
  var grid = document.getElementById('grid');
  var msg = document.getElementById('msg');
  var levelEl = document.getElementById('level');
  var bestEl = document.getElementById('best');

  var tiles = [];
  var seq = [];
  var input = [];
  var locked = true;
  var over = false;
  var best = parseInt(localStorage.getItem('funhouse.memory.best') || '0', 10) || 0;
  if (best) bestEl.textContent = String(best);

  function flash(i, on) {
    tiles[i].classList.toggle('on', !!on);
  }

  function reset() {
    seq = [];
    input = [];
    over = false;
    locked = true;
    levelEl.textContent = '0';
    tiles.forEach(function (t) { t.classList.remove('on'); });
    next();
  }

  function next() {
    seq.push((Math.random() * 9) | 0);
    levelEl.textContent = String(seq.length);
    input = [];
    locked = true;
    msg.textContent = 'Watch...';
    var step = 430;
    for (var k = 0; k < seq.length; k++) {
      (function (k) {
        setTimeout(function () { flash(seq[k], true); }, 320 + step * k);
        setTimeout(function () { flash(seq[k], false); }, 320 + step * k + 250);
      })(k);
    }
    setTimeout(function () {
      locked = false;
      msg.textContent = 'Your turn (' + seq.length + ' tiles)';
    }, 340 + step * seq.length);
  }

  function onTile(e) {
    e.preventDefault();
    var i = parseInt(this.dataset.i, 10);
    if (locked || over) return;
    flash(i, true);
    setTimeout(function () { flash(i, false); }, 150);
    input.push(i);
    var k = input.length - 1;

    if (input[k] !== seq[k]) {
      locked = true;
      over = true;
      var reached = seq.length - 1;
      if (reached > best) {
        best = reached;
        bestEl.textContent = String(best);
        try { localStorage.setItem('funhouse.memory.best', String(best)); } catch (err) {}
      }
      msg.textContent = 'Wrong! You reached level ' + reached + '. Tap to play again.';
      return;
    }

    if (input.length === seq.length) {
      locked = true;
      msg.textContent = 'Nice. Next one...';
      setTimeout(next, 700);
    }
  }

  for (var i = 0; i < 9; i++) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'tile';
    b.dataset.i = String(i);
    b.addEventListener('pointerdown', onTile);
    grid.appendChild(b);
    tiles.push(b);
  }

  grid.addEventListener('pointerdown', function () {
    if (over) reset();
  });

  reset();
})();

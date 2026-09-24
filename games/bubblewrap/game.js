(function () {
  'use strict';
  var sheet = document.getElementById('sheet');
  var countEl = document.getElementById('count');
  var totalEl = document.getElementById('total');
  var msg = document.getElementById('msg');
  var fresh = document.getElementById('fresh');

  var COLS = 10;
  var ROWS = 8;
  var popped = 0;
  var total = COLS * ROWS;

  function build() {
    sheet.innerHTML = '';
    popped = 0;
    countEl.textContent = '0';
    totalEl.textContent = String(total);
    msg.textContent = '';
    for (var i = 0; i < total; i++) {
      var b = document.createElement('div');
      b.className = 'bubble';
      b.addEventListener('pointerdown', pop);
      sheet.appendChild(b);
    }
  }

  function pop(e) {
    e.preventDefault();
    if (this.classList.contains('popped')) return;
    this.classList.add('popped');
    popped++;
    countEl.textContent = String(popped);
    if (popped === total) {
      msg.textContent = 'All ' + total + ' popped. Deeply satisfying. Want another sheet?';
    }
  }

  fresh.addEventListener('click', build);
  build();
})();

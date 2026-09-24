(function () {
  'use strict';
  var textEl = document.getElementById('text');
  var input = document.getElementById('input');
  var wpmEl = document.getElementById('wpm');
  var accEl = document.getElementById('acc');
  var timeEl = document.getElementById('time');
  var bestEl = document.getElementById('best');
  var again = document.getElementById('again');

  var SENTENCES = [
    'The quick brown fox jumps over the lazy dog while the sun sets behind the hills.',
    'Practice does not make perfect, but it does make the thing you practice easier.',
    'A steady rhythm and a light touch will beat a fast typist who keeps making mistakes.',
    'Every long journey begins with a single step and a willingness to keep going anyway.'
  ];

  var target = '';
  var started = 0;
  var done = false;
  var best = parseInt(localStorage.getItem('funhouse.typing.best') || '0', 10) || 0;
  if (best) bestEl.textContent = best + ' wpm';

  function esc(c) {
    if (c === ' ') return '&nbsp;';
    if (c === '&') return '&amp;';
    if (c === '<') return '&lt;';
    if (c === '>') return '&gt;';
    return c;
  }

  function render() {
    var typed = input.value;
    var html = '';
    for (var i = 0; i < target.length; i++) {
      var cls = i < typed.length ? (typed.charAt(i) === target.charAt(i) ? 'ok' : 'bad') : '';
      html += '<span class="' + cls + '">' + esc(target.charAt(i)) + '</span>';
    }
    textEl.innerHTML = html;

    var correct = 0;
    var wrong = 0;
    for (var j = 0; j < typed.length; j++) {
      if (typed.charAt(j) === target.charAt(j)) correct++; else wrong++;
    }

    var mins = started ? (performance.now() - started) / 60000 : 0;
    var wpm = mins > 0.02 ? Math.round((correct / 5) / mins) : 0;
    var totalTyped = correct + wrong;

    wpmEl.textContent = String(wpm);
    accEl.textContent = totalTyped ? Math.round(correct / totalTyped * 100) + '%' : '—';
    timeEl.textContent = (mins * 60).toFixed(1) + 's';

    if (!done && typed.length > 0 && typed === target) {
      done = true;
      if (wpm > best) {
        best = wpm;
        bestEl.textContent = wpm + ' wpm';
        try { localStorage.setItem('funhouse.typing.best', String(wpm)); } catch (e) {}
      }
      accEl.textContent = '100%';
      input.blur();
    }
  }

  function newText() {
    target = SENTENCES[(Math.random() * SENTENCES.length) | 0];
    input.value = '';
    started = 0;
    done = false;
    render();
    try { input.focus(); } catch (e) {}
  }

  input.addEventListener('input', function () {
    if (!started) started = performance.now();
    render();
  });

  again.addEventListener('click', newText);

  newText();
})();

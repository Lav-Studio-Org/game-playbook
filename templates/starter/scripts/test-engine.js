// Pure-logic tests for js/engine.js. Runs in CI (test.yml). Exit code 1 on any failure.
// Pattern to keep: invariants over many seeded random runs, plus a few exact cases.
const E = require('../js/engine.js');
let bad = 0;
const check = (ok, msg) => { if (!ok) { bad++; console.log('FAIL', msg); } };

// exact cases
{
  const w = E.createWorld(E.LEVELS[0], 1);
  E.step(w, 0.3);
  check(w.bubbles.length === 1, 'one bubble after the first spawn');
  const b = w.bubbles[0];
  check(E.tap(w, b.x, b.y) === b && w.score === 10 && w.combo === 1, 'hit scores 10');
  check(E.tap(w, -50, -50) === null && w.combo === 0 && w.misses === 1, 'miss breaks combo');
}

// invariants over many seeded rounds played by a random bot
for (const L of E.LEVELS) {
  for (let seed = 1; seed <= 300; seed++) {
    const w = E.createWorld(L, seed), rng = E.mulberry32(seed * 31);
    let guard = 0;
    while (!w.over && guard++ < 10000) {
      if (w.bubbles.length && rng() < 0.05) { const b = w.bubbles[0]; E.tap(w, b.x, b.y); }
      E.step(w, 1 / 60);
      for (const b of w.bubbles) check(b.x >= E.R && b.x <= E.W - E.R && b.y >= 0 && b.y <= E.H, `bubble inside world ${L.id}/${seed}`);
      w.events.length = 0;
    }
    check(w.over, `round ends ${L.id}/${seed}`);
    check(w.score >= 0 && w.score % 10 === 0, 'score is a non-negative multiple of 10');
    check(E.stars(w) >= 0 && E.stars(w) <= 3, 'stars in 0..3');
  }
}
// star thresholds must be increasing
for (const L of E.LEVELS) check(L.stars[0] < L.stars[1] && L.stars[1] < L.stars[2], `stars increasing ${L.id}`);

console.log(bad ? `${bad} failures` : 'engine OK');
process.exit(bad ? 1 : 0);

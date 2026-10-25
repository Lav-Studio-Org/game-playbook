// Balancing by simulation (docs/06-level-balancing.md): simulated players of three skill
// levels play every mode many times; star thresholds are picked from the score
// distribution so each star has a planned chance. Prints a table; with --write it
// updates the `stars:` arrays in js/engine.js.
// Usage: node scripts/balance.js [rounds=400] [--write]
const fs = require('fs');
const path = require('path');
const E = require('../js/engine.js');
const N = +process.argv[2] || 400;

// A player sees a bubble after `react` seconds and hits it with probability `acc`.
const SKILL = { react: 0.45, acc: 0.9 };
// Planned chance that one round of an average player earns 1 / 2 / 3 stars.
const PLAN = [0.85, 0.45, 0.12];

function play(L, seed) {
  const w = E.createWorld(L, seed), rng = E.mulberry32(seed ^ 0x9e3779b9);
  let busyUntil = 0;
  const react = SKILL.react * (0.7 + rng() * 0.6);
  while (!w.over) {
    if (w.t >= busyUntil) {
      const b = w.bubbles.find((x) => x.age >= react);
      if (b) {
        if (rng() < SKILL.acc) E.tap(w, b.x, b.y); else E.tap(w, b.x + E.R * 2, b.y);
        busyUntil = w.t + 0.18 + rng() * 0.25;
      }
    }
    E.step(w, 1 / 60);
    w.events.length = 0;
  }
  return w.score;
}

const q = (sorted, p) => sorted[Math.min(sorted.length - 1, Math.max(0, Math.ceil(p * sorted.length) - 1))];
const round10 = (n) => Math.max(10, Math.round(n / 10) * 10);
let src = fs.readFileSync(path.join(__dirname, '../js/engine.js'), 'utf8');
for (const L of E.LEVELS) {
  const scores = Array.from({ length: N }, (_, i) => play(L, 1000 + i)).sort((a, b) => b - a);
  const stars = PLAN.map((p) => round10(q(scores, p)));
  for (let k = 1; k < 3; k++) stars[k] = Math.max(stars[k], stars[k - 1] + 10);
  const now = scores.map((s) => L.stars.filter((t) => s >= t).length);
  const pct = (k) => Math.round((100 * now.filter((n) => n >= k).length) / N);
  console.log(`${L.name.padEnd(8)} median ${scores[N >> 1]}  current [${L.stars}] -> 1*${pct(1)}% 2*${pct(2)}% 3*${pct(3)}%  suggested [${stars}]`);
  src = src.replace(new RegExp(`(id: '${L.id}'[^\\n]*stars: )\\[[^\\]]*\\]`), `$1[${stars.join(', ')}]`);
}
if (process.argv.includes('--write')) {
  fs.writeFileSync(path.join(__dirname, '../js/engine.js'), src);
  console.log('js/engine.js updated');
}

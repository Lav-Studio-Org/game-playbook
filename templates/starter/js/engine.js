// Core simulation. Pure logic, no DOM, so it runs in the browser and in Node
// (scripts/test-engine.js and scripts/balance.js use it headlessly).
//
// Starter game "Tangkap": bubbles appear in a fixed 360x640 world and fade away.
// Tap one before it fades to score; quick taps in a row build a combo.
// Replace this file with your own game's rules, keeping the same shape:
// createWorld(cfg) -> world, input functions, step(world, dt), won(world), stars(world).
(function (root) {
  'use strict';

  const W = 360, H = 640;
  const R = 34;                 // bubble radius
  const COMBO_WINDOW = 1.2;     // seconds between hits that keep the combo

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hashStr(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  // Difficulty table shared by the game and the scripts. Star thresholds come from
  // scripts/balance.js (simulated players), never from guessing.
  const LEVELS = [
    { id: 'santai', name: 'Santai', time: 30, life: 1.9, every: 0.75, stars: [1740, 2170, 2500] },
    { id: 'cepat', name: 'Cepat', time: 30, life: 1.3, every: 0.55, stars: [2530, 3000, 3410] },
  ];

  function createWorld(cfg, seed) {
    return {
      cfg, rng: mulberry32(seed >>> 0), t: 0, timeLeft: cfg.time,
      bubbles: [], nextId: 1, spawnIn: 0.2,
      score: 0, hits: 0, misses: 0, combo: 0, bestCombo: 0, lastHitAt: -9,
      over: false, events: [],
    };
  }

  function spawn(w) {
    const x = R + w.rng() * (W - 2 * R), y = 90 + R + w.rng() * (H - 180 - 2 * R);
    w.bubbles.push({ id: w.nextId++, x, y, age: 0, life: w.cfg.life });
  }

  // Returns the popped bubble or null. Misses break the combo.
  function tap(w, x, y) {
    if (w.over) return null;
    let hit = null;
    for (const b of w.bubbles) if ((b.x - x) ** 2 + (b.y - y) ** 2 <= R * R) { hit = b; break; }
    if (!hit) { w.combo = 0; w.misses++; w.events.push({ type: 'miss', x, y }); return null; }
    w.bubbles = w.bubbles.filter((b) => b !== hit);
    w.combo = w.t - w.lastHitAt <= COMBO_WINDOW ? w.combo + 1 : 1;
    w.lastHitAt = w.t;
    w.bestCombo = Math.max(w.bestCombo, w.combo);
    const gain = 10 * Math.min(w.combo, 8);
    w.score += gain;
    w.hits++;
    w.events.push({ type: 'pop', x: hit.x, y: hit.y, combo: w.combo, gain });
    return hit;
  }

  function step(w, dt) {
    if (w.over) return;
    w.t += dt;
    w.timeLeft = Math.max(0, w.timeLeft - dt);
    for (const b of w.bubbles) b.age += dt;
    const faded = w.bubbles.filter((b) => b.age >= b.life);
    if (faded.length) { w.combo = 0; faded.forEach((b) => w.events.push({ type: 'fade', x: b.x, y: b.y })); }
    w.bubbles = w.bubbles.filter((b) => b.age < b.life);
    w.spawnIn -= dt;
    while (w.spawnIn <= 0) { spawn(w); w.spawnIn += w.cfg.every; }
    if (w.timeLeft <= 0) { w.over = true; w.events.push({ type: 'end' }); }
  }

  const stars = (w) => w.cfg.stars.filter((s) => w.score >= s).length;
  const won = (w) => stars(w) > 0;

  const Engine = { W, H, R, LEVELS, mulberry32, hashStr, createWorld, tap, step, stars, won };
  if (typeof module !== 'undefined' && module.exports) module.exports = Engine;
  else (root.GG = root.GG || {}).Engine = Engine;
})(typeof window !== 'undefined' ? window : globalThis);

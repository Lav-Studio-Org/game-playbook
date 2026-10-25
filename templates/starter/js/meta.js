// Player profile, coins, daily reward, event bus and analytics stub.
(() => {
  'use strict';
  const GG = (window.GG = window.GG || {});
  const KEY = 'tangkap.profile.v1'; // rename per game; bump only with a migration

  // ---------- tiny event bus + analytics stub ----------
  const listeners = {};
  GG.on = (ev, fn) => (listeners[ev] = listeners[ev] || []).push(fn);
  GG.emit = (ev, data) => (listeners[ev] || []).forEach((fn) => fn(data));
  // Replace with Firebase/GameAnalytics later; every interesting moment already calls this.
  GG.track = (name, data) => { if (GG.debug) console.log('[track]', name, data || ''); };

  // ---------- dates (local day, YYYY-MM-DD) ----------
  const pad = (n) => String(n).padStart(2, '0');
  GG.today = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  GG.dayDiff = (a, b) => Math.round((new Date(b + 'T00:00') - new Date(a + 'T00:00')) / 864e5);

  // ---------- profile ----------
  const DEFAULT = {
    v: 1, coins: 0, games: 0, bests: {}, stars: {}, noAds: false, tutorialDone: false,
    settings: { sound: true, music: true, vibe: true },
    daily: { last: '', streak: 0 },
  };
  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (raw && raw.v === 1) {
        const p = Object.assign(structuredClone(DEFAULT), raw);
        p.settings = Object.assign(structuredClone(DEFAULT.settings), raw.settings);
        return p;
      }
    } catch (e) { /* storage blocked or corrupt */ }
    return structuredClone(DEFAULT);
  }
  GG.profile = load();
  GG.save = () => { try { localStorage.setItem(KEY, JSON.stringify(GG.profile)); } catch (e) { /* ignore */ } };

  GG.addCoins = (n, why) => {
    GG.profile.coins = Math.max(0, GG.profile.coins + n);
    GG.save();
    GG.track('coins', { n, why });
    GG.emit('coins', GG.profile.coins);
  };

  // ---------- daily reward with streak ----------
  GG.DAILY_REWARDS = [20, 30, 40, 50, 60, 80, 150];
  GG.dailyState = () => {
    const d = GG.profile.daily, t = GG.today();
    if (d.last === t) return { canClaim: false, day: (d.streak - 1) % 7 };
    const keep = d.last && GG.dayDiff(d.last, t) === 1;
    return { canClaim: true, day: keep ? d.streak % 7 : 0 };
  };
  GG.claimDaily = (mult) => {
    const st = GG.dailyState();
    if (!st.canClaim) return 0;
    const d = GG.profile.daily;
    d.streak = st.day + 1;
    d.last = GG.today();
    const n = GG.DAILY_REWARDS[st.day] * (mult || 1);
    GG.addCoins(n, 'daily');
    return n;
  };
})();

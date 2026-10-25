// Game flow and UI: screens, canvas rendering, modals, pause/back handling, test hook.
(() => {
  'use strict';
  const GG = window.GG;
  const E = GG.Engine;
  const P = GG.profile;
  const $ = (id) => document.getElementById(id);
  const ic = (id) => `<svg class="ic" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const fmt = (n) => n.toLocaleString('id-ID');
  const mmss = (s) => { const t = Math.ceil(s); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; };

  // ---------- State ----------
  // state: home | intro | playing | paused | timeup | result
  let state = 'home', levelIdx = 0, world = null, revived = false, doubled = false;
  const fx = [];      // particles and floating texts
  let shake = 0;

  function vibrate(ms) {
    if (!P.settings.vibe) return;
    try { navigator.vibrate && navigator.vibrate(ms); } catch (e) { /* ignore */ }
  }

  let toastT = 0;
  function toast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.add('hidden'), 2200);
  }
  GG.on('ad-unavailable', () => toast('Iklan belum tersedia, coba lagi sebentar lagi.'));
  GG.on('coins', (n) => ($('hud-coins').textContent = fmt(n)));

  // ---------- Modal ----------
  let modalName = null;
  function showModal(name, html) {
    modalName = name;
    $('card').innerHTML = html;
    $('modal').classList.remove('hidden');
  }
  function hideModal() { modalName = null; $('modal').classList.add('hidden'); }
  const closeBtn = '<button class="close-btn" data-act="close" aria-label="Tutup">' + ic('close') + '</button>';
  $('card').addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    GG.Sfx.click();
    ACTIONS[b.dataset.act] && ACTIONS[b.dataset.act](b);
  });

  // ---------- Home ----------
  function renderHome() {
    $('levels').innerHTML = E.LEVELS.map((L, i) => {
      const best = P.bests[L.id];
      return `<button class="level" role="radio" aria-checked="${i === levelIdx}" data-i="${i}">
        <b>${L.name}</b><span>${best ? 'Terbaik ' + fmt(best) : 'Belum dimainkan'}</span></button>`;
    }).join('');
    const best = P.bests[E.LEVELS[levelIdx].id];
    $('hud-best').textContent = best ? fmt(best) : '-';
    $('hud-coins').textContent = fmt(P.coins);
    $('daily-dot').classList.toggle('hidden', !GG.dailyState().canClaim);
    // always show the next thing to chase
    const L = E.LEVELS[levelIdx], st = P.stars[L.id] || 0;
    $('home-goal').textContent = st >= 3 ? 'Semua bintang sudah didapat. Kejar rekor!' :
      `Bintang ${st + 1}: skor ${fmt(L.stars[st])}`;
  }
  $('levels').addEventListener('click', (e) => {
    const b = e.target.closest('.level');
    if (!b) return;
    levelIdx = +b.dataset.i;
    GG.Sfx.click();
    renderHome();
  });

  function goHome() {
    hideModal();
    state = 'home';
    world = null;
    document.body.classList.add('at-home');
    $('banner').classList.add('hidden');
    renderHome();
  }

  // ---------- Round ----------
  function startRound(i = levelIdx) {
    levelIdx = i;
    hideModal();
    const L = E.LEVELS[i];
    world = E.createWorld(L, E.hashStr(L.id + Date.now()));
    revived = false; doubled = false; fx.length = 0;
    document.body.classList.remove('at-home');
    resize();
    updateHud();
    // the rules banner pauses the clock: never steal the player's first seconds
    state = 'intro';
    $('banner-title').textContent = L.name;
    $('banner-text').textContent = P.tutorialDone
      ? `${L.time} detik. Bintang 3 di skor ${fmt(L.stars[2])}.`
      : 'Ketuk gelembung sebelum hilang. Ketukan beruntun memberi combo.';
    $('banner').classList.remove('hidden');
    GG.Music.start();
    GG.track('round_start', { level: L.id });
  }
  function endIntro() {
    if (state !== 'intro') return;
    $('banner').classList.add('hidden');
    P.tutorialDone = true; GG.save();
    state = 'playing';
  }
  $('btn-start').addEventListener('click', () => { GG.Sfx.click(); endIntro(); });

  function updateHud() {
    if (!world) return;
    $('hud-score').textContent = fmt(world.score);
    $('hud-time').textContent = mmss(world.timeLeft);
    document.querySelector('.stat.time').classList.toggle('low', world.timeLeft <= 5);
  }

  function onTimeUp() {
    if (!revived) {
      state = 'timeup';
      GG.Sfx.over();
      showModal('timeup', `<h2>Waktu habis!</h2>
        <p>Skor kamu ${fmt(world.score)}. Mau tambah waktu?</p>
        <div class="actions">
          <button class="btn ad wide" data-act="revive">${ic('video')}+10 detik</button>
          <button class="btn wide" data-act="results">Lihat hasil</button>
        </div>`);
      return;
    }
    showResults();
  }

  function showResults() {
    state = 'result';
    const L = E.LEVELS[levelIdx], s = E.stars(world);
    const isBest = world.score > (P.bests[L.id] || 0);
    if (isBest) P.bests[L.id] = world.score;
    P.stars[L.id] = Math.max(P.stars[L.id] || 0, s);
    P.games++;
    GG.save();
    GG.Ads.roundFinished();
    const coins = Math.round(world.score / 10);
    GG.addCoins(coins, 'round');
    world.coins = coins;
    s > 0 ? GG.Sfx.win() : GG.Sfx.over();
    GG.track('round_end', { level: L.id, score: world.score, stars: s });
    const stars = [0, 1, 2].map((k) => `<span class="${k < s ? 'on' : 'off'}">${ic('star')}</span>`).join('');
    const next = s < 3 ? `Bintang ${s + 1}: skor ${fmt(L.stars[s])}` : 'Semua bintang didapat!';
    showModal('result', `<h2>${isBest ? 'Rekor baru!' : s > 0 ? 'Mantap!' : 'Hampir!'}</h2>
      <div class="stars" aria-label="${s} dari 3 bintang">${stars}</div>
      <div class="big-score">${fmt(world.score)}</div>
      <p>Combo terbaik x${world.bestCombo}. ${next}</p>
      <div class="coin-box">
        <span class="n">${ic('coin')}<span id="r-coins">+${fmt(coins)}</span></span>
        <button class="btn ad" data-act="double" id="r-double">${ic('video')}2x koin</button>
      </div>
      <div class="actions">
        <button class="btn primary wide" data-act="again" id="r-again">${ic('restart')}Main lagi</button>
        <button class="btn wide" data-act="menu" id="r-menu">${ic('home')}Menu</button>
      </div>`);
  }

  // ---------- Pause ----------
  function pause() {
    if (state !== 'playing' && state !== 'intro') return;
    state = 'paused';
    showModal('pause', `<h2>Jeda</h2>
      <p>Skor ${fmt(world.score)} · sisa ${mmss(world.timeLeft)}</p>
      ${toggles()}
      <div class="actions">
        <button class="btn primary wide" data-act="resume" id="p-resume">${ic('play')}Lanjutkan</button>
        <button class="btn wide" data-act="menu">${ic('home')}Menu</button>
      </div>`);
  }
  function resume() {
    hideModal();
    state = $('banner').classList.contains('hidden') ? 'playing' : 'intro';
  }
  GG.pause = pause;

  // ---------- Settings / daily / help ----------
  function toggles() {
    const row = (key, icon, label) => `<div class="toggle"><span>${ic(icon)}${label}</span>
      <button class="switch" role="switch" aria-label="${label}" aria-checked="${P.settings[key]}" data-act="toggle" data-key="${key}"></button></div>`;
    return row('sound', 'sound', 'Suara') + row('music', 'music', 'Musik') + row('vibe', 'vibe', 'Getar');
  }
  function applySettings() { GG.Sfx.configure({ sound: P.settings.sound, music: P.settings.music }); }

  function showDaily() {
    const st = GG.dailyState();
    const days = GG.DAILY_REWARDS.map((n, i) => `<div class="day ${i < st.day || (!st.canClaim && i === st.day) ? 'done' : ''} ${st.canClaim && i === st.day ? 'today' : ''}">
      Hari ${i + 1}<b>${fmt(n)}</b></div>`).join('');
    showModal('daily', `${closeBtn}<h2>Hadiah harian</h2>
      <p>${st.canClaim ? 'Datang tiap hari, hadiahnya makin besar.' : 'Sudah diambil. Kembali besok!'}</p>
      <div class="days">${days}</div>
      ${st.canClaim ? `<div class="actions">
        <button class="btn primary wide" data-act="claim">Klaim ${fmt(GG.DAILY_REWARDS[st.day])}</button>
        <button class="btn ad wide" data-act="claim2">${ic('video')}Klaim 2x</button></div>` : ''}`);
  }

  const ACTIONS = {
    close: () => hideModal(),
    resume,
    menu: async () => { hideModal(); await GG.Ads.maybeInterstitial('round_end'); goHome(); },
    again: async () => { hideModal(); await GG.Ads.maybeInterstitial('round_end'); startRound(); },
    results: () => showResults(),
    revive: async () => {
      if (!(await GG.Ads.rewarded('revive'))) return;
      revived = true;
      world.timeLeft = 10; world.over = false;
      hideModal();
      state = 'playing';
    },
    double: async (b) => {
      if (doubled) return;
      if (!(await GG.Ads.rewarded('double_coins'))) return;
      doubled = true;
      GG.addCoins(world.coins, 'double_coins');
      GG.Sfx.coin();
      $('r-coins').textContent = '+' + fmt(world.coins * 2);
      b.disabled = true;
    },
    toggle: (b) => {
      const k = b.dataset.key;
      P.settings[k] = !P.settings[k];
      GG.save();
      b.setAttribute('aria-checked', P.settings[k]);
      applySettings();
    },
    claim: () => { const n = GG.claimDaily(1); GG.Sfx.coin(); toast(`+${fmt(n)} koin`); hideModal(); renderHome(); },
    claim2: async () => {
      if (!(await GG.Ads.rewarded('daily_double'))) return;
      const n = GG.claimDaily(2); GG.Sfx.coin(); toast(`+${fmt(n)} koin`); hideModal(); renderHome();
    },
  };

  $('btn-play').addEventListener('click', () => { GG.Sfx.click(); startRound(); });
  $('btn-pause').addEventListener('click', () => { GG.Sfx.click(); pause(); });
  $('btn-settings').addEventListener('click', () => { GG.Sfx.click(); showModal('settings', `${closeBtn}<h2>Pengaturan</h2>${toggles()}`); });
  $('btn-daily').addEventListener('click', () => { GG.Sfx.click(); showDaily(); });
  $('btn-help').addEventListener('click', () => {
    GG.Sfx.click();
    showModal('help', `${closeBtn}<h2>Cara main</h2><ol class="help-list">
      <li>Ketuk gelembung sebelum hilang.</li>
      <li>Ketukan beruntun dalam waktu singkat memberi combo, skor naik sampai 8x.</li>
      <li>Meleset atau membiarkan gelembung hilang memutus combo.</li>
      <li>Kejar skor untuk bintang 1, 2, dan 3.</li></ol>
      <div class="actions"><button class="btn primary wide" data-act="close">Mengerti</button></div>`);
  });

  // ---------- Back button, keyboard, background ----------
  GG.handleBack = () => {
    if (document.querySelector('.ad-mock')) return true; // ads close themselves
    if (modalName === 'pause') { resume(); return true; }
    if (modalName === 'timeup') { showResults(); return true; }
    if (modalName === 'result') { ACTIONS.menu(); return true; }
    if (modalName) { hideModal(); return true; }
    if (state === 'playing' || state === 'intro') { pause(); return true; }
    return false; // at home: let the app exit
  };
  if (!window.Capacitor) {
    try {
      history.pushState({ g: 1 }, '');
      window.addEventListener('popstate', () => { GG.handleBack(); history.pushState({ g: 1 }, ''); });
    } catch (e) { /* ignore */ }
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' || e.key === 'p') GG.handleBack(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });

  // ---------- Canvas ----------
  const cv = $('cv'), cx = cv.getContext('2d');
  let view = { s: 1, ox: 0, oy: 0, dpr: 1 };
  function resize() {
    const r = cv.getBoundingClientRect();
    if (!r.width) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(r.width * dpr);
    cv.height = Math.round(r.height * dpr);
    // fixed world, letterboxed: gameplay is identical on every screen
    const s = Math.min(r.width / E.W, r.height / E.H);
    view = { s, ox: (r.width - E.W * s) / 2, oy: (r.height - E.H * s) / 2, dpr };
  }
  window.addEventListener('resize', resize);
  function toWorld(e) {
    const r = cv.getBoundingClientRect();
    return [(e.clientX - r.left - view.ox) / view.s, (e.clientY - r.top - view.oy) / view.s];
  }
  cv.addEventListener('pointerdown', (e) => {
    if (state !== 'playing') return;
    handleTap(...toWorld(e));
  });
  function handleTap(x, y) {
    E.tap(world, x, y);
    drainEvents();
  }

  function drainEvents() {
    for (const ev of world.events) {
      if (ev.type === 'pop') {
        GG.Sfx.pop(ev.combo);
        vibrate(8);
        for (let i = 0; i < 12; i++) {
          const a = Math.random() * Math.PI * 2, v = 80 + Math.random() * 160;
          fx.push({ kind: 'p', x: ev.x, y: ev.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t: 0, life: 0.5 });
        }
        fx.push({ kind: 'ring', x: ev.x, y: ev.y, t: 0, life: 0.35 });
        fx.push({ kind: 'text', x: ev.x, y: ev.y, text: ev.combo > 1 ? `+${ev.gain} x${ev.combo}` : `+${ev.gain}`, t: 0, life: 0.8 });
        const sc = $('hud-score'); sc.classList.add('bump'); setTimeout(() => sc.classList.remove('bump'), 120);
        if (ev.combo >= 5) shake = 4;
      } else if (ev.type === 'miss') {
        GG.Sfx.miss();
      } else if (ev.type === 'end') {
        onTimeUp();
      }
    }
    world.events.length = 0;
    updateHud();
  }

  const COLORS = ['#ff6b81', '#4d7cfe', '#ffd23f', '#22d3ee', '#a78bfa'];
  function draw() {
    const { s, ox, oy, dpr } = view;
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx.clearRect(0, 0, cv.width, cv.height);
    if (!world) return;
    const sx = shake ? (Math.random() - 0.5) * shake : 0;
    cx.setTransform(dpr * s, 0, 0, dpr * s, dpr * (ox + sx), dpr * oy);
    for (const b of world.bubbles) {
      const k = b.age / b.life, grow = Math.min(1, b.age / 0.12);
      const r = E.R * grow * (k > 0.75 ? 1 - (k - 0.75) * 1.2 : 1);
      cx.globalAlpha = k > 0.75 ? 1 - (k - 0.75) * 3 : 1;
      cx.fillStyle = COLORS[b.id % COLORS.length];
      cx.beginPath(); cx.arc(b.x, b.y, r, 0, Math.PI * 2); cx.fill();
      cx.fillStyle = 'rgba(255,255,255,.55)';
      cx.beginPath(); cx.ellipse(b.x - r * 0.35, b.y - r * 0.4, r * 0.28, r * 0.18, -0.6, 0, Math.PI * 2); cx.fill();
      // remaining life as a thin ring
      cx.strokeStyle = 'rgba(255,255,255,.8)'; cx.lineWidth = 3;
      cx.beginPath(); cx.arc(b.x, b.y, r + 5, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - k)); cx.stroke();
    }
    cx.globalAlpha = 1;
    for (const f of fx) {
      const k = f.t / f.life;
      cx.globalAlpha = 1 - k;
      if (f.kind === 'p') { cx.fillStyle = '#fff7e8'; cx.beginPath(); cx.arc(f.x, f.y, 4 * (1 - k), 0, Math.PI * 2); cx.fill(); }
      else if (f.kind === 'ring') { cx.strokeStyle = '#fff7e8'; cx.lineWidth = 4 * (1 - k); cx.beginPath(); cx.arc(f.x, f.y, E.R + 30 * k, 0, Math.PI * 2); cx.stroke(); }
      else { cx.fillStyle = '#ffd23f'; cx.font = '700 24px Fredoka, sans-serif'; cx.textAlign = 'center'; cx.fillText(f.text, f.x, f.y - 30 - 40 * k); }
    }
    cx.globalAlpha = 1;
  }

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (state === 'playing' && world) { E.step(world, dt); drainEvents(); }
    for (const f of fx) { f.t += dt; if (f.vx !== undefined) { f.x += f.vx * dt; f.y += f.vy * dt; } }
    for (let i = fx.length - 1; i >= 0; i--) if (fx[i].t >= fx[i].life) fx.splice(i, 1);
    shake = Math.max(0, shake - dt * 20);
    draw();
    requestAnimationFrame(frame);
  }

  applySettings();
  renderHome();
  requestAnimationFrame(frame);

  // ---------- Test hook (scripts/smoke.js); not used by the UI ----------
  window.__tangkap = {
    get state() { return state; },
    get world() { return world; },
    profile: P,
    start: (i = 0) => startRound(i),
    skipIntro: () => endIntro(),
    // tap the oldest bubble through the real tap handler
    tapBubble() {
      const b = world && world.bubbles[0];
      if (!b || state !== 'playing') return false;
      handleTap(b.x, b.y);
      return true;
    },
    // screen position of the oldest bubble, for real pointer clicks
    bubbleOnScreen() {
      const b = world && world.bubbles[0];
      if (!b) return null;
      const r = cv.getBoundingClientRect();
      return [r.left + view.ox + b.x * view.s, r.top + view.oy + b.y * view.s];
    },
    setTime: (s) => { world.timeLeft = s; },
    goHome,
  };
})();

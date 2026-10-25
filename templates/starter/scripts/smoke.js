// Headless smoke test: plays real rounds on phone, small phone and desktop viewports,
// fails on any page error, and saves screenshots.
// Usage: python3 -m http.server 8123 & node scripts/smoke.js [url] [out-dir]
const { chromium } = require('playwright');
const fs = require('fs');
const [url = 'http://localhost:8123/', out = 'shots'] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });

(async () => {
  const b = await chromium.launch();
  const errors = [];
  const run = async (name, viewport, fn) => {
    const mobile = viewport.width < 700;
    const ctx = await b.newContext({ viewport, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile });
    const p = await ctx.newPage();
    p.on('pageerror', (e) => errors.push(`${name}: ${e.message}`));
    p.on('console', (m) => m.type() === 'error' && errors.push(`${name}: ${m.text()}`));
    await p.addInitScript(() => { window.GG = { fastAds: true }; });
    await p.goto(url);
    await p.waitForTimeout(500);
    await fn(p, name);
    await ctx.close();
  };
  const shot = (p, n) => p.screenshot({ path: `${out}/${n}.png` });
  const playUntil = async (p, ms) => {
    const end = Date.now() + ms;
    while (Date.now() < end) { await p.evaluate(() => window.__tangkap.tapBubble()); await p.waitForTimeout(140); }
  };

  await run('phone', { width: 390, height: 844 }, async (p, n) => {
    await shot(p, `${n}-home`);
    await p.click('#btn-play');
    await p.waitForTimeout(300);
    await shot(p, `${n}-intro`);
    if (await p.evaluate(() => window.__tangkap.state) !== 'intro') errors.push('banner should pause the round');
    await p.click('#btn-start');
    await p.waitForTimeout(700);
    // one real pointer tap on a bubble must score
    const pos = await p.evaluate(() => window.__tangkap.bubbleOnScreen());
    if (pos) await p.mouse.click(pos[0], pos[1]);
    await p.waitForTimeout(100);
    if (await p.evaluate(() => window.__tangkap.world.score) <= 0) errors.push('real tap did not score');
    await playUntil(p, 1500);
    await shot(p, `${n}-play`);
    // pause and resume
    await p.click('#btn-pause'); await p.waitForTimeout(200);
    await shot(p, `${n}-pause`);
    await p.click('#p-resume');
    // time up -> revive through the mock rewarded ad -> results
    await p.evaluate(() => window.__tangkap.setTime(0.2));
    await p.waitForTimeout(500);
    await shot(p, `${n}-timeup`);
    await p.click('[data-act="revive"]');
    await p.waitForSelector('.ad-close:not([disabled])'); await p.click('.ad-close');
    await p.waitForTimeout(400);
    if (await p.evaluate(() => window.__tangkap.state) !== 'playing') errors.push('revive did not resume play');
    await playUntil(p, 1000);
    await p.evaluate(() => window.__tangkap.setTime(0.1));
    await p.waitForSelector('#r-again');
    await shot(p, `${n}-result`);
    const before = await p.evaluate(() => window.__tangkap.profile.coins);
    await p.click('#r-double');
    await p.waitForSelector('.ad-close:not([disabled])'); await p.click('.ad-close');
    await p.waitForTimeout(400);
    if (await p.evaluate(() => window.__tangkap.profile.coins) <= before && before > 0) errors.push('2x coins did not pay');
    await p.click('#r-menu');
    await p.waitForTimeout(400);
    if (await p.evaluate(() => window.__tangkap.state) !== 'home') errors.push('menu did not go home');
    await p.click('#btn-daily'); await p.waitForTimeout(200); await shot(p, `${n}-daily`);
    await p.click('[data-act="claim"]'); await p.waitForTimeout(200);
    await p.click('#btn-settings'); await p.waitForTimeout(200); await shot(p, `${n}-settings`);
    await p.click('[data-act="close"]');
  });

  for (const [name, viewport] of [['small', { width: 360, height: 640 }], ['desktop', { width: 1366, height: 768 }]]) {
    await run(name, viewport, async (p, n) => {
      await shot(p, `${n}-home`);
      await p.evaluate(() => { window.__tangkap.start(1); window.__tangkap.skipIntro(); });
      await playUntil(p, 1200);
      await shot(p, `${n}-play`);
      const geo = await p.evaluate(() => { const r = document.getElementById('cv').getBoundingClientRect(); return [r.left, r.right, r.top, r.bottom, innerWidth, innerHeight]; });
      if (geo[0] < 0 || geo[1] > geo[4] || geo[2] < 0 || geo[3] > geo[5]) errors.push(`${n}: canvas overflows ${geo}`);
    });
  }
  await b.close();
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'smoke OK');
  process.exit(errors.length ? 1 : 0);
})();

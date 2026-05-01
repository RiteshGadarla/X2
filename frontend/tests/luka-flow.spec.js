import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const flow = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '..', 'src', 'config', 'mock-luka-aegis.json.json'),
    'utf-8'
  )
);

test.describe('Luka Aegis demo walkthrough', () => {
  test('walks every step in mock-luka-aegis.json.json', async ({ page }) => {
    test.setTimeout(180000);

    const results = [];
    const record = (step, status, detail = '') =>
      results.push({ id: step.id, action: step.action, selector: step.selector || '', status, detail });

    page.on('pageerror', (err) => console.log(`[pageerror] ${err.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error') console.log(`[console.error] ${msg.text()}`);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const isDemo = !!process.env.DEMO;
    const demoPause = isDemo ? 1400 : 0;

    const speak = (text) => {
      if (!text) return;
      console.log(`  💬 ${text}`);
    };

    const flashHighlight = async (locator, durationMs = 1500) => {
      await page.evaluate(([sel, dur]) => {
        const el = document.querySelector(sel);
        if (!el) return;
        const prev = el.style.cssText;
        el.style.outline = '3px solid #22d3ee';
        el.style.outlineOffset = '4px';
        el.style.boxShadow = '0 0 0 6px rgba(34,211,238,0.25)';
        el.style.transition = 'all 0.2s ease';
        setTimeout(() => { el.style.cssText = prev; }, dur);
      }, [locator, durationMs]);
    };

    for (const step of flow.steps) {
      const { id, action, selector } = step;
      console.log(`\n→ [${id}] action=${action}${selector ? ' selector=' + selector : ''}`);
      speak(step.speak?.before);

      try {
        if (action === 'none') {
          record(step, 'PASS', 'narration only');
          if (isDemo) await page.waitForTimeout(demoPause);
          continue;
        }

        if (!selector) {
          record(step, 'FAIL', 'no selector');
          continue;
        }

        const locator = page.locator(selector).first();

        if (action === 'click') {
          await locator.waitFor({ state: 'visible', timeout: 8000 });
          if (isDemo) await flashHighlight(selector, 800);
          if (isDemo) await page.waitForTimeout(600);
          await locator.click();
          await page.waitForLoadState('networkidle').catch(() => {});
          record(step, 'PASS', 'clicked');
        } else if (action === 'scroll' || action === 'highlight') {
          await locator.waitFor({ state: 'attached', timeout: 8000 });
          const visible = await locator.isVisible().catch(() => false);
          if (action === 'scroll') {
            await locator.scrollIntoViewIfNeeded().catch(() => {});
          }
          if (isDemo) await flashHighlight(selector, step.highlight?.durationMs ?? 1500);
          record(step, visible ? 'PASS' : 'WARN', visible ? 'found' : 'attached but not visible');
        } else {
          record(step, 'WARN', `unknown action: ${action}`);
        }

        speak(step.speak?.after);
        const pauseAfter = step.pause?.afterMs ?? 0;
        const wait = isDemo
          ? Math.max(demoPause, pauseAfter)
          : Math.min(pauseAfter, 800);
        if (wait > 0) await page.waitForTimeout(wait);
      } catch (err) {
        record(step, 'FAIL', err.message.split('\n')[0]);
      }
    }

    console.log('\n══════ Walkthrough Result Summary ══════');
    const pad = (s, n) => (s + ' '.repeat(n)).slice(0, n);
    console.log(pad('STEP', 28), pad('ACTION', 10), pad('STATUS', 6), 'DETAIL');
    console.log('─'.repeat(110));
    for (const r of results) {
      console.log(pad(r.id, 28), pad(r.action, 10), pad(r.status, 6), r.detail);
    }
    const failed = results.filter((r) => r.status === 'FAIL');
    const warned = results.filter((r) => r.status === 'WARN');
    console.log(`\n${results.length} total | ${results.length - failed.length - warned.length} passed | ${warned.length} warn | ${failed.length} failed`);

    expect(failed, `Failures:\n${failed.map((f) => `  ${f.id} (${f.selector}): ${f.detail}`).join('\n')}`).toEqual([]);
  });
});

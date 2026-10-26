import test from 'node:test';
import assert from 'node:assert/strict';
import { getAssetUrl } from './assets.js';

test('getAssetUrl normalizes legacy public/ prefix', () => {
  assert.equal(getAssetUrl('public/assets/heritages-roofing.png'), '/assets/heritages-roofing.png');
  assert.equal(getAssetUrl('public\\assets\\lumian.png'), '/assets/lumian.png');
});

test('getAssetUrl ensures leading slash on relative paths', () => {
  assert.equal(getAssetUrl('assets/velora-motors.png'), '/assets/velora-motors.png');
});

test('getAssetUrl preserves full HTTP and HTTPS URLs', () => {
  const url = 'https://example.com/image.png';
  assert.equal(getAssetUrl(url), url);
});

test('getAssetUrl returns default fallback on empty, null, or undefined', () => {
  assert.equal(getAssetUrl(''), '/assets/zentra-tech.png');
  assert.equal(getAssetUrl(null), '/assets/zentra-tech.png');
  assert.equal(getAssetUrl(undefined, '/fallback.png'), '/fallback.png');
});

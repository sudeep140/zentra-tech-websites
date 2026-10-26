import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTierPrice, estimateProjectBudget } from './pricing.js';

test('calculateTierPrice computes monthly price without discount', () => {
  const result = calculateTierPrice(1000, 'monthly');
  assert.equal(result.finalPrice, 1000);
  assert.equal(result.discountAmount, 0);
  assert.equal(result.formattedPrice, '$1,000');
});

test('calculateTierPrice applies 20% discount for yearly billing', () => {
  const result = calculateTierPrice(1000, 'yearly', 20);
  assert.equal(result.finalPrice, 800);
  assert.equal(result.discountAmount, 200);
  assert.equal(result.formattedPrice, '$800');
});

test('calculateTierPrice handles edge cases like 0 price', () => {
  const result = calculateTierPrice(0, 'yearly', 20);
  assert.equal(result.finalPrice, 0);
  assert.equal(result.formattedPrice, '$0');
});

test('calculateTierPrice throws on negative prices', () => {
  assert.throws(() => calculateTierPrice(-50, 'monthly'), /Price cannot be negative/);
});

test('estimateProjectBudget calculates correct base tier and add-ons', () => {
  const starterSingle = estimateProjectBudget(['Web Design'], 'starter', false);
  assert.equal(starterSingle, 999);

  const proMultiple = estimateProjectBudget(['Web Design', '3D Website', 'AI Agents'], 'pro', false);
  // 2499 + 2 * 600 = 3699
  assert.equal(proMultiple, 3699);

  const urgentEnterprise = estimateProjectBudget(['Web Design'], 'enterprise', true);
  // 4999 * 1.25 = 6248.75 -> 6249
  assert.equal(urgentEnterprise, 6249);
});

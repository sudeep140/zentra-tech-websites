import test from 'node:test';
import assert from 'node:assert/strict';
import { verifySessionToken, loginOwner } from './auth.js';

test('loginOwner verifies valid credentials and issues valid token', async () => {
  const result = await loginOwner('tharusudeep242@gmail.com', 'ZentraAdmin2025!');
  assert.equal(result.success, true);
  assert.ok(result.token);

  const verification = verifySessionToken(result.token);
  assert.equal(verification.valid, true);
  assert.equal(verification.email, 'tharusudeep242@gmail.com');
});

test('loginOwner rejects invalid credentials', async () => {
  const result = await loginOwner('tharusudeep242@gmail.com', 'WrongPassword!');
  assert.equal(result.success, false);
  assert.equal(result.token, undefined);
});

test('verifySessionToken rejects tampered signature', () => {
  const validToken = 'eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJ0aW1lc3RhbXAiOjE3MDAwMDAwMDB9.invalidsignature';
  const verification = verifySessionToken(validToken);
  assert.equal(verification.valid, false);
});

test('verifySessionToken handles malformed string gracefully', () => {
  assert.equal(verifySessionToken('').valid, false);
  assert.equal(verifySessionToken('random-garbage').valid, false);
});

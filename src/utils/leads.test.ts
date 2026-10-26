import test from 'node:test';
import assert from 'node:assert/strict';
import { validateLeadSubmission, filterLeadsByStatus, countLeadsByStatus } from './leads.js';
import { LeadItem } from '../types/index.js';

test('validateLeadSubmission validates complete input correctly', () => {
  const result = validateLeadSubmission({
    name: 'Sudeep Adhikari',
    email: 'sudeep@example.com',
    service: '3D Websites',
    message: 'Hello, looking for a high-end agency site.',
  });

  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
});

test('validateLeadSubmission flags invalid email and empty fields', () => {
  const result = validateLeadSubmission({
    name: '',
    email: 'invalid-email',
    service: '',
    message: 'Hi',
  });

  assert.equal(result.isValid, false);
  assert.ok(result.errors.name);
  assert.ok(result.errors.email);
  assert.ok(result.errors.service);
  assert.ok(result.errors.message);
});

test('filterLeadsByStatus filters by target status', () => {
  const mockLeads: LeadItem[] = [
    { id: '1', name: 'Alice', email: 'a@ex.com', service: '3D', message: 'msg', status: 'New', date: 'Today' },
    { id: '2', name: 'Bob', email: 'b@ex.com', service: 'Web', message: 'msg', status: 'Contacted', date: 'Today' },
    { id: '3', name: 'Charlie', email: 'c@ex.com', service: 'AI', message: 'msg', status: 'In Progress', date: 'Today' },
  ];

  assert.equal(filterLeadsByStatus(mockLeads, 'All').length, 3);
  assert.equal(filterLeadsByStatus(mockLeads, 'New').length, 1);
  assert.equal(filterLeadsByStatus(mockLeads, 'Closed').length, 0);
});

test('countLeadsByStatus tallies accurately', () => {
  const mockLeads: LeadItem[] = [
    { id: '1', name: 'Alice', email: 'a@ex.com', service: '3D', message: 'msg', status: 'New', date: 'Today' },
    { id: '2', name: 'Bob', email: 'b@ex.com', service: 'Web', message: 'msg', status: 'Contacted', date: 'Today' },
    { id: '3', name: 'Charlie', email: 'c@ex.com', service: 'AI', message: 'msg', status: 'Contacted', date: 'Today' },
  ];

  const counts = countLeadsByStatus(mockLeads);
  assert.equal(counts.New, 1);
  assert.equal(counts.Contacted, 2);
  assert.equal(counts['In Progress'], 0);
  assert.equal(counts.Closed, 0);
});

import { LeadItem, LeadStatus } from '../types/index.js';

export function validateLeadSubmission(data: {
  name?: string;
  email?: string;
  service?: string;
  message?: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!data.service || data.service.trim().length === 0) {
    errors.service = 'Please select a service.';
  }

  if (!data.message || data.message.trim().length < 5) {
    errors.message = 'Message must be at least 5 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function filterLeadsByStatus(leads: LeadItem[], status: LeadStatus | 'All'): LeadItem[] {
  if (status === 'All') return leads;
  return leads.filter((lead) => lead.status === status);
}

export function countLeadsByStatus(leads: LeadItem[]): Record<LeadStatus, number> {
  const counts: Record<LeadStatus, number> = {
    New: 0,
    Contacted: 0,
    'In Progress': 0,
    Closed: 0,
  };

  for (const lead of leads) {
    if (counts[lead.status] !== undefined) {
      counts[lead.status]++;
    }
  }

  return counts;
}

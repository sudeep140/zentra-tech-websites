import { LeadItem, ProjectItem } from '../types/index.js';

const LEADS_STORAGE_KEY = 'zentra.dashboard.leads.v1';
const PROJECTS_STORAGE_KEY = 'zentra.dashboard.projects.v1';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isLeadItem(value: unknown): value is LeadItem {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string'
    && typeof value.name === 'string'
    && typeof value.email === 'string'
    && typeof value.service === 'string'
    && typeof value.message === 'string'
    && (value.status === 'New' || value.status === 'Contacted' || value.status === 'In Progress' || value.status === 'Closed')
    && typeof value.date === 'string'
    && (value.budget === undefined || typeof value.budget === 'string');
}

function isProjectItem(value: unknown): value is ProjectItem {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string'
    && typeof value.title === 'string'
    && (value.category === 'Websites' || value.category === '3D' || value.category === 'Branding' || value.category === 'Apps')
    && typeof value.subtitle === 'string'
    && typeof value.description === 'string'
    && Array.isArray(value.tags) && value.tags.every((tag) => typeof tag === 'string')
    && typeof value.image === 'string'
    && typeof value.featured === 'boolean';
}

function loadItems<T>(
  key: string,
  fallback: T[],
  isItem: (value: unknown) => value is T
): T[] {
  try {
    const stored = window.localStorage.getItem(key);
    if (stored === null) return fallback;

    const parsed: unknown = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.every(isItem)) return parsed;

    console.error(`Saved dashboard data at "${key}" has an invalid format. Using initial data instead.`);
  } catch (error) {
    console.error(`Unable to load dashboard data from "${key}". Using initial data instead.`, error);
  }
  return fallback;
}

function saveItems<T>(key: string, items: T[]): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(items));
  } catch (error) {
    console.error(`Unable to save dashboard data to "${key}".`, error);
  }
}

export function loadDashboardLeads(fallback: LeadItem[]): LeadItem[] {
  return loadItems(LEADS_STORAGE_KEY, fallback, isLeadItem);
}

export function saveDashboardLeads(leads: LeadItem[]): void {
  saveItems(LEADS_STORAGE_KEY, leads);
}

export function loadDashboardProjects(fallback: ProjectItem[]): ProjectItem[] {
  return loadItems(PROJECTS_STORAGE_KEY, fallback, isProjectItem);
}

export function saveDashboardProjects(projects: ProjectItem[]): void {
  saveItems(PROJECTS_STORAGE_KEY, projects);
}

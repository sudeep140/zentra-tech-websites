import fs from 'fs';
import path from 'path';
import { supabase, isSupabaseConfigured } from './supabase.js';
import { ProjectItem, LeadItem, ArticleItem, AgencySettings } from '../types/index.js';
import {
  PROJECTS_DATA,
  INITIAL_LEADS,
  ARTICLES_DATA,
  INITIAL_SETTINGS,
} from '../data/mockData.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');

// Ensure local persistent directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

function readJsonFile<T>(filePath: string, defaultData: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return defaultData;
  }
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    const tempPath = `${filePath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
  } catch (err) {
    console.error(`Error writing to ${filePath}:`, err);
  }
}

/* ==========================================================================
   LEADS REPOSITORY
   ========================================================================== */

export async function getLeads(): Promise<LeadItem[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((row) => ({
          id: row.id,
          name: row.name,
          email: row.email,
          service: row.service,
          message: row.message,
          status: row.status,
          date: row.date || new Date(row.created_at).toISOString().split('T')[0],
          budget: row.budget,
          timeline: row.timeline,
          notes: row.notes,
        }));
      }
      console.warn('[Supabase] Failed to fetch leads, falling back to local storage:', error?.message);
    } catch (e) {
      console.warn('[Supabase] Error reading leads:', e);
    }
  }

  return readJsonFile<LeadItem[]>(LEADS_FILE, INITIAL_LEADS);
}

export async function addLead(lead: LeadItem): Promise<LeadItem> {
  const newLead: LeadItem = {
    ...lead,
    id: lead.id || `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    date: lead.date || new Date().toISOString().split('T')[0],
    status: lead.status || 'New',
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('leads').insert({
        id: newLead.id,
        name: newLead.name,
        email: newLead.email,
        service: newLead.service,
        message: newLead.message,
        status: newLead.status,
        budget: newLead.budget || null,
        timeline: newLead.timeline || null,
        date: newLead.date,
      }).select().single();

      if (!error && data) {
        return newLead;
      }
      console.warn('[Supabase] Insert lead error, storing locally:', error?.message);
    } catch (e) {
      console.warn('[Supabase] Lead exception:', e);
    }
  }

  // Local fallback
  const leads = readJsonFile<LeadItem[]>(LEADS_FILE, INITIAL_LEADS);
  const updated = [newLead, ...leads];
  writeJsonFile(LEADS_FILE, updated);
  return newLead;
}

export async function updateLeadStatus(id: string, status: LeadItem['status'], notes?: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const payload: Record<string, unknown> = { status };
      if (notes !== undefined) payload.notes = notes;
      const { error } = await supabase.from('leads').update(payload).eq('id', id);
      if (!error) return true;
      console.warn('[Supabase] Update lead error, updating locally:', error?.message);
    } catch (e) {
      console.warn('[Supabase] Lead update exception:', e);
    }
  }

  const leads = readJsonFile<LeadItem[]>(LEADS_FILE, INITIAL_LEADS);
  let found = false;
  const updated = leads.map((l) => {
    if (l.id === id) {
      found = true;
      return { ...l, status, ...(notes !== undefined ? { notes } : {}) };
    }
    return l;
  });

  if (found) {
    writeJsonFile(LEADS_FILE, updated);
  }
  return found;
}

/* ==========================================================================
   PROJECTS REPOSITORY
   ========================================================================== */

export async function getProjects(): Promise<ProjectItem[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as ProjectItem[];
      }
      console.warn('[Supabase] Could not fetch projects table, using local projects:', error?.message);
    } catch (e) {
      console.warn('[Supabase] Exception fetching projects:', e);
    }
  }

  return readJsonFile<ProjectItem[]>(PROJECTS_FILE, PROJECTS_DATA);
}

export async function saveProject(project: ProjectItem): Promise<ProjectItem> {
  const item: ProjectItem = {
    ...project,
    id: project.id || `proj-${Date.now()}`,
    tags: project.tags || [],
    gallery: project.gallery || (project.image ? [project.image] : []),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('projects').upsert(item);
      if (!error) return item;
      console.warn('[Supabase] Upsert project error, saving locally:', error?.message);
    } catch (e) {
      console.warn('[Supabase] Upsert project exception:', e);
    }
  }

  const projects = readJsonFile<ProjectItem[]>(PROJECTS_FILE, PROJECTS_DATA);
  const existingIdx = projects.findIndex((p) => p.id === item.id);
  let updated: ProjectItem[];
  if (existingIdx >= 0) {
    updated = [...projects];
    updated[existingIdx] = item;
  } else {
    updated = [item, ...projects];
  }
  writeJsonFile(PROJECTS_FILE, updated);
  return item;
}

export async function deleteProject(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (!error) return true;
      console.warn('[Supabase] Delete project error, deleting locally:', error?.message);
    } catch (e) {
      console.warn('[Supabase] Delete project exception:', e);
    }
  }

  const projects = readJsonFile<ProjectItem[]>(PROJECTS_FILE, PROJECTS_DATA);
  const filtered = projects.filter((p) => p.id !== id);
  const deleted = filtered.length !== projects.length;
  if (deleted) {
    writeJsonFile(PROJECTS_FILE, filtered);
  }
  return deleted;
}

/* ==========================================================================
   ARTICLES REPOSITORY
   ========================================================================== */

export async function getArticles(): Promise<ArticleItem[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as ArticleItem[];
      }
    } catch (e) {
      console.warn('[Supabase] Error reading articles:', e);
    }
  }

  return readJsonFile<ArticleItem[]>(ARTICLES_FILE, ARTICLES_DATA);
}

export async function saveArticle(article: ArticleItem): Promise<ArticleItem> {
  const item: ArticleItem = {
    ...article,
    id: article.id || `art-${Date.now()}`,
    date: article.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    published: article.published !== false,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('articles').upsert(item);
      if (!error) return item;
    } catch (e) {
      console.warn('[Supabase] Upsert article exception:', e);
    }
  }

  const articles = readJsonFile<ArticleItem[]>(ARTICLES_FILE, ARTICLES_DATA);
  const idx = articles.findIndex((a) => a.id === item.id);
  let updated: ArticleItem[];
  if (idx >= 0) {
    updated = [...articles];
    updated[idx] = item;
  } else {
    updated = [item, ...articles];
  }
  writeJsonFile(ARTICLES_FILE, updated);
  return item;
}

export async function deleteArticle(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn('[Supabase] Delete article exception:', e);
    }
  }

  const articles = readJsonFile<ArticleItem[]>(ARTICLES_FILE, ARTICLES_DATA);
  const filtered = articles.filter((a) => a.id !== id);
  const deleted = filtered.length !== articles.length;
  if (deleted) {
    writeJsonFile(ARTICLES_FILE, filtered);
  }
  return deleted;
}

/* ==========================================================================
   SETTINGS REPOSITORY
   ========================================================================== */

export async function getSettings(): Promise<AgencySettings> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('data')
        .eq('id', 'global')
        .single();

      if (!error && data?.data) {
        return data.data as AgencySettings;
      }
    } catch (e) {
      console.warn('[Supabase] Error reading settings:', e);
    }
  }

  return readJsonFile<AgencySettings>(SETTINGS_FILE, INITIAL_SETTINGS);
}

export async function saveSettings(settings: AgencySettings): Promise<AgencySettings> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('settings').upsert({ id: 'global', data: settings });
    } catch (e) {
      console.warn('[Supabase] Error saving settings:', e);
    }
  }

  writeJsonFile(SETTINGS_FILE, settings);
  return settings;
}

import { ProjectItem, LeadItem, ArticleItem, AgencySettings } from '../types/index.js';

const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('zentra_owner_token');
}

export function setAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem('zentra_owner_token', token);
  } else {
    localStorage.removeItem('zentra_owner_token');
  }
}

function authHeader(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* ==========================================================================
   AUTHENTICATION API
   ========================================================================== */

export async function loginOwnerApi(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Login failed');
  }

  setAuthToken(data.token);
  return data;
}

export async function verifyOwnerApi(): Promise<boolean> {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const res = await fetch(`${API_BASE}/auth/verify`, {
      headers: authHeader(),
    });
    const data = await res.json();
    return Boolean(data.valid);
  } catch {
    return false;
  }
}

export function logoutOwnerApi(): void {
  setAuthToken(null);
}

/* ==========================================================================
   PROJECTS API
   ========================================================================== */

export async function fetchProjectsApi(): Promise<ProjectItem[]> {
  const res = await fetch(`${API_BASE}/projects`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function createProjectApi(project: Partial<ProjectItem>): Promise<ProjectItem> {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
    body: JSON.stringify(project),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to create project');
  }
  return res.json();
}

export async function updateProjectApi(id: string, project: Partial<ProjectItem>): Promise<ProjectItem> {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
    body: JSON.stringify(project),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to update project');
  }
  return res.json();
}

export async function deleteProjectApi(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'DELETE',
    headers: authHeader(),
  });
  if (!res.ok) throw new Error('Failed to delete project');
  const data = await res.json();
  return Boolean(data.success);
}

/* ==========================================================================
   LEADS API
   ========================================================================== */

export async function fetchLeadsApi(): Promise<LeadItem[]> {
  const res = await fetch(`${API_BASE}/leads`, {
    headers: authHeader(),
  });
  if (!res.ok) throw new Error('Failed to fetch leads');
  return res.json();
}

export async function submitLeadApi(lead: {
  name: string;
  email: string;
  service: string;
  message: string;
  budget?: string;
  timeline?: string;
  honeypot?: string;
}): Promise<{ success: boolean; message: string; lead: LeadItem }> {
  const res = await fetch(`${API_BASE}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Submission failed');
  }
  return data;
}

export async function updateLeadStatusApi(id: string, status: LeadItem['status'], notes?: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/leads/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
    body: JSON.stringify({ status, notes }),
  });
  if (!res.ok) throw new Error('Failed to update lead status');
  return true;
}

/* ==========================================================================
   ARTICLES API
   ========================================================================== */

export async function fetchArticlesApi(): Promise<ArticleItem[]> {
  const res = await fetch(`${API_BASE}/articles`);
  if (!res.ok) throw new Error('Failed to fetch articles');
  return res.json();
}

export async function createArticleApi(article: Partial<ArticleItem>): Promise<ArticleItem> {
  const res = await fetch(`${API_BASE}/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
    body: JSON.stringify(article),
  });
  if (!res.ok) throw new Error('Failed to create article');
  return res.json();
}

export async function deleteArticleApi(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/articles/${id}`, {
    method: 'DELETE',
    headers: authHeader(),
  });
  if (!res.ok) throw new Error('Failed to delete article');
  return true;
}

/* ==========================================================================
   SETTINGS API
   ========================================================================== */

export async function fetchSettingsApi(): Promise<AgencySettings> {
  const res = await fetch(`${API_BASE}/settings`);
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
}

export async function saveSettingsApi(settings: AgencySettings): Promise<AgencySettings> {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error('Failed to save settings');
  return res.json();
}

/* ==========================================================================
   UPLOAD MEDIA API
   ========================================================================== */

export async function uploadMediaApi(file: File): Promise<{ url: string; filename: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const res = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeader(),
          },
          body: JSON.stringify({
            data: base64Data,
            filename: file.name,
            fileType: file.type,
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Upload failed');
        }

        const data = await res.json();
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  getLeads,
  addLead,
  updateLeadStatus,
  getProjects,
  saveProject,
  deleteProject,
  getArticles,
  saveArticle,
  deleteArticle,
  getSettings,
  saveSettings,
} from './src/server/storage.js';
import { loginOwner, requireOwnerAuth, verifySessionToken } from './src/server/auth.js';
import { sendLeadNotification } from './src/server/resend.js';
import { LeadItem, ProjectItem, ArticleItem, AgencySettings } from './src/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Ensure upload directory exists
const UPLOADS_DIR = path.resolve(__dirname, 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve uploaded media
app.use('/uploads', express.static(UPLOADS_DIR));

/* ==========================================================================
   AUTHENTICATION ROUTES
   ========================================================================== */

app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const result = await loginOwner(email, password);
  if (!result.success) {
    return res.status(401).json({ error: result.error });
  }

  res.json({
    success: true,
    token: result.token,
    user: result.user,
  });
});

app.get('/api/auth/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false });
  }

  const token = authHeader.substring(7);
  const result = verifySessionToken(token);
  if (!result.valid) {
    return res.status(401).json({ valid: false });
  }

  res.json({ valid: true, email: result.email, role: 'owner' });
});

app.post('/api/auth/logout', (_req: Request, res: Response) => {
  res.json({ success: true });
});

/* ==========================================================================
   LEADS & ENQUIRIES ROUTES
   ========================================================================== */

app.get('/api/leads', requireOwnerAuth, async (_req: Request, res: Response) => {
  try {
    const leads = await getLeads();
    res.json(leads);
  } catch (err) {
    console.error('Error fetching leads:', err);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

app.post('/api/leads', async (req: Request, res: Response) => {
  try {
    const { name, email, service, message, budget, timeline, honeypot } = req.body;

    // Anti-spam Honeypot Check: bots auto-fill hidden input
    if (honeypot && String(honeypot).trim().length > 0) {
      console.warn('[Spam Guard] Rejected bot submission via honeypot trap.');
      return res.status(200).json({ success: true, message: 'Enquiry received.' });
    }

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Please provide your name.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return res.status(400).json({ error: 'Please provide some project details (minimum 5 characters).' });
    }

    const newLead: LeadItem = {
      id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      service: service ? String(service).trim() : 'General Inquiry',
      message: message.trim(),
      budget: budget ? String(budget).trim() : undefined,
      timeline: timeline ? String(timeline).trim() : undefined,
      status: 'New',
      date: new Date().toISOString().split('T')[0],
    };

    const savedLead = await addLead(newLead);

    // Trigger asynchronous email notification (Resend or local fallback)
    sendLeadNotification(savedLead).catch((e) => {
      console.error('[Notification] Dispatch error:', e);
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your project inquiry has been received. Our team will review and respond within 24 hours.',
      lead: savedLead,
    });
  } catch (err) {
    console.error('Error saving lead:', err);
    res.status(500).json({ error: 'Failed to submit enquiry. Please try again or email directly.' });
  }
});

app.patch('/api/leads/:id', requireOwnerAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['New', 'Contacted', 'In Progress', 'Closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid lead status.' });
    }

    const updated = await updateLeadStatus(id, status, notes);
    if (!updated) {
      return res.status(404).json({ error: 'Lead not found.' });
    }

    res.json({ success: true, status, notes });
  } catch (err) {
    console.error('Error updating lead:', err);
    res.status(500).json({ error: 'Failed to update lead status.' });
  }
});

/* ==========================================================================
   PROJECTS CMS ROUTES
   ========================================================================== */

app.get('/api/projects', async (_req: Request, res: Response) => {
  try {
    const projects = await getProjects();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.post('/api/projects', requireOwnerAuth, async (req: Request, res: Response) => {
  try {
    const projectData = req.body as ProjectItem;
    if (!projectData.title || !projectData.category) {
      return res.status(400).json({ error: 'Title and category are required.' });
    }

    const saved = await saveProject(projectData);
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.put('/api/projects/:id', requireOwnerAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const projectData = { ...req.body, id } as ProjectItem;
    const saved = await saveProject(projectData);
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', requireOwnerAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteProject(id);
    res.json({ success: deleted });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

/* ==========================================================================
   ARTICLES CMS ROUTES
   ========================================================================== */

app.get('/api/articles', async (_req: Request, res: Response) => {
  try {
    const articles = await getArticles();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

app.post('/api/articles', requireOwnerAuth, async (req: Request, res: Response) => {
  try {
    const article = req.body as ArticleItem;
    if (!article.title || !article.excerpt) {
      return res.status(400).json({ error: 'Title and excerpt are required.' });
    }
    const saved = await saveArticle(article);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create article' });
  }
});

app.put('/api/articles/:id', requireOwnerAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const article = { ...req.body, id } as ArticleItem;
    const saved = await saveArticle(article);
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update article' });
  }
});

app.delete('/api/articles/:id', requireOwnerAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteArticle(id);
    res.json({ success: deleted });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

/* ==========================================================================
   SETTINGS ROUTES
   ========================================================================== */

app.get('/api/settings', async (_req: Request, res: Response) => {
  try {
    const settings = await getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.post('/api/settings', requireOwnerAuth, async (req: Request, res: Response) => {
  try {
    const settings = req.body as AgencySettings;
    const saved = await saveSettings(settings);
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

/* ==========================================================================
   SECURE MEDIA UPLOAD ROUTE
   ========================================================================== */

app.post('/api/upload', requireOwnerAuth, async (req: Request, res: Response) => {
  try {
    const { data, filename, fileType } = req.body;
    if (!data || !filename) {
      return res.status(400).json({ error: 'Data and filename are required.' });
    }

    // Sanitize filename
    const ext = path.extname(filename).toLowerCase() || '.png';
    const baseName = path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeName = `${baseName}_${Date.now()}${ext}`;
    const targetPath = path.join(UPLOADS_DIR, safeName);

    // Extract base64 payload if data URI
    const base64Data = data.includes('base64,') ? data.split('base64,')[1] : data;
    const buffer = Buffer.from(base64Data, 'base64');

    fs.writeFileSync(targetPath, buffer);

    const publicUrl = `/uploads/${safeName}`;
    res.json({
      success: true,
      url: publicUrl,
      filename: safeName,
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to save uploaded file.' });
  }
});

/* ==========================================================================
   SERVER INITIALIZATION (VITE IN DEV, STATIC IN PROD)
   ========================================================================== */

async function startServer() {
  if (!isProd) {
    // Development: Integrate Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: Serve static build
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Zentra Tech Server running at http://0.0.0.0:${PORT} [${isProd ? 'PRODUCTION' : 'DEVELOPMENT'}]`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup failure:', err);
  process.exit(1);
});

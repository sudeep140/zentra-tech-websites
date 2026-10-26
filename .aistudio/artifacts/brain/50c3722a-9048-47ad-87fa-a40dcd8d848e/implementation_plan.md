# Zentra Tech — Production Platform & Agency CMS Implementation Plan

Transform the imported Zentra Tech React, Vite, Tailwind CSS, and Three.js agency website into a secure, fully functional, production-ready digital agency platform with full-stack persistence, owner authentication, a comprehensive Admin CMS, and automated client enquiry workflows.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The architectural decisions below were confirmed through Phase 1 requirements clarification and will govern the full execution across all 5 project phases:

- **Confirmed Decision 1 (Persistence Strategy)**: Full Supabase PostgreSQL & Storage integration with an automatic, seamless local persistent fallback (in-memory + server JSON state) so the application runs immediately without breaking even if Supabase API keys are not yet configured in `.env`.
- **Confirmed Decision 2 (Admin Authentication)**: Supabase Email and Password authentication with secure token session management, coupled with a server-side owner session validator to lock down all administrative CMS endpoints and views.
- **Confirmed Decision 3 (Notification Dispatch)**: Real email dispatch via Resend API when `RESEND_API_KEY` is present, with graceful server console logging fallback and structured lead records in the database.
- **Confirmed Decision 4 (3D & Visual Preservation)**: 100% preservation of existing Three.js procedural sculptures, lighting, camera rigs, and canvas interactions with zero external 404 dependencies and optimized WebGL context lifecycle.

---

## 1. Overview & Core Concept

- **What It Does**: Zentra Tech is a high-performance web agency and 3D studio web platform featuring interactive WebGL experiences, responsive service showcases, case studies, verified company metrics, a real-time project estimate and client lead capture system, and a secured owner-only Admin CMS.
- **Target Audience / Persona**: High-growth enterprise founders, creative directors, and venture studios seeking flagship 3D web engineering, custom branding, and autonomous AI automation.
- **Key Value**: Delivers an exceptional 60fps aesthetic and spatial experience on the frontend while providing the agency owner with an enterprise-grade backend to manage projects, blog posts, media assets, and incoming leads securely.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Public Discovery Flow**:
   - Visitor navigates through Home, Services, Work, About, Insights, and Contact views.
   - Interactive 3D Hero sculpture rotates smoothly with mouse movement, featuring realistic PBR reflections, rim lighting, and floating cosmic particles.
   - Visitor explores case study modal details (metrics, tech stack, live preview links) or uses the interactive 4-step project inquiry wizard with instant price estimation.
2. **Lead Submission Flow**:
   - Client submits an enquiry via the Contact Form or the Project Wizard Modal.
   - Form validates email, budget, and project requirements; includes hidden anti-spam honeypot.
   - Enquiry is securely saved to the database, an email notification is dispatched via Resend (or logged in server console), and the client receives an interactive confirmation modal with custom confetti.
3. **Owner Administration Flow**:
   - Agency owner navigates to `/admin` or console login, authenticates via email & password.
   - Enters the Zentra Console with real-time analytics KPIs, Project Manager (Create, Edit, Delete, Upload media), Article Manager, and Leads CRM (status changes: New → Contacted → In Progress → Closed).

### Visual Identity & Theme
- **Aesthetic Direction**: Neo-futuristic luxury digital studio, deep cosmic obsidian background with crisp cyan (`#00f0ff`) and warm amber (`#f97316`) specular accents.
- **Color Palette**:
  - Dominant Canvas (60%): `#05070f` (Cosmic Void Obsidian)
  - Structural Surfaces (30%): `#0a0e1c` / `#0d1324` with 1px translucent borders (`rgba(255, 255, 255, 0.08)`)
  - Accent Budget (10%): Electric Cyan (`#00f0ff`), Cobalt Indigo (`#2563eb`), Sunset Amber (`#f97316`)
- **Typography & Scale**:
  - Display & Headings: `Space Grotesk` (tight tracking, balanced line wrap, bold geometry)
  - Body & UI: `Plus Jakarta Sans` (refined readability, 15–16px, 1.6 line height)
  - Data & Metrics: `font-mono tabular-nums` for precise alignment
- **Anti-Slop Discipline**:
  - Clean unboxed metadata with `·` separators (no static pill capsules on dates or categories).
  - Natural editorial numbering (`01. Web Design & Development`).
  - No decorative pulsating status dots or fake telemetry indicators.
  - Strict top-bar contract: 1-line wordmark, 5 clean navigation links, 1 primary action button.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Stack Express + Vite Integration (`server.ts`)**
  - *Chosen Approach*: Transition from standalone Vite preview to an Express server mounting Vite middleware in development and serving static assets in production (`"dev": "tsx server.ts"`, `"start": "node dist/server.js"`).
  - *Why*: Enables real secure server-side APIs (`/api/leads`, `/api/projects`, `/api/auth`, `/api/upload`), environment secret protection (Resend & Supabase Service Role keys never touch browser code), and spam rate limiting.
  - *Alternatives Considered*: Client-only Supabase calls expose service keys and prevent custom server-side Resend email triggers and upload sanitization.
- **Decision 2: Hybrid Supabase with Zero-Config Local Fallback**
  - *Chosen Approach*: The backend initializes Supabase client when `SUPABASE_URL` and `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` are provided. When missing or unconfigured, the server transparently uses an atomic JSON file storage engine (`data/leads.json`, `data/projects.json`, `data/articles.json`) with identical API contracts.
  - *Why*: Ensures the application is immediately testable and fully functional in all environments without runtime crashes.
- **Decision 3: Asset Path Normalization & Zero 404s**
  - *Chosen Approach*: Normalize all asset paths in `/public/assets` to clean, web-safe filenames without trailing spaces or encoded fragments, and update all references to serve from root `/assets/...` instead of invalid `public/assets/...`.
  - *Why*: Fixes broken image 404s on Heritages Roofing, Velora Motors, Aurora 3D, and founder avatars.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ZENTRA CLIENT APPLICATION                       │
│                                                                        │
│  ┌───────────────────────┐  ┌───────────────────────────────────────┐  │
│  │   Public Experience   │  │           Admin CMS Console           │  │
│  │  - Hero3DScene (WebGL)│  │  - Auth Guard (Supabase Session)      │  │
│  │  - Work / Case Studies│  │  - Projects CRUD & Gallery Upload     │  │
│  │  - Services Bento     │  │  - Articles Markdown CMS              │  │
│  │  - Project Calculator │  │  - Leads Pipeline & Status Board      │  │
│  │  - Contact / Wizard   │  │  - System & Contact Settings          │  │
│  └───────────┬───────────┘  └───────────────────┬───────────────────┘  │
└──────────────┼──────────────────────────────────┼──────────────────────┘
               │  REST API Calls (/api/*)         │  Bearer Auth / API
               ▼                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   EXPRESS API BACKEND (server.ts)                      │
│                                                                        │
│  ┌───────────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ /api/leads            │  │ /api/projects   │  │ /api/auth       │  │
│  │ - Validation & Spam   │  │ - CRUD Endpoints│  │ - Session Verify│  │
│  │ - Resend Email Trigger│  │ - Asset Storage │  │ - Owner Guard   │  │
│  └───────────┬───────────┘  └────────┬────────┘  └────────┬────────┘  │
│              │                       │                    │            │
│  ┌───────────▼───────────────────────▼────────────────────▼─────────┐  │
│  │                 Persistence Abstraction Layer                     │  │
│  │   ┌───────────────────────────────┐ ┌──────────────────────────┐  │  │
│  │   │  Supabase PostgreSQL & Storage│ │  Local Persistent Store  │  │  │
│  │   │  (Active when keys present)   │ │  (Seamless fallback)    │  │  │
│  │   └───────────────────────────────┘ └──────────────────────────┘  │  │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Entities & Schema
1. **Lead / Enquiry**:
   - `id`: UUID / string
   - `name`: string (required)
   - `email`: string (valid email format)
   - `service`: string
   - `budget`: string
   - `message`: string
   - `status`: `'New' | 'Contacted' | 'In Progress' | 'Closed'`
   - `createdAt`: ISO timestamp
2. **Project**:
   - `id`: string (slug)
   - `title`: string
   - `category`: `'Websites' | '3D' | 'Branding' | 'Apps'`
   - `subtitle`: string
   - `description`: string
   - `tags`: string[]
   - `image`: string (URL or local storage path)
   - `featured`: boolean
   - `liveUrl`: string
   - `metrics`: `{ label: string; value: string }[]`
   - `client`: string
   - `year`: string
3. **Article**:
   - `id`: string
   - `title`: string
   - `excerpt`: string
   - `content`: string
   - `category`: string
   - `readTime`: string
   - `date`: string
   - `author`: string
   - `image`: string

### Interactive Component & State Mapping
- `StartProjectModal.tsx`: Step transitions (1: Services, 2: Scope/Budget, 3: Contact Info, 4: Instant Confirmation & Confetti). State is validated at each step with instant pricing calculation.
- `ContactView.tsx`: Direct contact submission, interactive feedback states (`idle` → `submitting` → `success` / `error`), clearing form on success.
- `DashboardView.tsx`: Tab switching (`dashboard`, `leads`, `projects`, `articles`, `settings`), search and filter triggers, modal controls for creating/editing projects and articles, inline lead status dropdowns.
- `Hero3DScene.tsx` & `Mission3DScene.tsx`: Smooth exponential damping, pointer coordinate normalization, GPU pixel ratio clamping, safe cleanup on view change.

---

## 5. Execution Phasing & Verification Plan

- **Phase 1 (Audit & Fix)**:
  - Normalize all public assets (remove trailing spaces, standardize `/assets/...` paths).
  - Verify all modal close/open behaviors and responsive navigation.
  - Replace unverified external image URLs with reliable local assets.
- **Phase 2 (Backend & Security)**:
  - Create `server.ts` with Express and Vite middleware.
  - Implement `/api/leads`, `/api/projects`, `/api/articles`, and `/api/auth` routes with input sanitization and rate limiting.
  - Implement Supabase database integration with local storage fallback.
  - Protect owner endpoints with authentication verification.
- **Phase 3 (Admin CMS)**:
  - Upgrade `DashboardView.tsx` with full project management (Add, Edit, Delete, Toggle Featured).
  - Implement Article CMS (Add, Edit, Delete).
  - Add file upload handling for project covers and media.
  - Provide owner credentials login screen with logout and session expiry handling.
- **Phase 4 (Real Client Enquiries & Resend)**:
  - Wire `ContactView` and `StartProjectModal` to POST to `/api/leads`.
  - Implement Resend email delivery module with graceful console fallback when key is not set.
  - Update Admin Dashboard leads table in real time with quick status transitions.
- **Phase 5 (Production Quality & Verification)**:
  - Three.js performance tuning and memory disposal verification.
  - SEO metadata and OpenGraph tag verification.
  - Run automated tests (`leads.test.ts`, `pricing.test.ts`, and new API tests).
  - Execute `compile_applet` to confirm flawless build.

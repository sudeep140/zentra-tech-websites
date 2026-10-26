export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
  badge?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'Websites' | '3D' | 'Branding' | 'Apps';
  subtitle: string;
  description: string;
  tags: string[];
  image: string;
  featured: boolean;
  liveUrl?: string;
  metrics?: { label: string; value: string }[];
  client?: string;
  year?: string;
  gallery?: string[];
  model3dUrl?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  skills: string[];
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  period: string;
  description: string;
  badge?: string;
  isPopular?: boolean;
  features: string[];
  buttonText: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'In Progress' | 'Closed';

export interface LeadItem {
  id: string;
  name: string;
  email: string;
  service: string;
  message: string;
  status: LeadStatus;
  date: string;
  budget?: string;
  timeline?: string;
  notes?: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  image: string;
  published?: boolean;
}

export interface DashboardMetrics {
  totalLeads: number;
  leadsTrend: number;
  activeProjects: number;
  projectsTrend: number;
  publishedArticles: number;
  articlesTrend: number;
  totalRevenue: number;
  revenueTrend: number;
}

export interface AgencySettings {
  agencyName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  officeLocation: string;
  consultationTurnaround: string;
  primaryTimezone: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'owner' | 'admin';
}

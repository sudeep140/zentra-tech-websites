/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.js';
import { HomeView } from './components/HomeView.js';
import { AboutView } from './components/AboutView.js';
import { WorkView } from './components/WorkView.js';
import { ServicesView } from './components/ServicesView.js';
import { InsightsView } from './components/InsightsView.js';
import { ContactView } from './components/ContactView.js';
import { DashboardView } from './components/DashboardView.js';
import { PricingView } from './components/PricingView.js';
import { ProjectModal } from './components/ProjectModal.js';
import { StartProjectModal } from './components/StartProjectModal.js';
import { Footer } from './components/Footer.js';
import { INITIAL_LEADS, PROJECTS_DATA } from './data/mockData.js';
import { LeadItem, LeadStatus, ProjectItem, ServiceItem } from './types/index.js';
import {
  loadDashboardLeads,
  loadDashboardProjects,
  saveDashboardLeads,
  saveDashboardProjects,
} from './utils/dashboardStorage.js';
import { fetchProjectsApi } from './utils/api.js';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [leads, setLeads] = useState<LeadItem[]>(() => loadDashboardLeads(INITIAL_LEADS));
  const [projects, setProjects] = useState<ProjectItem[]>(() => loadDashboardProjects(PROJECTS_DATA));
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isStartProjectOpen, setIsStartProjectOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

  // Sync projects from authoritative backend API
  useEffect(() => {
    fetchProjectsApi()
      .then((data) => {
        if (data && data.length > 0) {
          setProjects(data);
        }
      })
      .catch((err) => {
        console.warn('Backend API project sync, using local cache:', err);
      });
  }, []);

  useEffect(() => {
    saveDashboardLeads(leads);
  }, [leads]);

  useEffect(() => {
    saveDashboardProjects(projects);
  }, [projects]);

  // Check query params on mount for testability / deep linking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['home', 'services', 'work', 'about', 'insights', 'contact', 'dashboard'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  const handleUpdateLeadStatus = (id: string, newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
    );
    showToast(`Lead status updated to ${newStatus}`);
  };

  const handleAddLead = (newLead: LeadItem) => {
    setLeads((prev) => [newLead, ...prev]);
    showToast('New lead successfully recorded in Dashboard!');
  };

  const handleAddProject = (newProject: ProjectItem) => {
    setProjects((prev) => [newProject, ...prev]);
    showToast(`Project "${newProject.title}" published!`);
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  const handleOpenStartProjectWithService = (serviceName: string) => {
    setPreselectedService(serviceName);
    setIsStartProjectOpen(true);
  };

  const handleSelectServiceFromHome = (service: ServiceItem) => {
    setPreselectedService(service.title);
    setActiveTab('services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#05070f] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-linear-to-r from-blue-900/90 to-cyan-900/90 border border-cyan-400/50 text-white text-xs font-semibold shadow-2xl backdrop-blur-xl flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* When in Admin Dashboard view, render standalone full-screen console */}
      {activeTab === 'dashboard' ? (
        <DashboardView
          leads={leads}
          projects={projects}
          onUpdateLeadStatus={handleUpdateLeadStatus}
          onAddProject={handleAddProject}
          onExitDashboard={() => setActiveTab('home')}
        />
      ) : (
        <>
          {/* Main Public Website Layout */}
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenProjectModal={() => {
              setPreselectedService('');
              setIsStartProjectOpen(true);
            }}
          />

          <main className="flex-1">
            {activeTab === 'home' && (
              <HomeView
                projects={projects}
                onNavigate={setActiveTab}
                onOpenProjectModal={() => {
                  setPreselectedService('');
                  setIsStartProjectOpen(true);
                }}
                onSelectProject={(proj) => setSelectedProject(proj)}
                onSelectService={handleSelectServiceFromHome}
              />
            )}

            {activeTab === 'about' && (
              <AboutView
                onOpenProjectModal={() => {
                  setPreselectedService('');
                  setIsStartProjectOpen(true);
                }}
              />
            )}

            {activeTab === 'work' && (
              <WorkView
                projects={projects}
                onSelectProject={(proj) => setSelectedProject(proj)}
                onOpenProjectModal={() => {
                  setPreselectedService('');
                  setIsStartProjectOpen(true);
                }}
              />
            )}

            {activeTab === 'services' && (
              <ServicesView
                onSelectService={(srv) => {
                  setPreselectedService(srv.title);
                  setIsStartProjectOpen(true);
                }}
                onOpenProjectModalWithService={handleOpenStartProjectWithService}
              />
            )}

            {activeTab === 'insights' && <InsightsView />}

            {activeTab === 'pricing' && (
              <PricingView
                onSelectPlan={(planName, budget) => {
                  setPreselectedService(`Plan: ${planName} (${budget})`);
                  setIsStartProjectOpen(true);
                }}
                onNavigateToContact={() => setActiveTab('contact')}
              />
            )}

            {activeTab === 'contact' && (
              <ContactView
                onAddLead={handleAddLead}
                preselectedService={preselectedService}
              />
            )}
          </main>

          <Footer
            onNavigate={setActiveTab}
            onOpenProjectModal={() => {
              setPreselectedService('');
              setIsStartProjectOpen(true);
            }}
          />
        </>
      )}

      {/* Case Study Details Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenInquiry={(projectName) => {
          setPreselectedService(`Inquiry: ${projectName}`);
          setIsStartProjectOpen(true);
        }}
      />

      {/* Start Project Wizard Modal */}
      <StartProjectModal
        isOpen={isStartProjectOpen}
        onClose={() => setIsStartProjectOpen(false)}
        onAddLead={handleAddLead}
        initialService={preselectedService}
      />
    </div>
  );
}

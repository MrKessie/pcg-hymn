// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from './config/supabase';

// Components & Layout
import Sidebar from './components/Sidebar';
import HymnFormDrawer from './components/HymnFormDrawer';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HymnsPage from './pages/HymnsPage';
import CategoriesPage from './pages/CategoriesPage';
import LiturgiesPage from './pages/LiturgiesPage';
import MediaPage from './pages/MediaPage';
import CollectionsPage from './pages/CollectionsPage';
import PresenterPage from './pages/PresenterPage';
import ImportExportPage from './pages/ImportExportPage';
import UsersPage from './pages/UsersPage';

import { SearchIcon, PresenterIcon } from './config/icons';
import './App.css';

// Main App Inner component with Router context
const AppLayout = ({ session }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Global Hymn Form Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingHymnId, setEditingHymnId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Global counts for sidebar badges
  const [stats, setStats] = useState({ hymns: 0, categories: 0, withAudio: 0, liturgies: 8 });

  useEffect(() => {
    loadCounts();
  }, [refreshKey]);

  const loadCounts = async () => {
    try {
      const [hRes, cRes, aRes] = await Promise.all([
        supabase.from('hymns').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('hymns').select('*', { count: 'exact', head: true }).not('audio_url', 'is', null),
      ]);
      setStats({
        hymns: hRes.count || 0,
        categories: cRes.count || 0,
        withAudio: aRes.count || 0,
        liturgies: 8,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenForm = (hymnId = null) => {
    setEditingHymnId(hymnId);
    setDrawerOpen(true);
  };

  const handleCloseForm = () => {
    setDrawerOpen(false);
    setEditingHymnId(null);
  };

  const handleHymnSaved = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // If in presenter mode route, render Presenter without the main admin sidebar
  const isPresenterRoute = location.pathname.startsWith('/presenter');
  if (isPresenterRoute) {
    return (
      <Routes>
        <Route path="/presenter" element={<PresenterPage />} />
        <Route path="/presenter/:hymnId" element={<PresenterPage />} />
      </Routes>
    );
  }

  // Determine current page name for breadcrumb
  const getPageName = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard & Overview';
    if (path.startsWith('/hymns')) return 'Hymns Library';
    if (path.startsWith('/categories')) return 'Categories & Themes';
    if (path.startsWith('/liturgies')) return 'Liturgies & Creeds';
    if (path.startsWith('/media')) return 'Audio & Media Manager';
    if (path.startsWith('/collections')) return 'Church Seasons & Sets';
    if (path.startsWith('/import-export')) return 'Database Backup & Import';
    if (path.startsWith('/users')) return 'Team & Role Permissions';
    return 'Admin';
  };

  return (
    <div className="app-layout">
      {/* Collapsible Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        session={session}
        stats={stats}
      />

      {/* Main Wrapper */}
      <div className="main-wrapper">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="sidebar-toggle-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ display: 'none' }} // styled for mobile in CSS
            >
              ☰
            </button>
            <div className="page-breadcrumb">
              <span>PCG Hymnal</span>
              <span>/</span>
              <strong>{getPageName()}</strong>
            </div>
          </div>

          <div className="topbar-right">
            <div className="topbar-search">
              <span className="search-icon-pos">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Jump to hymn (e.g. 45)..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    navigate('/hymns');
                  }
                }}
              />
            </div>

            <button
              className="btn btn-gold btn-sm"
              onClick={() => navigate('/presenter')}
              title="Launch Sunday Service Projector Mode"
            >
              <PresenterIcon /> Presenter Mode
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="content-container">
          <Routes>
            <Route
              path="/"
              element={<DashboardPage key={refreshKey} onOpenHymnForm={handleOpenForm} />}
            />
            <Route
              path="/hymns"
              element={<HymnsPage key={refreshKey} onOpenHymnForm={handleOpenForm} />}
            />
            <Route path="/categories" element={<CategoriesPage key={refreshKey} />} />
            <Route path="/liturgies" element={<LiturgiesPage />} />
            <Route path="/media" element={<MediaPage key={refreshKey} />} />
            <Route path="/collections" element={<CollectionsPage key={refreshKey} />} />
            <Route path="/import-export" element={<ImportExportPage />} />
            <Route path="/users" element={<UsersPage session={session} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global Hymn Add/Edit Drawer */}
      <HymnFormDrawer
        hymnId={editingHymnId}
        isOpen={drawerOpen}
        onClose={handleCloseForm}
        onSaved={handleHymnSaved}
      />
    </div>
  );
};

function App() {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoadingSession(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loadingSession) {
    return (
      <div className="login-page-bg" style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>
        Connecting to Presbyterian Church Hymnal Portal...
      </div>
    );
  }

  if (!session) {
    return <LoginPage />;
  }

  return (
    <Router>
      <AppLayout session={session} />
    </Router>
  );
}

export default App;
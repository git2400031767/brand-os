import { useState } from 'react';
import {
  LayoutDashboard,
  Lightbulb,
  Calendar,
  BarChart2,
  Handshake,
  DollarSign,
  ChevronRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Ideas from './pages/Ideas';
import Posts from './pages/Posts';
import Analytics from './pages/Analytics';
import Deals from './pages/Deals';
import Income from './pages/Income';
import { useToast } from './hooks/useToast';

const NAV = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'ideas', label: 'Ideas', icon: Lightbulb },
  { id: 'posts', label: 'Content Queue', icon: Calendar },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'deals', label: 'Brand Deals', icon: Handshake },
  { id: 'income', label: 'Income', icon: DollarSign },
];

export default function App() {
  const [page, setPage] = useState('dashboard');
  const { toast, showToast } = useToast();

  const pages = {
    dashboard: Dashboard,
    ideas: Ideas,
    posts: Posts,
    analytics: Analytics,
    deals: Deals,
    income: Income,
  };

  const Page = pages[page];

  return (
    <div className="app">

      <aside className="sidebar">

        <div className="sidebar-logo">
          <div className="logo-mark">
            <span>B</span>
          </div>

          <div>
            <div className="logo-text">Brand OS</div>
            <span className="logo-sub">
              Creator Command Center
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">

          <div className="nav-section-label">
            Workspace
          </div>

          {NAV.map(({ id, label, icon: Icon }) => (
            <div
              key={id}
              className={`nav-item ${page === id ? 'active' : ''}`}
              onClick={() => setPage(id)}
            >
              <Icon />

              <span>{label}</span>

              {page === id && (
                <ChevronRight
                  style={{
                    marginLeft: 'auto',
                    width: 13,
                    opacity: 0.5
                  }}
                />
              )}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-profile">

            <div className="profile-avatar">
              CK
            </div>

            <div>
              <div className="profile-name">
                Creator
              </div>

              <div className="profile-handle">
                @yourbrand
              </div>
            </div>

          </div>
        </div>
      </aside>

      <main className="main">
        <Page showToast={showToast} />
      </main>

      {toast && (
        <div className={`toast ${toast.type}`}>

          {toast.type === 'success' ? (
            <CheckCircle
              size={14}
              color="var(--success)"
            />
          ) : (
            <AlertCircle
              size={14}
              color="var(--danger)"
            />
          )}

          {toast.message}
        </div>
      )}
    </div>
  );
}
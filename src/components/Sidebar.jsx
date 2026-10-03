import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Cloud,
  ScrollText,
  ShieldAlert,
  Network,
  ClipboardCheck,
  CloudCog,
  LogOut,
} from 'lucide-react';
import { alertsSummary } from '../data/alerts';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/accounts', icon: Cloud, label: 'AWS Accounts' },
  { to: '/logs', icon: ScrollText, label: 'CloudTrail Logs' },
  { to: '/security', icon: ShieldAlert, label: 'Security & Alerts', badge: alertsSummary.open },
  { to: '/architecture', icon: Network, label: 'Architecture' },
  { to: '/compliance', icon: ClipboardCheck, label: 'Compliance & Audit' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const displayName = user?.name || 'Sravani K.';
  const displayRole = user?.role || 'Cloud Security Admin';
  const displayInitials = user?.avatarInitials || (displayName ? displayName.slice(0, 2).toUpperCase() : 'SK');

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <CloudCog size={20} />
        </div>
        <div className="sidebar-title">
          <h1>CloudTrail</h1>
          <span>Log Aggregation</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-label">Main Menu</span>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <item.icon size={18} />
            {item.label}
            {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-user">
          <div className="sidebar-footer-avatar">{displayInitials}</div>
          <div className="sidebar-footer-info">
            <span className="sidebar-footer-name" title={displayName}>{displayName}</span>
            <span className="sidebar-footer-role" title={displayRole}>{displayRole}</span>
          </div>
        </div>
        <button
          className="sidebar-logout-btn"
          onClick={handleLogout}
          title="Sign out of SecOps session"
          aria-label="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}

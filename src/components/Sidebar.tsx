import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Terminal, 
  Wrench, 
  ShieldCheck, 
  Cloud,
  Bot, 
  Workflow,
  Briefcase,
  Menu,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Linux Labs', path: '/linux', icon: Terminal },
    { name: 'DevOps Tools', path: '/devops', icon: Wrench },
    { name: 'Security', path: '/security', icon: ShieldCheck },
    { name: 'Multi-Cloud', path: '/cloud', icon: Cloud },
    { name: 'AI Assistant', path: '/ai-assistant', icon: Bot },
    { name: 'n8n Workflows', path: '/n8n', icon: Workflow },
    { name: 'Projects', path: '/projects', icon: Briefcase },
  ];

  return (
    <>
      {/* Mobile hamburger button */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`sidebar glass-panel ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-icon"></div>
          <h2>NK's DevSecOps</h2>
          <button 
            className="mobile-close-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink 
              key={item.name} 
              to={item.path} 
              className={({ isActive }: { isActive: boolean }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <item.icon className="nav-icon" size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

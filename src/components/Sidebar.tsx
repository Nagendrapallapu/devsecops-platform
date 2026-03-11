import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Terminal, 
  Wrench, 
  ShieldCheck, 
  Cloud,
  Bot, 
  Workflow,
  Briefcase 
} from 'lucide-react';
import '../styles/Sidebar.css';

const Sidebar = () => {
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
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="logo-icon"></div>
        <h2>NK's DevSecOps</h2>
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
  );
};

export default Sidebar;

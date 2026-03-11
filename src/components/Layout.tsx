import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../styles/Layout.css';

const Layout = () => {
  return (
    <div className="layout-container">
      <div className="glow-bg bg-1"></div>
      <div className="glow-bg bg-2"></div>
      <Sidebar />
      <main className="main-content">
        <div className="content-wrapper glass-panel">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;

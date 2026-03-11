import { motion } from 'framer-motion';
import { Activity, Server, Shield, Cloud, CheckCircle } from 'lucide-react';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const stats = [
    { title: 'Active Pipelines', value: '12', icon: Activity, color: '#3b82f6' },
    { title: 'Kubernetes Clusters', value: '4', icon: Server, color: '#8b5cf6' },
    { title: 'Security Scans', value: '156', icon: Shield, color: '#10b981' },
    { title: 'Cloud Resources', value: '89', icon: Cloud, color: '#f59e0b' },
  ];

  return (
    <div className="dashboard-container">
      <motion.div 
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Platform Overview</h1>
        <p>Monitor your DevSecOps metrics and jump into practice labs.</p>
        <div className="system-status-banner">
          <CheckCircle size={18} color="#10b981" />
          <span>All cloud services are operational</span>
          <div className="status-pulse"></div>
        </div>
      </motion.div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div 
            key={stat.title}
            className="stat-card glass-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-details">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-content">
        <motion.div 
          className="recent-activity glass-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <span className="dot success"></span>
              <p>Jenkins Pipeline #45 passed successfully</p>
              <span className="time">2 mins ago</span>
            </div>
            <div className="activity-item">
              <span className="dot warning"></span>
              <p>Trivy scan found 2 medium vulnerabilities in frontend image</p>
              <span className="time">15 mins ago</span>
            </div>
            <div className="activity-item">
              <span className="dot info"></span>
              <p>AWS EKS cluster "prod-us-east" scaled up to 5 nodes</p>
              <span className="time">1 hour ago</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="quick-actions glass-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="btn-primary">Start Linux Lab</button>
            <button className="btn-secondary">Ask AI Assistant</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

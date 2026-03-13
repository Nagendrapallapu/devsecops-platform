import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LinuxLabs from './pages/LinuxLabs';
import DevOpsTools from './pages/DevOpsTools';
import SecurityTools from './pages/SecurityTools';
import MultiCloud from './pages/MultiCloud';
import AIAssistant from './pages/AIAssistant';
import N8nWorkflows from './pages/N8nWorkflows';
import Projects from './pages/Projects';
import './styles/index.css';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="linux" element={<LinuxLabs />} />
          <Route path="devops" element={<DevOpsTools />} />
          <Route path="security" element={<SecurityTools />} />
          <Route path="cloud" element={<MultiCloud />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
          <Route path="n8n" element={<N8nWorkflows />} />
          <Route path="projects" element={<Projects />} />
        </Route>
      </Routes>
      <SpeedInsights />
    </Router>
  );
}

export default App;

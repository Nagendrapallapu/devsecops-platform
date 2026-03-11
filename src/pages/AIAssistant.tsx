import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Bot, User, Send, Command, Zap, Code } from 'lucide-react';
import '../styles/AIAssistant.css';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  type?: 'text' | 'code' | 'action';
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am your Agentic DevSecOps Assistant. I can help you write Terraform, configure CI/CD pipelines, audit security policies, or debug Kubernetes deployments. What are we working on today?',
      type: 'text'
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newUserMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');

    // Simulate AI thinking and response
    setTimeout(() => {
      const isCodeContent = input.toLowerCase().includes('pipeline') || input.toLowerCase().includes('yaml');
      
      const newAiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        sender: 'ai', 
        text: isCodeContent ? 
`Here is a starting point for your requested configuration:
\`\`\`yaml
name: CI/CD Pipeline
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: 'your-image:latest'
        format: 'table'
        exit-code: '1'
        ignore-unfixed: true
        vuln-type: 'os,library'
        severity: 'CRITICAL,HIGH'
\`\`\``
        : `I can certainly help with that. To provide the best guidance on "${input}", could you specify your target environment (e.g., AWS, Azure, On-Prem)?`,
        type: isCodeContent ? 'code' : 'text'
      };
      setMessages(prev => [...prev, newAiMsg]);
    }, 1500);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Helper to safely render text that might contain code blocks
  const renderMessageContent = (text: string) => {
    if (!text.includes('```')) return <p>{text}</p>;
    
    const parts = text.split('```');
    return parts.map((part, index) => {
      if (index % 2 === 0) return <p key={index}>{part}</p>;
      
      // Extract language if present
      const lines = part.split('\n');
      const lang = lines[0].trim();
      const code = lines.slice(1).join('\n');
      
      return (
        <div key={index} className="code-block">
          <div className="code-header">
            <span>{lang || 'code'}</span>
            <button className="copy-btn"><Code size={14} /> Copy</button>
          </div>
          <pre><code>{code}</code></pre>
        </div>
      );
    });
  };

  return (
    <div className="ai-container">
      <div className="ai-header">
        <h1>Agentic AI DevOps Assistant</h1>
        <p>Your interactive teammate for infrastructure, security, and deployments.</p>
      </div>

      <div className="ai-layout">
        <div className="chat-interface glass-panel">
          <div className="messages-area">
            {messages.map(msg => (
              <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                <div className="message-avatar">
                  {msg.sender === 'ai' ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div className="message-content">
                  {renderMessageContent(msg.text)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="input-area">
            <div className="input-box">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me to review an IAM policy, write a GitHub action, or debug a pod..."
                rows={1}
              />
              <button 
                className="send-btn" 
                onClick={handleSend}
                disabled={!input.trim()}
              >
                <Send size={18} />
              </button>
            </div>
            <div className="input-hint">
              Press <kbd>Enter</kbd> to send, <kbd>Shift</kbd> + <kbd>Enter</kbd> for new line
            </div>
          </div>
        </div>

        <div className="ai-sidebar">
          <div className="capabilities-card glass-panel">
            <h3><Zap size={18} className="text-warning"/> Core Capabilities</h3>
            <ul className="capability-list">
              <li><strong>Infrastructure as Code:</strong> Terraform, Pulumi, CloudFormation generation & review.</li>
              <li><strong>CI/CD Pipelines:</strong> GitHub Actions, GitLab CI, Jenkins configuration.</li>
              <li><strong>Security Audits:</strong> Trivy, SonarQube, checkov policy analysis.</li>
              <li><strong>Kubernetes Ops:</strong> Manifest generation, Helm chart debugging.</li>
            </ul>
          </div>

          <div className="prompts-card glass-panel">
            <h3><Command size={18} className="text-info"/> Suggested Prompts</h3>
            <div className="prompt-chips">
              <button className="chip" onClick={() => setInput("Write a secure Terraform module for an AWS S3 bucket with versioning and encryption.")}>Secure AWS S3 Terraform</button>
              <button className="chip" onClick={() => setInput("Create a GitHub Actions CI pipeline that scans a Docker image with Trivy.")}>Trivy CI Pipeline</button>
              <button className="chip" onClick={() => setInput("Analyze a sample Kubernetes NetworkPolicy for least privilege.")}>K8s NetworkPolicy Review</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;

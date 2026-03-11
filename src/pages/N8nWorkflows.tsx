import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Workflow, GitBranch, ShieldCheck, Bell, Bug, Server,
  Container, Database, ChevronRight, Copy, CheckCircle,
  BookOpen, Play, Zap, AlertTriangle, ArrowRight
} from 'lucide-react';
import '../styles/N8nWorkflows.css';

interface N8nWorkflow {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  triggerNode: string;
  nodes: WorkflowNode[];
  useCases: string[];
  jsonSnippet: string;
}

interface WorkflowNode {
  name: string;
  type: string;
  description: string;
}

const workflows: N8nWorkflow[] = [
  {
    id: 'ci-notify',
    title: 'CI/CD Pipeline Notification Hub',
    icon: Bell,
    color: '#ff6d5a',
    category: 'CI/CD',
    difficulty: 'Beginner',
    description: 'Automatically notify teams on Slack, Teams, or email when CI/CD pipelines succeed, fail, or need manual approval.',
    triggerNode: 'Webhook (GitHub/GitLab CI)',
    nodes: [
      { name: 'Webhook Trigger', type: 'Webhook', description: 'Receives pipeline status payload from GitHub Actions or GitLab CI webhook' },
      { name: 'IF Node', type: 'IF', description: 'Branch logic: check if pipeline status is "success", "failure", or "pending_approval"' },
      { name: 'Slack (Success)', type: 'Slack', description: 'Send a success notification to #deployments channel with commit details' },
      { name: 'Slack (Failure)', type: 'Slack', description: 'Send a failure alert to #incidents channel with error logs link' },
      { name: 'Email (Approval)', type: 'Email Send', description: 'Send approval request email to release manager with approve/reject links' },
    ],
    useCases: [
      'Get instant Slack alerts when a deployment to production completes or fails',
      'Send an email to the release manager for manual approval gates',
      'Post a summary of build metrics (duration, test results) to a Teams channel',
    ],
    jsonSnippet: `{
  "nodes": [
    { "name": "Webhook", "type": "n8n-nodes-base.webhook", "parameters": { "path": "ci-pipeline", "httpMethod": "POST" } },
    { "name": "Check Status", "type": "n8n-nodes-base.if", "parameters": { "conditions": { "string": [{ "value1": "={{$json.status}}", "value2": "success" }] } } },
    { "name": "Slack Success", "type": "n8n-nodes-base.slack", "parameters": { "channel": "#deployments", "text": "✅ Pipeline passed for {{$json.repo}} ({{$json.branch}})" } },
    { "name": "Slack Failure", "type": "n8n-nodes-base.slack", "parameters": { "channel": "#incidents", "text": "❌ Pipeline FAILED for {{$json.repo}} — {{$json.error_message}}" } }
  ]
}`
  },
  {
    id: 'vuln-scan',
    title: 'Automated Vulnerability Scan & Ticketing',
    icon: Bug,
    color: '#00bcd4',
    category: 'Security',
    difficulty: 'Intermediate',
    description: 'Trigger Trivy/Snyk scans on new container images, parse results, and automatically create Jira tickets for critical vulnerabilities.',
    triggerNode: 'Webhook (Docker Registry / ECR)',
    nodes: [
      { name: 'Webhook Trigger', type: 'Webhook', description: 'Triggered when a new image is pushed to the container registry' },
      { name: 'HTTP Request (Trivy)', type: 'HTTP Request', description: 'Call Trivy API to scan the pushed image for CVEs' },
      { name: 'Filter Critical', type: 'IF', description: 'Filter results to only HIGH and CRITICAL severity vulnerabilities' },
      { name: 'Jira Create Issue', type: 'Jira', description: 'Auto-create a Jira ticket with CVE details, affected packages, and remediation steps' },
      { name: 'Slack Alert', type: 'Slack', description: 'Alert the security team in #security-alerts with a summary of critical findings' },
    ],
    useCases: [
      'Auto-scan every container image pushed to ECR/GCR/ACR for CVEs',
      'Create Jira tickets for critical vulnerabilities with remediation steps',
      'Block deployments by updating a deployment gate status via API',
    ],
    jsonSnippet: `{
  "nodes": [
    { "name": "Registry Webhook", "type": "n8n-nodes-base.webhook", "parameters": { "path": "image-scan", "httpMethod": "POST" } },
    { "name": "Trivy Scan", "type": "n8n-nodes-base.httpRequest", "parameters": { "url": "http://trivy-server:8080/scan", "method": "POST", "body": { "image": "={{$json.image_name}}:{{$json.tag}}" } } },
    { "name": "Filter Critical CVEs", "type": "n8n-nodes-base.if", "parameters": { "conditions": { "number": [{ "value1": "={{$json.critical_count}}", "operation": "larger", "value2": 0 }] } } },
    { "name": "Create Jira Ticket", "type": "n8n-nodes-base.jira", "parameters": { "project": "SEC", "issueType": "Bug", "summary": "Critical CVE in {{$json.image}}" } }
  ]
}`
  },
  {
    id: 'incident-response',
    title: 'Automated Incident Response Pipeline',
    icon: AlertTriangle,
    color: '#f44336',
    category: 'Security',
    difficulty: 'Advanced',
    description: 'When Falco or CloudWatch detects an anomaly, automatically isolate the resource, capture forensic data, and trigger the incident response playbook.',
    triggerNode: 'Webhook (Falco / CloudWatch / PagerDuty)',
    nodes: [
      { name: 'Falco Alert Webhook', type: 'Webhook', description: 'Receives real-time security alerts from Falco (e.g., shell in container)' },
      { name: 'Classify Severity', type: 'Switch', description: 'Route based on Falco rule priority: Critical, Warning, Notice' },
      { name: 'Isolate Pod (K8s)', type: 'HTTP Request', description: 'Call Kubernetes API to apply a deny-all NetworkPolicy to the affected pod' },
      { name: 'Capture Forensics', type: 'HTTP Request', description: 'Trigger a job to capture container logs, process list, and network connections' },
      { name: 'PagerDuty Incident', type: 'PagerDuty', description: 'Create a PagerDuty incident and page the on-call security engineer' },
      { name: 'Slack War Room', type: 'Slack', description: 'Create a dedicated Slack channel for the incident with all context attached' },
    ],
    useCases: [
      'Auto-isolate compromised containers within seconds of detection',
      'Capture forensic evidence before an attacker can cover their tracks',
      'Page the on-call engineer and create a dedicated Slack war room',
    ],
    jsonSnippet: `{
  "nodes": [
    { "name": "Falco Webhook", "type": "n8n-nodes-base.webhook", "parameters": { "path": "falco-alerts", "httpMethod": "POST" } },
    { "name": "Severity Router", "type": "n8n-nodes-base.switch", "parameters": { "rules": [{ "value": "={{$json.priority}}", "output": 0 }] } },
    { "name": "Isolate Pod", "type": "n8n-nodes-base.httpRequest", "parameters": { "url": "https://k8s-api/api/v1/namespaces/{{$json.namespace}}/networkpolicies", "method": "POST" } },
    { "name": "Page On-Call", "type": "n8n-nodes-base.pagerDuty", "parameters": { "severity": "critical", "summary": "Security incident: {{$json.rule}}" } }
  ]
}`
  },
  {
    id: 'gitops-sync',
    title: 'GitOps Config Drift Detector',
    icon: GitBranch,
    color: '#7c4dff',
    category: 'GitOps',
    difficulty: 'Intermediate',
    description: 'Periodically compare live Kubernetes cluster state against the Git repository and alert on configuration drift.',
    triggerNode: 'Cron (every 30 minutes)',
    nodes: [
      { name: 'Cron Trigger', type: 'Cron', description: 'Runs every 30 minutes to check for drift' },
      { name: 'Fetch Git Manifests', type: 'HTTP Request', description: 'Pull the latest manifests from the GitOps repository via GitHub API' },
      { name: 'Fetch Live State', type: 'HTTP Request', description: 'Query the Kubernetes API for the current state of deployments' },
      { name: 'Compare (Code Node)', type: 'Code', description: 'JavaScript node that diffs Git vs live state and identifies drifted resources' },
      { name: 'IF Drift Detected', type: 'IF', description: 'Branch: if drift count > 0, alert; otherwise, log success' },
      { name: 'Slack Alert', type: 'Slack', description: 'Post drift details to #gitops-alerts with resource names and differences' },
    ],
    useCases: [
      'Detect when someone kubectl apply\'d changes directly without going through Git',
      'Alert when ArgoCD out-of-sync issues persist for more than 1 hour',
      'Generate a weekly drift report for the platform engineering team',
    ],
    jsonSnippet: `{
  "nodes": [
    { "name": "Schedule", "type": "n8n-nodes-base.cron", "parameters": { "triggerTimes": { "item": [{ "mode": "everyX", "value": 30, "unit": "minutes" }] } } },
    { "name": "Git Manifests", "type": "n8n-nodes-base.httpRequest", "parameters": { "url": "https://api.github.com/repos/org/k8s-manifests/contents/", "authentication": "genericCredentialType" } },
    { "name": "Live K8s State", "type": "n8n-nodes-base.httpRequest", "parameters": { "url": "https://k8s-api/apis/apps/v1/namespaces/prod/deployments" } },
    { "name": "Diff Engine", "type": "n8n-nodes-base.code", "parameters": { "jsCode": "// Compare Git manifests vs live state\\nconst drifted = []; // ... diff logic\\nreturn [{ json: { drifted, count: drifted.length } }];" } }
  ]
}`
  },
  {
    id: 'infra-provisioning',
    title: 'Self-Service Infrastructure Provisioning',
    icon: Server,
    color: '#ff9800',
    category: 'IaC',
    difficulty: 'Advanced',
    description: 'Let developers request cloud resources through a form/Slack command. The workflow triggers Terraform via API and provisions the infrastructure automatically.',
    triggerNode: 'Webhook (Slack Slash Command / Form)',
    nodes: [
      { name: 'Slack Command Trigger', type: 'Webhook', description: 'Developer runs /provision-env staging in Slack' },
      { name: 'Validate Request', type: 'Code', description: 'Validate the environment name, check user permissions, enforce naming conventions' },
      { name: 'Trigger Terraform Cloud', type: 'HTTP Request', description: 'Call Terraform Cloud API to start a plan/apply for the requested workspace' },
      { name: 'Wait for Completion', type: 'HTTP Request', description: 'Poll Terraform Cloud run status until plan completes' },
      { name: 'Slack Response', type: 'Slack', description: 'Reply in Slack with the provisioned resource details (URLs, IPs, credentials vault link)' },
      { name: 'Log to Database', type: 'Postgres', description: 'Record the provisioning event with user, timestamp, cost estimate, and resource IDs' },
    ],
    useCases: [
      'Developers self-serve staging environments via a Slack slash command',
      'Enforce organizational policies before provisioning (naming, region, budget)',
      'Auto-teardown environments after a TTL expires',
    ],
    jsonSnippet: `{
  "nodes": [
    { "name": "Slash Command", "type": "n8n-nodes-base.webhook", "parameters": { "path": "provision", "httpMethod": "POST" } },
    { "name": "Validate", "type": "n8n-nodes-base.code", "parameters": { "jsCode": "const env = $json.text; if (!['staging','dev','qa'].includes(env)) throw new Error('Invalid env');" } },
    { "name": "Terraform Apply", "type": "n8n-nodes-base.httpRequest", "parameters": { "url": "https://app.terraform.io/api/v2/runs", "method": "POST", "body": { "data": { "attributes": { "auto-apply": true } } } } },
    { "name": "Notify Slack", "type": "n8n-nodes-base.slack", "parameters": { "channel": "={{$json.channel_id}}", "text": "✅ Environment {{$json.text}} provisioned!" } }
  ]
}`
  },
  {
    id: 'container-lifecycle',
    title: 'Container Image Lifecycle Manager',
    icon: Container,
    color: '#2196f3',
    category: 'CI/CD',
    difficulty: 'Intermediate',
    description: 'Automate container image lifecycle: scan on push, tag for promotion, clean up old images, and maintain an image inventory.',
    triggerNode: 'Webhook (Registry Push Event)',
    nodes: [
      { name: 'Registry Webhook', type: 'Webhook', description: 'Triggered when a new image is pushed to any registry' },
      { name: 'Scan Image (Trivy)', type: 'HTTP Request', description: 'Submit the image for vulnerability scanning' },
      { name: 'Check Scan Results', type: 'IF', description: 'If no CRITICAL CVEs, proceed to promotion; otherwise, block and alert' },
      { name: 'Promote Tag', type: 'HTTP Request', description: 'Re-tag image from :latest to :prod-ready in the registry' },
      { name: 'Cleanup Old Tags', type: 'HTTP Request', description: 'Delete images older than 30 days that are not tagged as prod-ready' },
      { name: 'Update SBOM DB', type: 'Postgres', description: 'Store the image SBOM (Software Bill of Materials) in the inventory database' },
    ],
    useCases: [
      'Automatically promote images that pass security scans to "prod-ready"',
      'Clean up unused images to reduce registry storage costs',
      'Maintain a searchable database of all production image SBOMs for audits',
    ],
    jsonSnippet: `{
  "nodes": [
    { "name": "Push Event", "type": "n8n-nodes-base.webhook", "parameters": { "path": "registry-push" } },
    { "name": "Trivy Scan", "type": "n8n-nodes-base.httpRequest", "parameters": { "url": "http://trivy:8080/scan", "method": "POST" } },
    { "name": "Scan Gate", "type": "n8n-nodes-base.if", "parameters": { "conditions": { "number": [{ "value1": "={{$json.critical}}", "value2": 0 }] } } },
    { "name": "Tag Promote", "type": "n8n-nodes-base.httpRequest", "parameters": { "url": "https://registry/v2/{{$json.repo}}/manifests/prod-ready", "method": "PUT" } }
  ]
}`
  },
  {
    id: 'secret-rotation',
    title: 'Automated Secret Rotation Pipeline',
    icon: ShieldCheck,
    color: '#4caf50',
    category: 'Security',
    difficulty: 'Advanced',
    description: 'Automatically rotate database passwords, API keys, and TLS certificates on a schedule, update Vault, and restart dependent services.',
    triggerNode: 'Cron (Daily / Weekly)',
    nodes: [
      { name: 'Cron Trigger', type: 'Cron', description: 'Runs on a schedule (e.g., every 7 days for API keys, every 90 days for certs)' },
      { name: 'Generate New Secret', type: 'Code', description: 'Generate a cryptographically secure new password or API key' },
      { name: 'Update Cloud Provider', type: 'HTTP Request', description: 'Rotate the credential in the cloud provider (AWS RDS, Azure Key Vault, etc.)' },
      { name: 'Update Vault', type: 'HTTP Request', description: 'Store the new secret in HashiCorp Vault KV v2' },
      { name: 'Rolling Restart', type: 'HTTP Request', description: 'Trigger a rolling restart of dependent Kubernetes deployments via K8s API' },
      { name: 'Audit Log', type: 'Postgres', description: 'Log the rotation event with timestamp, affected services, and operator' },
      { name: 'Slack Confirmation', type: 'Slack', description: 'Notify the team that secrets were rotated successfully' },
    ],
    useCases: [
      'Rotate database passwords every 30 days without downtime',
      'Auto-renew TLS certificates 30 days before expiry',
      'Maintain a full audit trail of every secret rotation event',
    ],
    jsonSnippet: `{
  "nodes": [
    { "name": "Schedule", "type": "n8n-nodes-base.cron", "parameters": { "triggerTimes": { "item": [{ "mode": "everyX", "value": 7, "unit": "days" }] } } },
    { "name": "New Password", "type": "n8n-nodes-base.code", "parameters": { "jsCode": "const crypto = require('crypto'); return [{ json: { password: crypto.randomBytes(32).toString('hex') } }];" } },
    { "name": "Update Vault", "type": "n8n-nodes-base.httpRequest", "parameters": { "url": "https://vault.example.com/v1/secret/data/db-creds", "method": "POST" } },
    { "name": "Restart Pods", "type": "n8n-nodes-base.httpRequest", "parameters": { "url": "https://k8s-api/apis/apps/v1/namespaces/prod/deployments/myapp", "method": "PATCH" } }
  ]
}`
  },
  {
    id: 'compliance-report',
    title: 'Compliance & Audit Report Generator',
    icon: Database,
    color: '#9c27b0',
    category: 'Compliance',
    difficulty: 'Intermediate',
    description: 'Collect security scan results, infrastructure state, and access logs across all environments, then generate a weekly compliance report.',
    triggerNode: 'Cron (Weekly on Monday 9 AM)',
    nodes: [
      { name: 'Weekly Cron', type: 'Cron', description: 'Fires every Monday at 9 AM' },
      { name: 'Fetch Trivy Results', type: 'HTTP Request', description: 'Pull the latest vulnerability scan reports from Trivy' },
      { name: 'Fetch SonarQube Metrics', type: 'HTTP Request', description: 'Query SonarQube API for code quality metrics across all projects' },
      { name: 'Fetch IAM Audit Logs', type: 'HTTP Request', description: 'Pull IAM access logs from CloudTrail / Azure Activity Logs' },
      { name: 'Generate Report (Code)', type: 'Code', description: 'Aggregate all data into a structured compliance report (JSON/HTML)' },
      { name: 'Store in S3/Blob', type: 'HTTP Request', description: 'Upload the report to S3 or Azure Blob for archival' },
      { name: 'Email Report', type: 'Email Send', description: 'Send the PDF/HTML report to compliance@company.com and CTO' },
    ],
    useCases: [
      'Auto-generate weekly SOC 2 / ISO 27001 evidence reports',
      'Track vulnerability remediation SLAs across all teams',
      'Provide executives with a dashboard-ready security posture summary',
    ],
    jsonSnippet: `{
  "nodes": [
    { "name": "Monday 9AM", "type": "n8n-nodes-base.cron", "parameters": { "triggerTimes": { "item": [{ "mode": "weekly", "hour": 9, "weekday": 1 }] } } },
    { "name": "Trivy Data", "type": "n8n-nodes-base.httpRequest", "parameters": { "url": "http://trivy-server/api/reports/latest" } },
    { "name": "SonarQube Data", "type": "n8n-nodes-base.httpRequest", "parameters": { "url": "http://sonarqube:9000/api/measures/search" } },
    { "name": "Build Report", "type": "n8n-nodes-base.code", "parameters": { "jsCode": "// Aggregate and format report\\nreturn [{ json: { title: 'Weekly Security Report', ...data } }];" } }
  ]
}`
  },
];

const categories = ['All', 'CI/CD', 'Security', 'GitOps', 'IaC', 'Compliance'];

const N8nWorkflows = () => {
  const [filter, setFilter] = useState('All');
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [showJson, setShowJson] = useState<string | null>(null);

  const filteredWorkflows = filter === 'All' ? workflows : workflows.filter(w => w.category === filter);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="n8n-container">
      <div className="n8n-header">
        <h1>n8n DevSecOps Workflows</h1>
        <p>Automate your entire DevSecOps pipeline with no-code/low-code n8n workflows — from CI notifications to incident response.</p>
      </div>

      {/* Category Filters */}
      <div className="n8n-filters">
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Workflow Cards */}
      <div className="n8n-workflows-list">
        {filteredWorkflows.map(wf => (
          <motion.div
            key={wf.id}
            className={`n8n-workflow-card glass-panel ${expandedWorkflow === wf.id ? 'expanded' : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Card Header */}
            <button className="n8n-card-header" onClick={() => setExpandedWorkflow(expandedWorkflow === wf.id ? null : wf.id)}>
              <div className="n8n-card-icon" style={{ background: `${wf.color}22`, color: wf.color }}>
                <wf.icon size={24} />
              </div>
              <div className="n8n-card-info">
                <h3>{wf.title}</h3>
                <p>{wf.description}</p>
                <div className="n8n-card-meta">
                  <span className="n8n-category-tag" style={{ color: wf.color, borderColor: `${wf.color}44` }}>{wf.category}</span>
                  <span className={`diff-badge ${wf.difficulty.toLowerCase()}`}>{wf.difficulty}</span>
                  <span className="n8n-trigger-tag"><Zap size={12} /> {wf.triggerNode}</span>
                </div>
              </div>
              <ChevronRight className={`chevron ${expandedWorkflow === wf.id ? 'rotated' : ''}`} size={22} />
            </button>

            {/* Expanded Content */}
            {expandedWorkflow === wf.id && (
              <motion.div
                className="n8n-card-body"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                {/* Workflow Node Chain */}
                <div className="n8n-nodes-section">
                  <h4><Workflow size={16} /> Workflow Nodes</h4>
                  <div className="n8n-node-chain">
                    {wf.nodes.map((node, i) => (
                      <div key={node.name} className="n8n-node-item">
                        <div className="n8n-node-badge">{i + 1}</div>
                        <div className="n8n-node-content">
                          <div className="n8n-node-header">
                            <strong>{node.name}</strong>
                            <span className="n8n-node-type">{node.type}</span>
                          </div>
                          <p>{node.description}</p>
                        </div>
                        {i < wf.nodes.length - 1 && <ArrowRight size={16} className="n8n-arrow" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Use Cases */}
                <div className="n8n-usecases-section">
                  <h4><BookOpen size={16} /> Use Cases</h4>
                  <ul>
                    {wf.useCases.map((uc, i) => <li key={i}>{uc}</li>)}
                  </ul>
                </div>

                {/* JSON Snippet Toggle */}
                <div className="n8n-json-section">
                  <button className="n8n-json-toggle" onClick={() => setShowJson(showJson === wf.id ? null : wf.id)}>
                    <Play size={14} /> {showJson === wf.id ? 'Hide' : 'Show'} n8n JSON Definition
                  </button>
                  {showJson === wf.id && (
                    <div className="n8n-json-block">
                      <div className="json-header">
                        <span>n8n Workflow JSON (importable)</span>
                        <button className="copy-icon" onClick={() => handleCopy(wf.jsonSnippet)}>
                          {copiedCmd === wf.jsonSnippet ? <CheckCircle size={14} className="copied" /> : <Copy size={14} />}
                        </button>
                      </div>
                      <pre><code>{wf.jsonSnippet}</code></pre>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default N8nWorkflows;

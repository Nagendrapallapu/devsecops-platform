import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Bug, FileSearch, Eye, KeyRound, Lock,
  ChevronRight, BookOpen, Play, Copy, CheckCircle, AlertTriangle
} from 'lucide-react';
import '../styles/SecurityTools.css';

interface SecurityModule {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  category: string;
  description: string;
  levels: SecurityLevel[];
}

interface SecurityLevel {
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  topics: SecurityTopic[];
}

interface SecurityTopic {
  title: string;
  description: string;
  commands: { command: string; explanation: string }[];
  bestPractices?: string[];
  risks?: string[];
}

const securityModules: SecurityModule[] = [
  {
    id: 'trivy',
    name: 'Trivy',
    icon: Bug,
    color: '#00bcd4',
    category: 'Vulnerability Scanning',
    description: 'A comprehensive open-source vulnerability scanner for containers, filesystems, and Git repositories.',
    levels: [
      {
        title: 'Image & Filesystem Scanning',
        difficulty: 'Beginner',
        topics: [
          {
            title: 'Scanning Container Images',
            description: 'Detect OS and library vulnerabilities in your container images before deployment.',
            commands: [
              { command: 'trivy image nginx:latest', explanation: 'Scan the latest Nginx image for known vulnerabilities (CVEs)' },
              { command: 'trivy image --severity HIGH,CRITICAL myapp:1.0', explanation: 'Only show HIGH and CRITICAL severity vulnerabilities' },
              { command: 'trivy image --format json -o results.json myapp:1.0', explanation: 'Output scan results as JSON for CI/CD integration' },
              { command: 'trivy image --ignore-unfixed myapp:1.0', explanation: 'Ignore vulnerabilities that do not yet have a fix available' },
            ],
            bestPractices: [
              'Integrate Trivy into your CI/CD pipeline to block deployments with critical CVEs',
              'Use --exit-code 1 so the pipeline fails on HIGH/CRITICAL findings',
              'Scan base images regularly, not just during builds',
              'Use .trivyignore to suppress accepted/false-positive CVEs',
            ]
          },
        ]
      },
      {
        title: 'IaC & SBOM Scanning',
        difficulty: 'Intermediate',
        topics: [
          {
            title: 'Scanning Infrastructure as Code',
            description: 'Find misconfigurations in Terraform, Kubernetes manifests, Dockerfiles, and more.',
            commands: [
              { command: 'trivy config .', explanation: 'Scan the current directory for IaC misconfigurations' },
              { command: 'trivy config --severity HIGH ./terraform/', explanation: 'Scan Terraform files for HIGH severity misconfigurations' },
              { command: 'trivy fs --scanners vuln,secret .', explanation: 'Scan the filesystem for vulnerabilities and exposed secrets' },
              { command: 'trivy sbom myapp:1.0', explanation: 'Generate a Software Bill of Materials (SBOM) for an image' },
            ],
            bestPractices: [
              'Scan IaC configs in PRs to catch misconfigurations before they reach production',
              'Use trivy fs to detect accidentally committed secrets (API keys, passwords)',
              'Generate SBOMs for compliance and audit requirements (SPDX, CycloneDX)',
            ]
          },
        ]
      },
    ]
  },
  {
    id: 'sonarqube',
    name: 'SonarQube',
    icon: FileSearch,
    color: '#4e9bcd',
    category: 'SAST / Code Quality',
    description: 'Static Application Security Testing (SAST) platform for continuous code quality and security analysis.',
    levels: [
      {
        title: 'Code Quality Analysis',
        difficulty: 'Beginner',
        topics: [
          {
            title: 'Running Your First Scan',
            description: 'Analyze code for bugs, vulnerabilities, code smells, and security hotspots.',
            commands: [
              { command: 'docker run -d --name sonarqube -p 9000:9000 sonarqube:lts-community', explanation: 'Run SonarQube server locally using Docker' },
              { command: 'mvn sonar:sonar -Dsonar.host.url=http://localhost:9000 -Dsonar.token=<token>', explanation: 'Analyze a Maven project with the SonarScanner' },
              { command: 'sonar-scanner -Dsonar.projectKey=myapp -Dsonar.sources=./src', explanation: 'Run SonarScanner CLI for non-Maven projects' },
            ],
            bestPractices: [
              'Enforce a Quality Gate that blocks merges if coverage drops or new bugs appear',
              'Review Security Hotspots — these are areas that need manual security review',
              'Integrate SonarQube analysis into your CI pipeline for every PR',
              'Focus on fixing critical and blocker issues first',
            ]
          },
        ]
      },
      {
        title: 'Quality Gates & CI Integration',
        difficulty: 'Intermediate',
        topics: [
          {
            title: 'Configuring Quality Gates',
            description: 'Set automated pass/fail criteria for your projects.',
            commands: [
              { command: 'curl -u admin:token "http://localhost:9000/api/qualitygates/list"', explanation: 'List all configured Quality Gates via API' },
              { command: 'curl -u admin:token "http://localhost:9000/api/measures/component?component=myapp&metricKeys=bugs,vulnerabilities,code_smells"', explanation: 'Query project metrics via the SonarQube REST API' },
            ],
            bestPractices: [
              'Set conditions: 0 new bugs, 0 new vulnerabilities, >80% coverage on new code',
              'Use branch analysis to check quality of feature branches before merge',
              'Create custom Quality Profiles for different language standards',
            ]
          },
        ]
      },
    ]
  },
  {
    id: 'opa',
    name: 'OPA / Gatekeeper',
    icon: ShieldCheck,
    color: '#566eb2',
    category: 'Policy as Code',
    description: 'Open Policy Agent (OPA) — a unified framework to enforce policies across your stack (K8s, Terraform, APIs).',
    levels: [
      {
        title: 'Rego Policy Basics',
        difficulty: 'Beginner',
        topics: [
          {
            title: 'Writing & Testing Rego Policies',
            description: 'Learn the Rego policy language to define rules for your infrastructure.',
            commands: [
              { command: 'opa eval -i input.json -d policy.rego "data.example.allow"', explanation: 'Evaluate a Rego policy against a given input' },
              { command: 'opa test ./policies/ -v', explanation: 'Run unit tests for your Rego policy files' },
              { command: 'opa run --server ./policies/', explanation: 'Start the OPA server to serve policies via REST API' },
              { command: 'conftest test deployment.yaml -p policy/', explanation: 'Use Conftest to test Kubernetes manifests against OPA policies' },
            ],
            bestPractices: [
              'Always write unit tests for your Rego policies',
              'Use Conftest in CI to validate Terraform plans, K8s manifests, and Dockerfiles',
              'Start with deny-by-default, then create explicit allow rules',
            ]
          },
        ]
      },
      {
        title: 'Kubernetes Gatekeeper',
        difficulty: 'Advanced',
        topics: [
          {
            title: 'Enforcing Policies on K8s Clusters',
            description: 'Use OPA Gatekeeper to enforce admission control policies in Kubernetes.',
            commands: [
              { command: 'kubectl apply -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper/release-3.14/deploy/gatekeeper.yaml', explanation: 'Install Gatekeeper on a Kubernetes cluster' },
              { command: 'kubectl get constrainttemplates', explanation: 'List all Gatekeeper constraint templates' },
              { command: 'kubectl get constraints', explanation: 'List all active constraints being enforced' },
            ],
            bestPractices: [
              'Enforce: no containers can run as root (runAsNonRoot)',
              'Enforce: all images must come from trusted registries only',
              'Enforce: all pods must have resource limits set',
              'Use "dryrun" enforcement action to audit before blocking',
            ],
            risks: [
              'A misconfigured Gatekeeper policy can block all deployments cluster-wide',
              'Always test constraints in "dryrun" mode before setting to "deny"',
            ]
          },
        ]
      },
    ]
  },
  {
    id: 'falco',
    name: 'Falco',
    icon: Eye,
    color: '#00b4ab',
    category: 'Runtime Security',
    description: 'Cloud-native runtime security that detects anomalous behavior in containers and hosts using kernel-level system calls.',
    levels: [
      {
        title: 'Threat Detection Basics',
        difficulty: 'Intermediate',
        topics: [
          {
            title: 'Monitoring Runtime Behavior',
            description: 'Detect shell spawning in containers, unexpected network connections, and file tampering in real-time.',
            commands: [
              { command: 'helm install falco falcosecurity/falco --namespace falco --create-namespace', explanation: 'Install Falco on Kubernetes using Helm' },
              { command: 'kubectl logs -l app.kubernetes.io/name=falco -n falco -f', explanation: 'Stream real-time Falco alerts from the cluster' },
              { command: 'falco -r /etc/falco/falco_rules.yaml', explanation: 'Run Falco on a host with the default ruleset' },
            ],
            bestPractices: [
              'Alert on: shell spawned in a container, sensitive file read (/etc/shadow)',
              'Alert on: unexpected outbound network connections from a database pod',
              'Forward Falco alerts to Slack, PagerDuty, or a SIEM for incident response',
              'Write custom rules specific to your application behavior',
            ],
            risks: [
              'Spawning a shell inside a production container (e.g., kubectl exec)',
              'A container reading sensitive host files via mounted volumes',
              'Unexpected binary execution inside a container (crypto miners)',
            ]
          },
        ]
      },
    ]
  },
  {
    id: 'vault',
    name: 'HashiCorp Vault',
    icon: KeyRound,
    color: '#ffcb2f',
    category: 'Secrets Management',
    description: 'Centrally store, access, and distribute secrets (API keys, passwords, certificates) with audit logging and encryption.',
    levels: [
      {
        title: 'Vault Fundamentals',
        difficulty: 'Beginner',
        topics: [
          {
            title: 'Storing & Retrieving Secrets',
            description: 'Use the KV secrets engine to store and retrieve application secrets.',
            commands: [
              { command: 'vault server -dev', explanation: 'Start a Vault development server (for local testing only)' },
              { command: 'export VAULT_ADDR="http://127.0.0.1:8200"', explanation: 'Set the Vault address environment variable' },
              { command: 'vault kv put secret/myapp db_password=s3cret', explanation: 'Store a secret in the KV v2 secrets engine' },
              { command: 'vault kv get secret/myapp', explanation: 'Retrieve a secret from Vault' },
              { command: 'vault kv get -field=db_password secret/myapp', explanation: 'Retrieve a specific field from a secret' },
            ],
            bestPractices: [
              'Never use the dev server in production',
              'Use AppRole or Kubernetes auth for machine-to-machine authentication',
              'Enable audit logging to track all secret access',
              'Rotate secrets regularly using Vault dynamic secrets',
            ]
          },
        ]
      },
      {
        title: 'Dynamic Secrets & PKI',
        difficulty: 'Advanced',
        topics: [
          {
            title: 'Dynamic Database Credentials & TLS Certificates',
            description: 'Generate short-lived, unique credentials for every application instance.',
            commands: [
              { command: 'vault secrets enable database', explanation: 'Enable the database secrets engine' },
              { command: 'vault read database/creds/my-role', explanation: 'Generate a new, dynamic database credential' },
              { command: 'vault secrets enable pki', explanation: 'Enable the PKI secrets engine for TLS certificates' },
              { command: 'vault write pki/issue/my-role common_name="app.example.com"', explanation: 'Issue a new TLS certificate' },
            ],
            bestPractices: [
              'Use dynamic secrets so each app instance gets unique, short-lived credentials',
              'If a credential is compromised, only that one instance is affected (blast radius reduction)',
              'Automate TLS certificate rotation using the PKI engine and cert-manager',
              'Set aggressive TTLs (e.g., 1 hour) for database credentials',
            ]
          },
        ]
      },
    ]
  },
  {
    id: 'devsecops-pipeline',
    name: 'Secure CI/CD Pipeline',
    icon: Lock,
    color: '#a855f7',
    category: 'End-to-End Security',
    description: 'Design a complete DevSecOps pipeline integrating security at every stage — from code commit to production.',
    levels: [
      {
        title: 'Pipeline Security Stages',
        difficulty: 'Intermediate',
        topics: [
          {
            title: 'Shift-Left Security Model',
            description: 'Integrate security tools at each stage of the CI/CD pipeline.',
            commands: [
              { command: '# Stage 1: Pre-Commit\ngitleaks detect --source .', explanation: 'Scan repository for hardcoded secrets before commit' },
              { command: '# Stage 2: Build\nsonar-scanner && trivy fs .', explanation: 'Run SAST and filesystem vulnerability scan during build' },
              { command: '# Stage 3: Container\ntrivy image --exit-code 1 myapp:latest', explanation: 'Scan the container image; fail if critical vulnerabilities exist' },
              { command: '# Stage 4: Deploy\nconftest test k8s-manifests/ -p policies/', explanation: 'Validate Kubernetes manifests against OPA policies before deploy' },
              { command: '# Stage 5: Runtime\nfalco -r custom_rules.yaml', explanation: 'Monitor running containers for anomalous behavior in production' },
            ],
            bestPractices: [
              'Gate each stage: pipeline should fail if any security check fails',
              'Use DAST tools (OWASP ZAP) to scan running applications post-deployment',
              'Implement software composition analysis (SCA) for dependency vulnerabilities',
              'Sign your artifacts and container images (Sigstore/Cosign)',
              'Maintain an SBOM for every production artifact',
            ]
          },
        ]
      },
    ]
  },
];

const SecurityTools = () => {
  const [selectedTool, setSelectedTool] = useState<string>('trivy');
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const currentTool = securityModules.find(t => t.id === selectedTool)!;

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const toggleTopic = (topicTitle: string) => {
    setExpandedTopic(expandedTopic === topicTitle ? null : topicTitle);
  };

  return (
    <div className="security-container">
      <div className="security-header">
        <h1>Security Tools Lab</h1>
        <p>Hands-on practice with the tools that keep your infrastructure, containers, and code secure.</p>
      </div>

      <div className="security-layout">
        <div className="sec-tool-selector">
          {securityModules.map(tool => (
            <motion.button
              key={tool.id}
              className={`sec-tool-tab glass-panel ${selectedTool === tool.id ? 'active' : ''}`}
              onClick={() => { setSelectedTool(tool.id); setExpandedTopic(null); }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ '--tool-color': tool.color } as React.CSSProperties}
            >
              <tool.icon size={20} style={{ color: tool.color }} />
              <div className="sec-tab-text">
                <span className="sec-tab-name">{tool.name}</span>
                <span className="sec-tab-cat">{tool.category}</span>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="sec-tool-content">
          <motion.div
            key={selectedTool}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="sec-tool-intro glass-panel">
              <currentTool.icon size={36} style={{ color: currentTool.color }} />
              <div>
                <h2>{currentTool.name}</h2>
                <span className="sec-category-label" style={{ color: currentTool.color }}>{currentTool.category}</span>
                <p>{currentTool.description}</p>
              </div>
            </div>

            {currentTool.levels.map(level => (
              <div key={level.title} className="sec-level-section">
                <div className="level-header">
                  <h3>{level.title}</h3>
                  <span className={`diff-badge ${level.difficulty.toLowerCase()}`}>{level.difficulty}</span>
                </div>

                <div className="sec-topics-list">
                  {level.topics.map(topic => (
                    <div key={topic.title} className={`sec-topic-card glass-panel ${expandedTopic === topic.title ? 'expanded' : ''}`}>
                      <button className="topic-header-btn" onClick={() => toggleTopic(topic.title)}>
                        <div>
                          <h4>{topic.title}</h4>
                          <p>{topic.description}</p>
                        </div>
                        <ChevronRight className={`chevron ${expandedTopic === topic.title ? 'rotated' : ''}`} size={20} />
                      </button>

                      {expandedTopic === topic.title && (
                        <motion.div
                          className="topic-body"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="commands-section">
                            <h5><Play size={16} /> Commands & Usage</h5>
                            <div className="command-list">
                              {topic.commands.map(cmd => (
                                <div key={cmd.command} className="command-item">
                                  <div className="command-line">
                                    <code>{cmd.command}</code>
                                    <button className="copy-icon" onClick={() => handleCopy(cmd.command)}>
                                      {copiedCmd === cmd.command ? <CheckCircle size={14} className="copied" /> : <Copy size={14} />}
                                    </button>
                                  </div>
                                  <span className="cmd-explanation">{cmd.explanation}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {topic.risks && topic.risks.length > 0 && (
                            <div className="risks-section">
                              <h5><AlertTriangle size={16} /> Key Threats & Risks</h5>
                              <ul>
                                {topic.risks.map((r, i) => <li key={i}>{r}</li>)}
                              </ul>
                            </div>
                          )}

                          {topic.bestPractices && (
                            <div className="best-practices-section">
                              <h5><BookOpen size={16} /> Best Practices</h5>
                              <ul>
                                {topic.bestPractices.map((bp, i) => <li key={i}>{bp}</li>)}
                              </ul>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTools;

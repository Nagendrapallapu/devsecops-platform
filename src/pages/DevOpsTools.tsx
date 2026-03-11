import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GitBranch, Container, Ship, Settings, CloudCog, Terminal,
  ChevronRight, BookOpen, Play, Copy, ExternalLink, CheckCircle
} from 'lucide-react';
import '../styles/DevOpsTools.css';

interface ToolModule {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  description: string;
  levels: Level[];
}

interface Level {
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  topics: Topic[];
}

interface Topic {
  title: string;
  description: string;
  commands: CommandExample[];
  bestPractices?: string[];
}

interface CommandExample {
  command: string;
  explanation: string;
}

const toolModules: ToolModule[] = [
  {
    id: 'git',
    name: 'Git & Version Control',
    icon: GitBranch,
    color: '#f14e32',
    description: 'Master distributed version control from basics to advanced workflows.',
    levels: [
      {
        title: 'Fundamentals',
        difficulty: 'Beginner',
        topics: [
          {
            title: 'Repository Setup & Configuration',
            description: 'Initialize repositories and configure your Git environment.',
            commands: [
              { command: 'git init', explanation: 'Initialize a new Git repository in the current directory' },
              { command: 'git clone <url>', explanation: 'Clone an existing remote repository to your local machine' },
              { command: 'git config --global user.name "Your Name"', explanation: 'Set your global Git username' },
              { command: 'git config --global user.email "you@example.com"', explanation: 'Set your global Git email' },
            ]
          },
          {
            title: 'Staging & Committing',
            description: 'Track changes, stage files, and create commits.',
            commands: [
              { command: 'git status', explanation: 'Show the working tree status (modified, staged, untracked files)' },
              { command: 'git add <file>', explanation: 'Stage a specific file for the next commit' },
              { command: 'git add .', explanation: 'Stage all changed files in the current directory' },
              { command: 'git commit -m "message"', explanation: 'Create a commit with a descriptive message' },
              { command: 'git diff', explanation: 'Show unstaged changes between working directory and index' },
            ]
          },
        ]
      },
      {
        title: 'Branching & Merging',
        difficulty: 'Intermediate',
        topics: [
          {
            title: 'Branch Management',
            description: 'Create, switch, and manage branches for parallel development.',
            commands: [
              { command: 'git branch', explanation: 'List all local branches' },
              { command: 'git branch <name>', explanation: 'Create a new branch' },
              { command: 'git checkout -b <name>', explanation: 'Create and switch to a new branch in one command' },
              { command: 'git merge <branch>', explanation: 'Merge specified branch into the current branch' },
              { command: 'git branch -d <name>', explanation: 'Delete a branch that has been fully merged' },
            ],
            bestPractices: [
              'Use descriptive branch names: feature/add-user-auth, bugfix/login-crash',
              'Keep branches short-lived to reduce merge conflicts',
              'Always pull the latest main/develop before creating a new branch',
            ]
          },
          {
            title: 'Rebasing & Cherry-Picking',
            description: 'Rewrite commit history and selectively apply commits.',
            commands: [
              { command: 'git rebase main', explanation: 'Reapply your branch commits on top of the latest main branch' },
              { command: 'git rebase -i HEAD~3', explanation: 'Interactively rebase the last 3 commits (squash, reword, reorder)' },
              { command: 'git cherry-pick <commit-hash>', explanation: 'Apply a specific commit from another branch' },
            ]
          },
        ]
      },
      {
        title: 'Advanced Git',
        difficulty: 'Advanced',
        topics: [
          {
            title: 'Git Hooks & Automation',
            description: 'Automate workflows with client-side and server-side hooks.',
            commands: [
              { command: 'ls .git/hooks/', explanation: 'List available Git hook scripts' },
              { command: 'chmod +x .git/hooks/pre-commit', explanation: 'Make the pre-commit hook executable' },
            ],
            bestPractices: [
              'Use pre-commit hooks with tools like Husky for linting and formatting',
              'Use commit-msg hooks to enforce conventional commit messages',
              'Server-side hooks (pre-receive) can enforce branch protection policies',
            ]
          },
        ]
      },
    ]
  },
  {
    id: 'docker',
    name: 'Docker & Containers',
    icon: Container,
    color: '#2496ed',
    description: 'Build, ship, and run applications in portable containers.',
    levels: [
      {
        title: 'Container Basics',
        difficulty: 'Beginner',
        topics: [
          {
            title: 'Working with Images & Containers',
            description: 'Pull images, run containers, and manage their lifecycle.',
            commands: [
              { command: 'docker pull nginx:latest', explanation: 'Download the latest Nginx image from Docker Hub' },
              { command: 'docker run -d -p 80:80 --name web nginx', explanation: 'Run Nginx container in the background, mapping port 80' },
              { command: 'docker ps', explanation: 'List all running containers' },
              { command: 'docker ps -a', explanation: 'List all containers including stopped ones' },
              { command: 'docker stop web', explanation: 'Gracefully stop a running container' },
              { command: 'docker rm web', explanation: 'Remove a stopped container' },
              { command: 'docker logs web', explanation: 'View the stdout/stderr logs of a container' },
              { command: 'docker exec -it web bash', explanation: 'Open an interactive shell inside a running container' },
            ]
          },
          {
            title: 'Building Docker Images',
            description: 'Create custom images using Dockerfiles.',
            commands: [
              { command: 'docker build -t myapp:1.0 .', explanation: 'Build an image from a Dockerfile in the current directory' },
              { command: 'docker images', explanation: 'List all locally available images' },
              { command: 'docker rmi myapp:1.0', explanation: 'Remove a Docker image' },
              { command: 'docker tag myapp:1.0 registry.io/myapp:1.0', explanation: 'Tag an image for pushing to a registry' },
              { command: 'docker push registry.io/myapp:1.0', explanation: 'Push an image to a remote registry' },
            ],
            bestPractices: [
              'Use multi-stage builds to reduce final image size',
              'Use .dockerignore to exclude unnecessary files from the build context',
              'Pin specific base image versions instead of using :latest',
              'Run containers as a non-root user for security',
            ]
          },
        ]
      },
      {
        title: 'Docker Compose & Networking',
        difficulty: 'Intermediate',
        topics: [
          {
            title: 'Multi-container Applications',
            description: 'Define and run multi-container apps with Docker Compose.',
            commands: [
              { command: 'docker compose up -d', explanation: 'Start all services defined in docker-compose.yml in the background' },
              { command: 'docker compose down', explanation: 'Stop and remove all containers, networks defined in composition' },
              { command: 'docker compose logs -f', explanation: 'Follow the logs of all composed services' },
              { command: 'docker compose ps', explanation: 'List status of services in the composition' },
              { command: 'docker network ls', explanation: 'List all Docker networks' },
              { command: 'docker volume ls', explanation: 'List all Docker volumes' },
            ]
          },
        ]
      },
      {
        title: 'Production Docker',
        difficulty: 'Advanced',
        topics: [
          {
            title: 'Image Optimization & Security',
            description: 'Optimize images for production and harden security.',
            commands: [
              { command: 'docker scout cves myapp:1.0', explanation: 'Scan image for Common Vulnerabilities and Exposures (CVEs)' },
              { command: 'docker history myapp:1.0', explanation: 'Show the layer history (useful for debugging image size)' },
              { command: 'docker system prune -a', explanation: 'Remove all unused images, containers, networks, and build cache' },
            ],
            bestPractices: [
              'Use distroless or alpine base images for minimal attack surface',
              'Implement Docker Content Trust for image signing',
              'Scan images in your CI/CD pipeline with Trivy or Snyk',
              'Set resource limits (--memory, --cpus) on containers',
            ]
          },
        ]
      },
    ]
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes (K8s)',
    icon: Ship,
    color: '#326ce5',
    description: 'Orchestrate containerized workloads at scale.',
    levels: [
      {
        title: 'Core Concepts',
        difficulty: 'Beginner',
        topics: [
          {
            title: 'Pods, Deployments & Services',
            description: 'Understand the fundamental building blocks of Kubernetes.',
            commands: [
              { command: 'kubectl get pods', explanation: 'List all pods in the current namespace' },
              { command: 'kubectl get deployments', explanation: 'List all deployments' },
              { command: 'kubectl get services', explanation: 'List all services exposing your apps' },
              { command: 'kubectl describe pod <name>', explanation: 'Show detailed information about a specific pod' },
              { command: 'kubectl logs <pod-name>', explanation: 'View logs from a pod (stdout)' },
              { command: 'kubectl apply -f deployment.yaml', explanation: 'Apply a configuration from a YAML manifest file' },
              { command: 'kubectl delete -f deployment.yaml', explanation: 'Delete resources defined in a manifest' },
            ]
          },
        ]
      },
      {
        title: 'Workload Management',
        difficulty: 'Intermediate',
        topics: [
          {
            title: 'Scaling, ConfigMaps & Secrets',
            description: 'Manage application scaling and configuration.',
            commands: [
              { command: 'kubectl scale deployment myapp --replicas=5', explanation: 'Scale a deployment to 5 replicas' },
              { command: 'kubectl autoscale deployment myapp --min=2 --max=10 --cpu-percent=80', explanation: 'Create a Horizontal Pod Autoscaler' },
              { command: 'kubectl create configmap app-config --from-file=config.properties', explanation: 'Create a ConfigMap from a file' },
              { command: 'kubectl create secret generic db-creds --from-literal=password=s3cret', explanation: 'Create a Secret from literal values' },
              { command: 'kubectl rollout status deployment/myapp', explanation: 'Check the rollout status of a deployment' },
              { command: 'kubectl rollout undo deployment/myapp', explanation: 'Rollback a deployment to the previous revision' },
            ],
            bestPractices: [
              'Always set resource requests and limits on your containers',
              'Use namespaces to logically isolate workloads (dev, staging, prod)',
              'Store sensitive data in Secrets, not ConfigMaps',
              'Use Rolling Update strategy for zero-downtime deployments',
            ]
          },
        ]
      },
      {
        title: 'Advanced K8s Operations',
        difficulty: 'Advanced',
        topics: [
          {
            title: 'RBAC, Network Policies & Helm',
            description: 'Secure and manage complex cluster configurations.',
            commands: [
              { command: 'kubectl auth can-i create pods --as dev-user', explanation: 'Check if a user has a specific permission (RBAC)' },
              { command: 'helm install myrelease ./mychart', explanation: 'Install a Helm chart' },
              { command: 'helm upgrade myrelease ./mychart', explanation: 'Upgrade an existing Helm release' },
              { command: 'kubectl get networkpolicy', explanation: 'List all Network Policies (firewall rules for pods)' },
            ],
            bestPractices: [
              'Follow the Principle of Least Privilege for RBAC roles',
              'Deny all ingress/egress traffic by default with Network Policies',
              'Use Helm for templating and managing complex applications',
              'Implement Pod Security Standards (Restricted profile)',
            ]
          },
        ]
      },
    ]
  },
  {
    id: 'jenkins',
    name: 'Jenkins CI/CD',
    icon: Settings,
    color: '#d33833',
    description: 'Design and automate CI/CD pipelines with the industry-standard automation server.',
    levels: [
      {
        title: 'Pipeline Basics',
        difficulty: 'Beginner',
        topics: [
          {
            title: 'Declarative Pipelines',
            description: 'Write your first Jenkins pipeline using the declarative syntax.',
            commands: [
              { command: 'pipeline { agent any; stages { stage("Build") { steps { sh "mvn clean package" } } } }', explanation: 'A basic declarative pipeline that builds a Maven project' },
              { command: 'post { always { junit "**/target/surefire-reports/*.xml" } }', explanation: 'Post-build action to publish JUnit test results' },
            ],
            bestPractices: [
              'Store your Jenkinsfile in the root of your repository (Pipeline as Code)',
              'Use declarative syntax over scripted for readability',
              'Leverage shared libraries for reusable pipeline logic across projects',
              'Run Jenkins agents as ephemeral containers for clean builds',
            ]
          },
        ]
      },
      {
        title: 'Advanced Pipelines',
        difficulty: 'Advanced',
        topics: [
          {
            title: 'Multibranch & Parallel Stages',
            description: 'Scale your CI/CD with dynamic branch discovery and parallelism.',
            commands: [
              { command: 'parallel { stage("Unit Tests") { steps { ... } } stage("Lint") { steps { ... } } }', explanation: 'Run multiple stages concurrently to speed up the pipeline' },
              { command: 'when { branch "main" }', explanation: 'Conditional stage execution based on the branch name' },
            ],
            bestPractices: [
              'Use Multibranch Pipelines to auto-discover branches and PRs',
              'Implement pipeline gates for approvals before deploying to production',
              'Cache dependencies (Maven, npm) to reduce build times',
            ]
          },
        ]
      },
    ]
  },
  {
    id: 'terraform',
    name: 'Terraform (IaC)',
    icon: CloudCog,
    color: '#7b42bc',
    description: 'Provision and manage cloud infrastructure declaratively using Infrastructure as Code.',
    levels: [
      {
        title: 'IaC Fundamentals',
        difficulty: 'Beginner',
        topics: [
          {
            title: 'Providers, Resources & State',
            description: 'Define infrastructure resources and manage Terraform state.',
            commands: [
              { command: 'terraform init', explanation: 'Initialize the working directory, download provider plugins' },
              { command: 'terraform plan', explanation: 'Preview the changes Terraform will make to match your configuration' },
              { command: 'terraform apply', explanation: 'Apply the planned changes to create/update infrastructure' },
              { command: 'terraform destroy', explanation: 'Destroy all infrastructure managed by the current configuration' },
              { command: 'terraform fmt', explanation: 'Reformat your .tf files to the canonical style' },
              { command: 'terraform validate', explanation: 'Validate the syntax and logic of your configuration files' },
            ]
          },
        ]
      },
      {
        title: 'Modules & State Management',
        difficulty: 'Intermediate',
        topics: [
          {
            title: 'Reusable Modules & Remote State',
            description: 'Write reusable modules and manage state collaboratively.',
            commands: [
              { command: 'terraform state list', explanation: 'List all resources tracked in the state file' },
              { command: 'terraform state show aws_instance.web', explanation: 'Show details of a specific resource in state' },
              { command: 'terraform import aws_instance.web i-12345', explanation: 'Import an existing cloud resource into Terraform state' },
              { command: 'terraform output', explanation: 'Display the output values from the state' },
            ],
            bestPractices: [
              'Always use remote state (S3 + DynamoDB, GCS, Azure Blob) for team collaboration',
              'Enable state locking to prevent concurrent modifications',
              'Break large configurations into reusable modules',
              'Use terraform plan in CI before applying changes automatically',
              'Pin provider and module versions to avoid breaking changes',
            ]
          },
        ]
      },
      {
        title: 'Advanced IaC Patterns',
        difficulty: 'Advanced',
        topics: [
          {
            title: 'Workspaces, Drift Detection & Policy as Code',
            description: 'Manage multiple environments and enforce governance.',
            commands: [
              { command: 'terraform workspace new staging', explanation: 'Create a new workspace for the staging environment' },
              { command: 'terraform workspace select prod', explanation: 'Switch to the production workspace' },
              { command: 'terraform plan -detailed-exitcode', explanation: 'Exit code 2 indicates drift (changes detected)' },
            ],
            bestPractices: [
              'Use workspaces or separate state files for dev/staging/prod',
              'Integrate Sentinel or OPA for Policy as Code enforcement',
              'Run terraform plan on a schedule to detect infrastructure drift',
            ]
          },
        ]
      },
    ]
  },
  {
    id: 'ansible',
    name: 'Ansible (Config Mgmt)',
    icon: Terminal,
    color: '#ee0000',
    description: 'Automate configuration management, application deployment, and orchestration.',
    levels: [
      {
        title: 'Playbook Basics',
        difficulty: 'Beginner',
        topics: [
          {
            title: 'Inventory, Playbooks & Modules',
            description: 'Write your first Ansible playbooks to configure remote systems.',
            commands: [
              { command: 'ansible all -m ping -i inventory.ini', explanation: 'Ping all hosts in the inventory to verify connectivity' },
              { command: 'ansible-playbook site.yml -i inventory.ini', explanation: 'Run a playbook against hosts defined in the inventory' },
              { command: 'ansible-playbook site.yml --check', explanation: 'Dry-run: show what changes would be made without applying them' },
              { command: 'ansible-galaxy collection install community.general', explanation: 'Install a community collection of modules from Ansible Galaxy' },
            ]
          },
        ]
      },
      {
        title: 'Roles & Advanced Automation',
        difficulty: 'Advanced',
        topics: [
          {
            title: 'Roles, Vault & Dynamic Inventory',
            description: 'Organize complex automation with roles and securely handle secrets.',
            commands: [
              { command: 'ansible-galaxy init my_role', explanation: 'Scaffold a new Ansible role directory structure' },
              { command: 'ansible-vault encrypt secrets.yml', explanation: 'Encrypt a file containing sensitive variables' },
              { command: 'ansible-playbook site.yml --ask-vault-pass', explanation: 'Run a playbook and prompt for the vault password' },
            ],
            bestPractices: [
              'Use roles to organize tasks, handlers, templates, and variables',
              'Always encrypt secrets with Ansible Vault',
              'Use dynamic inventory scripts for cloud environments (AWS, GCP, Azure)',
              'Make playbooks idempotent — running them multiple times should be safe',
            ]
          },
        ]
      },
    ]
  },
];

const DevOpsTools = () => {
  const [selectedTool, setSelectedTool] = useState<string>('git');
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const currentTool = toolModules.find(t => t.id === selectedTool)!;

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const toggleTopic = (topicTitle: string) => {
    setExpandedTopic(expandedTopic === topicTitle ? null : topicTitle);
  };

  return (
    <div className="devops-container">
      <div className="devops-header">
        <h1>DevOps Tools Playground</h1>
        <p>Master the essential tools of modern DevOps engineering — from version control to infrastructure automation.</p>
      </div>

      <div className="devops-layout">
        {/* Tool Selector */}
        <div className="tool-selector">
          {toolModules.map(tool => (
            <motion.button
              key={tool.id}
              className={`tool-tab glass-panel ${selectedTool === tool.id ? 'active' : ''}`}
              onClick={() => { setSelectedTool(tool.id); setExpandedTopic(null); }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ '--tool-color': tool.color } as React.CSSProperties}
            >
              <tool.icon size={22} style={{ color: tool.color }} />
              <span>{tool.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Tool Content */}
        <div className="tool-content">
          <motion.div
            key={selectedTool}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="tool-intro glass-panel">
              <currentTool.icon size={36} style={{ color: currentTool.color }} />
              <div>
                <h2>{currentTool.name}</h2>
                <p>{currentTool.description}</p>
              </div>
            </div>

            {currentTool.levels.map(level => (
              <div key={level.title} className="level-section">
                <div className="level-header">
                  <h3>{level.title}</h3>
                  <span className={`diff-badge ${level.difficulty.toLowerCase()}`}>{level.difficulty}</span>
                </div>

                <div className="topics-list">
                  {level.topics.map(topic => (
                    <div key={topic.title} className={`topic-card glass-panel ${expandedTopic === topic.title ? 'expanded' : ''}`}>
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
                            <h5><Play size={16} /> Commands & Examples</h5>
                            <div className="command-list">
                              {topic.commands.map(cmd => (
                                <div key={cmd.command} className="command-item">
                                  <div className="command-line">
                                    <code>{cmd.command}</code>
                                    <button 
                                      className="copy-icon" 
                                      onClick={() => handleCopy(cmd.command)}
                                      title="Copy command"
                                    >
                                      {copiedCmd === cmd.command ? <CheckCircle size={14} className="copied" /> : <Copy size={14} />}
                                    </button>
                                  </div>
                                  <span className="cmd-explanation">{cmd.explanation}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {topic.bestPractices && (
                            <div className="best-practices-section">
                              <h5><BookOpen size={16} /> Best Practices</h5>
                              <ul>
                                {topic.bestPractices.map((bp, i) => (
                                  <li key={i}>{bp}</li>
                                ))}
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

export default DevOpsTools;

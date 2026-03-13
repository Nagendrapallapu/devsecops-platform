import { useState } from 'react';
import { Github, ExternalLink, ShieldCheck, Server, Key, Terminal, Cloud, Container, GitBranch, Database } from 'lucide-react';
import '../styles/Projects.css';

const Projects = () => {
  const [filter, setFilter] = useState('All');

  const projects = [
    {
      id: 1,
      title: 'End-to-End AWS EKS DevSecOps Pipeline',
      description: 'A complete CI/CD pipeline deploying a containerized Node.js app to AWS EKS. Features Trivy image scanning, SonarQube code quality checks, and ArgoCD for GitOps deployment.',
      tags: ['AWS', 'Kubernetes', 'Jenkins', 'Trivy', 'ArgoCD'],
      category: 'CI/CD',
      icon: Server,
      difficulty: 'Advanced',
      githubLink: 'https://github.com/iam-veeramalla/Jenkins-Zero-To-Hero',
      demoLink: '#'
    },
    {
      id: 2,
      title: 'Zero Trust Network with HashiCorp Vault',
      description: 'Implement dynamic secret management and identity-based access control for microservices using HashiCorp Vault and Consul service mesh.',
      tags: ['Security', 'Vault', 'Consul', 'Microservices'],
      category: 'Security',
      icon: Key,
      difficulty: 'Advanced',
      githubLink: 'https://github.com/joatmon08/hashicorp-aws-zero-trust',
      demoLink: '#'
    },
    {
      id: 3,
      title: 'Automated Cloud Compliance (Azure Policy)',
      description: 'Define and enforce organizational standards across an Azure environment using Policy as Code. Includes automated remediation for non-compliant resources.',
      tags: ['Azure', 'Policy as Code', 'Compliance', 'Terraform'],
      category: 'Cloud',
      icon: ShieldCheck,
      difficulty: 'Intermediate',
      githubLink: 'https://github.com/globalbao/azure-policy-as-code',
      demoLink: '#'
    },
    {
      id: 4,
      title: 'Serverless Security Monitoring (GCP)',
      description: 'Deploy Cloud Functions and Eventarc to automatically analyze IAM changes and alert on suspicious privilege escalations via Slack.',
      tags: ['GCP', 'Serverless', 'Monitoring', 'Python'],
      category: 'Cloud',
      icon: Terminal,
      difficulty: 'Intermediate',
      githubLink: 'https://github.com/GoogleCloudPlatform/serverless-exp-samples',
      demoLink: '#'
    },
    {
      id: 5,
      title: 'Multi-Cloud Terraform Infrastructure',
      description: 'Provision identical environments across AWS, Azure, and GCP using Terraform modules. Demonstrates multi-cloud networking, IAM, and compute resource management.',
      tags: ['Terraform', 'AWS', 'Azure', 'GCP', 'Multi-Cloud'],
      category: 'IaC',
      icon: Cloud,
      difficulty: 'Advanced',
      githubLink: 'https://github.com/Adron/terraform-multi-cloud-demo',
      demoLink: '#'
    },
    {
      id: 6,
      title: 'GitOps with ArgoCD and Kubernetes',
      description: 'Implement a full GitOps workflow using ArgoCD. Automatically sync Kubernetes manifests from Git to a live cluster with rollback capabilities.',
      tags: ['ArgoCD', 'Kubernetes', 'GitOps', 'Helm'],
      category: 'CI/CD',
      icon: GitBranch,
      difficulty: 'Intermediate',
      githubLink: 'https://github.com/argoproj/argocd-example-apps',
      demoLink: '#'
    },
    {
      id: 7,
      title: 'Container Runtime Security with Falco',
      description: 'Deploy Falco on Kubernetes to detect runtime anomalies like shell access in containers, crypto mining processes, and sensitive file access.',
      tags: ['Falco', 'Kubernetes', 'Runtime Security', 'Helm'],
      category: 'Security',
      icon: ShieldCheck,
      difficulty: 'Intermediate',
      githubLink: 'https://github.com/falcosecurity/charts',
      demoLink: '#'
    },
    {
      id: 8,
      title: 'CI/CD with GitHub Actions & Docker',
      description: 'Build a complete CI pipeline using GitHub Actions that builds a Docker image, scans it with Trivy, pushes to GHCR, and deploys to a staging environment.',
      tags: ['GitHub Actions', 'Docker', 'Trivy', 'GHCR'],
      category: 'CI/CD',
      icon: Container,
      difficulty: 'Beginner',
      githubLink: 'https://github.com/docker/build-push-action',
      demoLink: '#'
    },
    {
      id: 9,
      title: 'Ansible Configuration Management at Scale',
      description: 'Automate the provisioning and configuration of 50+ servers using Ansible roles, dynamic inventory, and Ansible Vault for secret management.',
      tags: ['Ansible', 'Config Mgmt', 'Vault', 'Linux'],
      category: 'IaC',
      icon: Terminal,
      difficulty: 'Advanced',
      githubLink: 'https://github.com/geerlingguy/ansible-for-devops',
      demoLink: '#'
    },
    {
      id: 10,
      title: 'Database Backup & DR Pipeline',
      description: 'Automated PostgreSQL backup pipeline with S3 storage, encryption at rest, point-in-time recovery testing, and cross-region replication for disaster recovery.',
      tags: ['PostgreSQL', 'AWS S3', 'Backup', 'Bash'],
      category: 'Cloud',
      icon: Database,
      difficulty: 'Intermediate',
      githubLink: 'https://github.com/provo-sql/postgres-backup-s3',
      demoLink: '#'
    },
  ];

  const categories = ['All', 'CI/CD', 'Security', 'Cloud', 'IaC'];

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1>Project Showcase</h1>
        <p>Explore full-scale DevSecOps implementations and use them as templates for your own practice.</p>
      </div>

      <div className="projects-filters">
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

      <div className="projects-grid">
        {filteredProjects.map(project => (
          <div key={project.id} className="project-card glass-panel">
            <div className="project-card-header">
              <div className="project-icon-wrapper">
                <project.icon size={24} className="text-accent" />
              </div>
              <span className={`difficulty-badge ${project.difficulty.toLowerCase()}`}>
                {project.difficulty}
              </span>
            </div>
            
            <div className="project-card-body">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
            
            <div className="project-tags">
              {project.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
            
            <div className="project-actions">
              <a href={project.githubLink} className="action-link" target="_blank" rel="noopener noreferrer">
                <Github size={18} /> View Source
              </a>
              <a href={project.demoLink} className="action-link primary" target="_blank" rel="noopener noreferrer">
                <ExternalLink size={18} /> Try Lab
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;

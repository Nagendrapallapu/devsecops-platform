import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Cloud, Server, Database, Shield, Network, Globe,
  ChevronRight, Copy, CheckCircle, BookOpen, Play, Layers
} from 'lucide-react';
import '../styles/MultiCloud.css';

interface CloudProvider {
  id: string;
  name: string;
  color: string;
  gradient: string;
  description: string;
  services: ServiceCategory[];
}

interface ServiceCategory {
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  services: CloudService[];
}

interface CloudService {
  name: string;
  equivalent: { aws?: string; azure?: string; gcp?: string };
  description: string;
  commands: { command: string; explanation: string }[];
  bestPractices?: string[];
}

const providers: CloudProvider[] = [
  {
    id: 'aws',
    name: 'Amazon Web Services (AWS)',
    color: '#ff9900',
    gradient: 'linear-gradient(135deg, #ff9900, #ff6600)',
    description: 'The largest cloud provider — master EC2, S3, IAM, EKS, Lambda, and more.',
    services: [
      {
        title: 'Compute & Networking',
        difficulty: 'Beginner',
        services: [
          {
            name: 'EC2 (Elastic Compute Cloud)',
            equivalent: { azure: 'Virtual Machines', gcp: 'Compute Engine' },
            description: 'Launch and manage virtual servers in the cloud.',
            commands: [
              { command: 'aws ec2 run-instances --image-id ami-0abcdef --instance-type t3.micro --key-name mykey', explanation: 'Launch a new EC2 instance with a specific AMI and instance type' },
              { command: 'aws ec2 describe-instances --filters "Name=instance-state-name,Values=running"', explanation: 'List all running EC2 instances' },
              { command: 'aws ec2 stop-instances --instance-ids i-1234567890abcdef0', explanation: 'Stop a running instance' },
              { command: 'aws ec2 terminate-instances --instance-ids i-1234567890abcdef0', explanation: 'Permanently terminate (delete) an instance' },
            ],
            bestPractices: [
              'Use Auto Scaling Groups for high availability',
              'Choose the right instance type (compute, memory, or storage optimized)',
              'Use Spot Instances for fault-tolerant workloads to save up to 90%',
              'Always use IAM roles for EC2 instead of access keys',
            ]
          },
          {
            name: 'VPC (Virtual Private Cloud)',
            equivalent: { azure: 'Virtual Network (VNet)', gcp: 'VPC Network' },
            description: 'Create isolated virtual networks with full control over IP ranges, subnets, and routing.',
            commands: [
              { command: 'aws ec2 create-vpc --cidr-block 10.0.0.0/16', explanation: 'Create a new VPC with a /16 CIDR block' },
              { command: 'aws ec2 create-subnet --vpc-id vpc-123 --cidr-block 10.0.1.0/24 --availability-zone us-east-1a', explanation: 'Create a subnet in a specific AZ' },
              { command: 'aws ec2 describe-security-groups --group-ids sg-123', explanation: 'Describe security group rules (virtual firewall)' },
            ],
            bestPractices: [
              'Use private subnets for databases and backend services',
              'Enable VPC Flow Logs for network traffic auditing',
              'Use NAT Gateway for outbound internet access from private subnets',
            ]
          },
        ]
      },
      {
        title: 'Storage & Databases',
        difficulty: 'Intermediate',
        services: [
          {
            name: 'S3 (Simple Storage Service)',
            equivalent: { azure: 'Blob Storage', gcp: 'Cloud Storage' },
            description: 'Scalable object storage for any amount of data.',
            commands: [
              { command: 'aws s3 mb s3://my-devops-bucket', explanation: 'Create a new S3 bucket' },
              { command: 'aws s3 cp myfile.tar.gz s3://my-devops-bucket/', explanation: 'Upload a file to S3' },
              { command: 'aws s3 ls s3://my-devops-bucket/ --recursive', explanation: 'List all objects in a bucket recursively' },
              { command: 'aws s3 sync ./dist/ s3://my-devops-bucket/static/', explanation: 'Sync a local directory to S3 (like rsync)' },
            ],
            bestPractices: [
              'Enable versioning and MFA Delete for critical buckets',
              'Use S3 bucket policies and Block Public Access settings',
              'Enable server-side encryption (SSE-S3 or SSE-KMS)',
              'Use lifecycle policies to transition data to cheaper storage classes (Glacier)',
            ]
          },
          {
            name: 'RDS & DynamoDB',
            equivalent: { azure: 'Azure SQL / Cosmos DB', gcp: 'Cloud SQL / Firestore' },
            description: 'Managed relational and NoSQL database services.',
            commands: [
              { command: 'aws rds create-db-instance --db-instance-identifier mydb --engine postgres --master-username admin --master-user-password s3cret --db-instance-class db.t3.micro', explanation: 'Launch a managed PostgreSQL instance' },
              { command: 'aws dynamodb create-table --table-name Users --attribute-definitions AttributeName=UserId,AttributeType=S --key-schema AttributeName=UserId,KeyType=HASH --billing-mode PAY_PER_REQUEST', explanation: 'Create a DynamoDB table with on-demand billing' },
            ],
            bestPractices: [
              'Enable Multi-AZ deployments for RDS high availability',
              'Use read replicas for read-heavy workloads',
              'Enable automated backups and set retention periods',
            ]
          },
        ]
      },
      {
        title: 'Containers & Serverless',
        difficulty: 'Advanced',
        services: [
          {
            name: 'EKS (Elastic Kubernetes Service)',
            equivalent: { azure: 'AKS', gcp: 'GKE' },
            description: 'Managed Kubernetes clusters for running containerized workloads at scale.',
            commands: [
              { command: 'eksctl create cluster --name my-cluster --region us-east-1 --nodes 3', explanation: 'Create an EKS cluster with 3 worker nodes using eksctl' },
              { command: 'aws eks update-kubeconfig --name my-cluster --region us-east-1', explanation: 'Update your local kubeconfig to connect to the EKS cluster' },
              { command: 'kubectl get nodes', explanation: 'Verify worker nodes are connected and ready' },
            ],
            bestPractices: [
              'Use managed node groups for simplified worker node management',
              'Enable cluster autoscaler for dynamic scaling',
              'Use IAM Roles for Service Accounts (IRSA) for pod-level permissions',
              'Implement Network Policies and Pod Security Standards',
            ]
          },
          {
            name: 'Lambda (Serverless)',
            equivalent: { azure: 'Azure Functions', gcp: 'Cloud Functions' },
            description: 'Run code without provisioning or managing servers.',
            commands: [
              { command: 'aws lambda create-function --function-name myFunc --runtime python3.12 --handler lambda_function.handler --role arn:aws:iam::123:role/myRole --zip-file fileb://function.zip', explanation: 'Deploy a Python Lambda function' },
              { command: 'aws lambda invoke --function-name myFunc --payload \'{"key":"value"}\' output.json', explanation: 'Invoke a Lambda function with a JSON payload' },
            ],
            bestPractices: [
              'Keep functions small and single-purpose',
              'Use environment variables for configuration (not hardcoded)',
              'Set appropriate memory and timeout limits',
              'Use Lambda Layers for shared dependencies',
            ]
          },
        ]
      },
    ]
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    color: '#0078d4',
    gradient: 'linear-gradient(135deg, #0078d4, #00a4ef)',
    description: 'Enterprise-grade cloud with deep integration into the Microsoft ecosystem.',
    services: [
      {
        title: 'Compute & Networking',
        difficulty: 'Beginner',
        services: [
          {
            name: 'Azure Virtual Machines',
            equivalent: { aws: 'EC2', gcp: 'Compute Engine' },
            description: 'Create Linux and Windows VMs of any size.',
            commands: [
              { command: 'az vm create --resource-group myRG --name myVM --image Ubuntu2204 --admin-username azureuser --generate-ssh-keys', explanation: 'Create an Ubuntu VM with auto-generated SSH keys' },
              { command: 'az vm list --resource-group myRG -o table', explanation: 'List all VMs in a resource group' },
              { command: 'az vm stop --resource-group myRG --name myVM', explanation: 'Stop (deallocate) a VM' },
              { command: 'az vm delete --resource-group myRG --name myVM --yes', explanation: 'Delete a VM' },
            ],
            bestPractices: [
              'Use Availability Sets or Zones for high availability',
              'Leverage Azure Spot VMs for cost savings on interruptible workloads',
              'Use Managed Disks for simplified disk management',
            ]
          },
          {
            name: 'Azure Virtual Network (VNet)',
            equivalent: { aws: 'VPC', gcp: 'VPC Network' },
            description: 'Create isolated networks, subnets, and Network Security Groups.',
            commands: [
              { command: 'az network vnet create --resource-group myRG --name myVNet --address-prefix 10.0.0.0/16 --subnet-name default --subnet-prefix 10.0.0.0/24', explanation: 'Create a VNet with a default subnet' },
              { command: 'az network nsg create --resource-group myRG --name myNSG', explanation: 'Create a Network Security Group' },
              { command: 'az network nsg rule create --resource-group myRG --nsg-name myNSG --name AllowSSH --priority 100 --destination-port-ranges 22 --access Allow --protocol Tcp', explanation: 'Add an NSG rule to allow SSH' },
            ],
          },
        ]
      },
      {
        title: 'Containers & DevOps Services',
        difficulty: 'Intermediate',
        services: [
          {
            name: 'AKS (Azure Kubernetes Service)',
            equivalent: { aws: 'EKS', gcp: 'GKE' },
            description: 'Fully managed Kubernetes cluster with Azure integration.',
            commands: [
              { command: 'az aks create --resource-group myRG --name myAKS --node-count 3 --generate-ssh-keys', explanation: 'Create an AKS cluster with 3 nodes' },
              { command: 'az aks get-credentials --resource-group myRG --name myAKS', explanation: 'Get kubeconfig credentials for the AKS cluster' },
              { command: 'az aks scale --resource-group myRG --name myAKS --node-count 5', explanation: 'Scale the cluster to 5 nodes' },
            ],
            bestPractices: [
              'Use Azure AD integration for RBAC',
              'Enable Azure Policy for Kubernetes to enforce governance',
              'Use Azure Container Registry (ACR) for private image hosting',
            ]
          },
          {
            name: 'Azure DevOps Pipelines',
            equivalent: { aws: 'CodePipeline', gcp: 'Cloud Build' },
            description: 'CI/CD pipelines integrated with Azure Repos, GitHub, and more.',
            commands: [
              { command: 'az pipelines create --name "CI-Pipeline" --repository myrepo --branch main --yml-path azure-pipelines.yml', explanation: 'Create a new pipeline from a YAML definition' },
              { command: 'az pipelines run --name "CI-Pipeline"', explanation: 'Trigger a pipeline run manually' },
            ],
            bestPractices: [
              'Use YAML pipelines (not classic editor) for pipeline-as-code',
              'Leverage environments for deployment approvals and gates',
              'Use service connections with minimal permissions',
            ]
          },
        ]
      },
      {
        title: 'Identity & Security',
        difficulty: 'Advanced',
        services: [
          {
            name: 'Azure Active Directory & RBAC',
            equivalent: { aws: 'IAM', gcp: 'Cloud IAM' },
            description: 'Manage identities, roles, and fine-grained access control.',
            commands: [
              { command: 'az ad user create --display-name "Dev User" --password P@ssw0rd! --user-principal-name devuser@contoso.com', explanation: 'Create a new Azure AD user' },
              { command: 'az role assignment create --assignee devuser@contoso.com --role "Contributor" --scope /subscriptions/xxx', explanation: 'Assign the Contributor role to a user on a subscription' },
              { command: 'az role assignment list --assignee devuser@contoso.com -o table', explanation: 'List all role assignments for a user' },
            ],
            bestPractices: [
              'Use Managed Identities instead of service principals where possible',
              'Enable Conditional Access policies for MFA enforcement',
              'Follow the principle of least privilege with custom roles',
              'Use Azure Key Vault for secrets, keys, and certificates',
            ]
          },
        ]
      },
    ]
  },
  {
    id: 'gcp',
    name: 'Google Cloud Platform (GCP)',
    color: '#4285f4',
    gradient: 'linear-gradient(135deg, #4285f4, #34a853)',
    description: 'Google-scale infrastructure with leadership in data analytics, AI/ML, and Kubernetes (GKE).',
    services: [
      {
        title: 'Compute & Networking',
        difficulty: 'Beginner',
        services: [
          {
            name: 'Compute Engine',
            equivalent: { aws: 'EC2', azure: 'Virtual Machines' },
            description: 'Create and manage virtual machine instances on Google infrastructure.',
            commands: [
              { command: 'gcloud compute instances create my-vm --zone=us-central1-a --machine-type=e2-micro --image-family=ubuntu-2204-lts --image-project=ubuntu-os-cloud', explanation: 'Create an Ubuntu VM in us-central1-a' },
              { command: 'gcloud compute instances list', explanation: 'List all VM instances in the current project' },
              { command: 'gcloud compute ssh my-vm --zone=us-central1-a', explanation: 'SSH into an instance directly via gcloud' },
              { command: 'gcloud compute instances stop my-vm --zone=us-central1-a', explanation: 'Stop a running instance' },
            ],
            bestPractices: [
              'Use Preemptible/Spot VMs for batch processing and fault-tolerant workloads',
              'Use Instance Templates and Managed Instance Groups for scaling',
              'Attach service accounts to VMs instead of using user credentials',
            ]
          },
          {
            name: 'VPC Network & Firewalls',
            equivalent: { aws: 'VPC', azure: 'VNet' },
            description: 'Manage global virtual networks and firewall rules.',
            commands: [
              { command: 'gcloud compute networks create my-vpc --subnet-mode=custom', explanation: 'Create a custom-mode VPC network' },
              { command: 'gcloud compute networks subnets create my-subnet --network=my-vpc --region=us-central1 --range=10.0.0.0/24', explanation: 'Create a subnet in the VPC' },
              { command: 'gcloud compute firewall-rules create allow-ssh --network=my-vpc --allow=tcp:22 --source-ranges=0.0.0.0/0', explanation: 'Create a firewall rule to allow SSH' },
            ],
          },
        ]
      },
      {
        title: 'Storage, Databases & GKE',
        difficulty: 'Intermediate',
        services: [
          {
            name: 'Cloud Storage & Cloud SQL',
            equivalent: { aws: 'S3 / RDS', azure: 'Blob Storage / Azure SQL' },
            description: 'Object storage and managed relational databases.',
            commands: [
              { command: 'gsutil mb gs://my-devops-bucket', explanation: 'Create a Cloud Storage bucket' },
              { command: 'gsutil cp myfile.tar.gz gs://my-devops-bucket/', explanation: 'Upload a file to Cloud Storage' },
              { command: 'gcloud sql instances create mydb --database-version=POSTGRES_15 --tier=db-f1-micro --region=us-central1', explanation: 'Create a managed PostgreSQL instance' },
            ],
          },
          {
            name: 'GKE (Google Kubernetes Engine)',
            equivalent: { aws: 'EKS', azure: 'AKS' },
            description: 'The most mature managed Kubernetes offering, created by the inventors of Kubernetes.',
            commands: [
              { command: 'gcloud container clusters create my-cluster --zone=us-central1-a --num-nodes=3', explanation: 'Create a GKE cluster with 3 nodes' },
              { command: 'gcloud container clusters get-credentials my-cluster --zone=us-central1-a', explanation: 'Get kubeconfig for the GKE cluster' },
              { command: 'gcloud container clusters resize my-cluster --zone=us-central1-a --num-nodes=5', explanation: 'Resize the cluster to 5 nodes' },
            ],
            bestPractices: [
              'Use Autopilot mode for a fully managed GKE experience',
              'Enable Workload Identity for secure pod-to-GCP-service authentication',
              'Use Binary Authorization to enforce trusted container images',
              'Enable GKE Security Posture for continuous vulnerability scanning',
            ]
          },
        ]
      },
      {
        title: 'IAM & Serverless',
        difficulty: 'Advanced',
        services: [
          {
            name: 'Cloud IAM & Organization Policies',
            equivalent: { aws: 'IAM', azure: 'Azure AD / RBAC' },
            description: 'Manage fine-grained access control and organization-level security constraints.',
            commands: [
              { command: 'gcloud projects add-iam-policy-binding my-project --member="user:dev@example.com" --role="roles/editor"', explanation: 'Grant the Editor role to a user on a project' },
              { command: 'gcloud iam service-accounts create my-sa --display-name="My Service Account"', explanation: 'Create a new service account' },
              { command: 'gcloud iam service-accounts keys create key.json --iam-account=my-sa@project.iam.gserviceaccount.com', explanation: 'Create a service account key (use Workload Identity instead in production)' },
            ],
            bestPractices: [
              'Use Workload Identity Federation instead of service account keys',
              'Apply organization policies to enforce security constraints',
              'Use Custom Roles for fine-grained least-privilege access',
              'Enable Access Transparency logs for audit',
            ]
          },
          {
            name: 'Cloud Functions & Cloud Run',
            equivalent: { aws: 'Lambda / Fargate', azure: 'Functions / Container Apps' },
            description: 'Run code or containers without managing infrastructure.',
            commands: [
              { command: 'gcloud functions deploy myFunc --runtime=python312 --trigger-http --allow-unauthenticated --entry-point=handler', explanation: 'Deploy an HTTP-triggered Cloud Function' },
              { command: 'gcloud run deploy my-service --image=gcr.io/my-project/myapp --region=us-central1 --allow-unauthenticated', explanation: 'Deploy a container to Cloud Run' },
            ],
            bestPractices: [
              'Use Cloud Run for containerized workloads (more flexible than Cloud Functions)',
              'Set concurrency and memory limits appropriately',
              'Use Eventarc for event-driven architectures',
            ]
          },
        ]
      },
    ]
  },
];

const MultiCloud = () => {
  const [selectedProvider, setSelectedProvider] = useState<string>('aws');
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const currentProvider = providers.find(p => p.id === selectedProvider)!;

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const toggleService = (name: string) => {
    setExpandedService(expandedService === name ? null : name);
  };

  return (
    <div className="cloud-container">
      <div className="cloud-header">
        <h1>Multi-Cloud Practice Lab</h1>
        <p>Learn cloud services across AWS, Azure, and GCP — with side-by-side comparisons of equivalent services.</p>
      </div>

      {/* Provider Tabs */}
      <div className="provider-tabs">
        {providers.map(p => (
          <motion.button
            key={p.id}
            className={`provider-tab ${selectedProvider === p.id ? 'active' : ''}`}
            style={{ '--provider-color': p.color, '--provider-gradient': p.gradient } as React.CSSProperties}
            onClick={() => { setSelectedProvider(p.id); setExpandedService(null); }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Cloud size={20} />
            <span>{p.name.split('(')[0].trim()}</span>
          </motion.button>
        ))}
      </div>

      {/* Provider Content */}
      <motion.div
        key={selectedProvider}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="cloud-content"
      >
        <div className="provider-intro glass-panel" style={{ borderLeft: `3px solid ${currentProvider.color}` }}>
          <div>
            <h2 style={{ color: currentProvider.color }}>{currentProvider.name}</h2>
            <p>{currentProvider.description}</p>
          </div>
        </div>

        {currentProvider.services.map(category => (
          <div key={category.title} className="cloud-category">
            <div className="level-header">
              <h3>{category.title}</h3>
              <span className={`diff-badge ${category.difficulty.toLowerCase()}`}>{category.difficulty}</span>
            </div>

            <div className="cloud-services-list">
              {category.services.map(svc => (
                <div key={svc.name} className={`cloud-service-card glass-panel ${expandedService === svc.name ? 'expanded' : ''}`}>
                  <button className="topic-header-btn" onClick={() => toggleService(svc.name)}>
                    <div>
                      <h4>{svc.name}</h4>
                      <p>{svc.description}</p>
                      {svc.equivalent && (
                        <div className="equivalents">
                          <Layers size={12} />
                          {svc.equivalent.aws && selectedProvider !== 'aws' && <span className="eq-tag aws">AWS: {svc.equivalent.aws}</span>}
                          {svc.equivalent.azure && selectedProvider !== 'azure' && <span className="eq-tag azure">Azure: {svc.equivalent.azure}</span>}
                          {svc.equivalent.gcp && selectedProvider !== 'gcp' && <span className="eq-tag gcp">GCP: {svc.equivalent.gcp}</span>}
                        </div>
                      )}
                    </div>
                    <ChevronRight className={`chevron ${expandedService === svc.name ? 'rotated' : ''}`} size={20} />
                  </button>

                  {expandedService === svc.name && (
                    <motion.div
                      className="topic-body"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="commands-section">
                        <h5><Play size={16} /> CLI Commands</h5>
                        <div className="command-list">
                          {svc.commands.map(cmd => (
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

                      {svc.bestPractices && svc.bestPractices.length > 0 && (
                        <div className="best-practices-section">
                          <h5><BookOpen size={16} /> Best Practices</h5>
                          <ul>
                            {svc.bestPractices.map((bp, i) => <li key={i}>{bp}</li>)}
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
  );
};

export default MultiCloud;

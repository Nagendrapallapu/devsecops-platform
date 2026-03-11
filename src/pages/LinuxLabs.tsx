import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Terminal, Play, CheckCircle, Circle, RefreshCw,
  ChevronRight, Copy, BookOpen, FolderTree, FileText,
  Users, Network, HardDrive, Cpu, ShieldCheck, Code
} from 'lucide-react';
import '../styles/LinuxLabs.css';

interface LabModule {
  id: string;
  title: string;
  icon: React.ElementType;
  completed: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  commands: { command: string; explanation: string }[];
  challenge: { objective: string; hint: string };
}

const basicModules: LabModule[] = [
  {
    id: 'nav', title: 'Navigation & File System', icon: FolderTree, completed: false, difficulty: 'Beginner',
    description: 'Navigate the Linux filesystem, list files, and understand the directory structure.',
    commands: [
      { command: 'pwd', explanation: 'Print Working Directory — shows your current location' },
      { command: 'ls -la', explanation: 'List all files including hidden, with details (permissions, size, date)' },
      { command: 'cd /var/log', explanation: 'Change directory to /var/log' },
      { command: 'cd ..', explanation: 'Go up one directory level' },
      { command: 'cd ~', explanation: 'Go to your home directory' },
      { command: 'mkdir -p projects/devops', explanation: 'Create nested directories with -p flag' },
      { command: 'touch myfile.txt', explanation: 'Create an empty file' },
      { command: 'cp -r source/ dest/', explanation: 'Copy a directory recursively' },
      { command: 'mv old_name new_name', explanation: 'Move or rename a file/directory' },
      { command: 'rm -rf directory/', explanation: 'Recursively delete a directory and its contents (use with caution!)' },
    ],
    challenge: { objective: 'Create a directory structure: ~/devops/docker/configs and a file named nginx.conf inside configs/', hint: 'Use mkdir -p and touch' }
  },
  {
    id: 'perms', title: 'Permissions & Ownership', icon: ShieldCheck, completed: false, difficulty: 'Beginner',
    description: 'Manage file permissions (read, write, execute) and ownership (user, group).',
    commands: [
      { command: 'chmod 755 script.sh', explanation: 'Set rwx for owner, r-x for group and others (common for scripts)' },
      { command: 'chmod u+x script.sh', explanation: 'Add execute permission for the owner only' },
      { command: 'chmod 600 private_key', explanation: 'Read/write for owner only (common for SSH keys)' },
      { command: 'chown user:group file.txt', explanation: 'Change owner and group of a file' },
      { command: 'chown -R www-data:www-data /var/www/', explanation: 'Recursively change ownership (common for web servers)' },
      { command: 'ls -la /etc/shadow', explanation: 'Observe restricted permissions on sensitive system files' },
    ],
    challenge: { objective: 'Create a script deploy.sh. Set permissions so only the owner can read, write, and execute it.', hint: 'Use touch, then chmod 700' }
  },
  {
    id: 'text', title: 'Text Processing', icon: FileText, completed: false, difficulty: 'Beginner',
    description: 'Search, filter, and transform text using powerful CLI tools.',
    commands: [
      { command: 'cat /etc/os-release', explanation: 'Display file contents' },
      { command: 'grep -r "error" /var/log/', explanation: 'Recursively search for "error" in all log files' },
      { command: 'grep -i "warning" syslog | wc -l', explanation: 'Count the number of warning lines (case-insensitive)' },
      { command: "awk '{print $1, $4}' access.log", explanation: 'Print the 1st and 4th columns from an access log' },
      { command: "sed 's/http/https/g' config.txt", explanation: 'Replace all occurrences of http with https' },
      { command: 'head -20 largefile.log', explanation: 'View the first 20 lines of a file' },
      { command: 'tail -f /var/log/syslog', explanation: 'Follow a log file in real-time (great for debugging)' },
      { command: 'sort access.log | uniq -c | sort -rn | head -10', explanation: 'Find the top 10 most frequent lines in a log' },
    ],
    challenge: { objective: 'Find all lines containing "CRITICAL" in /var/log/syslog and count them.', hint: 'Pipe grep into wc -l' }
  },
];

const intermediateModules: LabModule[] = [
  {
    id: 'proc', title: 'Process Management', icon: Cpu, completed: false, difficulty: 'Intermediate',
    description: 'Monitor, manage, and control system processes and resource usage.',
    commands: [
      { command: 'ps aux', explanation: 'List all running processes with CPU and memory usage' },
      { command: 'ps aux | grep nginx', explanation: 'Find all processes related to Nginx' },
      { command: 'top', explanation: 'Interactive real-time process monitor (press q to quit)' },
      { command: 'htop', explanation: 'A more user-friendly, colorful process monitor (may need installation)' },
      { command: 'kill -9 <PID>', explanation: 'Force kill a process by its Process ID' },
      { command: 'systemctl status nginx', explanation: 'Check the status of the Nginx service (systemd)' },
      { command: 'systemctl restart nginx', explanation: 'Restart the Nginx service' },
      { command: 'journalctl -u nginx -f', explanation: 'Follow the systemd journal logs for Nginx' },
      { command: 'nohup ./long-task.sh &', explanation: 'Run a command in the background, surviving terminal logout' },
      { command: 'jobs && fg %1', explanation: 'List background jobs and bring job #1 to foreground' },
    ],
    challenge: { objective: 'Start a background process, find its PID using ps, and then kill it.', hint: 'Use sleep 1000 & then ps aux | grep sleep, then kill' }
  },
  {
    id: 'net', title: 'Networking', icon: Network, completed: false, difficulty: 'Intermediate',
    description: 'Troubleshoot network connectivity, DNS, and inspect open ports.',
    commands: [
      { command: 'ip addr show', explanation: 'Display all network interfaces and their IP addresses' },
      { command: 'ping -c 4 google.com', explanation: 'Test network connectivity to a host (4 packets)' },
      { command: 'curl -I https://example.com', explanation: 'Fetch only HTTP headers from a URL' },
      { command: 'wget https://example.com/file.tar.gz', explanation: 'Download a file from the internet' },
      { command: 'netstat -tlnp', explanation: 'List all listening TCP ports with process info' },
      { command: 'ss -tlnp', explanation: 'Modern replacement for netstat — faster and more info' },
      { command: 'dig example.com', explanation: 'Query DNS records for a domain' },
      { command: 'nslookup example.com', explanation: 'Look up the IP address of a domain name' },
      { command: 'traceroute google.com', explanation: 'Trace the route packets take to reach a host' },
      { command: 'iptables -L -n', explanation: 'List all firewall rules (iptables)' },
    ],
    challenge: { objective: 'Check which processes are listening on port 80 and 443.', hint: 'Use ss -tlnp | grep -E "80|443"' }
  },
  {
    id: 'users', title: 'User & Group Management', icon: Users, completed: false, difficulty: 'Intermediate',
    description: 'Create and manage users, groups, and sudo privileges.',
    commands: [
      { command: 'useradd -m -s /bin/bash devuser', explanation: 'Create a new user with a home directory and bash shell' },
      { command: 'passwd devuser', explanation: 'Set or change a user\'s password' },
      { command: 'usermod -aG docker devuser', explanation: 'Add user to the docker group (without removing existing groups)' },
      { command: 'groupadd developers', explanation: 'Create a new group' },
      { command: 'id devuser', explanation: 'Show user\'s UID, GID, and group memberships' },
      { command: 'cat /etc/passwd | grep devuser', explanation: 'View user account information' },
      { command: 'visudo', explanation: 'Safely edit the sudoers file for granting sudo access' },
      { command: 'su - devuser', explanation: 'Switch to another user account' },
    ],
    challenge: { objective: 'Create a user "jenkins" with home directory. Add it to a "cicd" group.', hint: 'useradd -m jenkins, groupadd cicd, usermod -aG cicd jenkins' }
  },
];

const advancedModules: LabModule[] = [
  {
    id: 'disk', title: 'Disk & Storage Management', icon: HardDrive, completed: false, difficulty: 'Advanced',
    description: 'Manage disks, partitions, LVM, and filesystems.',
    commands: [
      { command: 'df -h', explanation: 'Show disk space usage in human-readable format' },
      { command: 'du -sh /var/log/', explanation: 'Show the total size of a directory' },
      { command: 'lsblk', explanation: 'List all block devices (disks, partitions)' },
      { command: 'fdisk -l', explanation: 'List partition tables for all disks' },
      { command: 'mount /dev/sdb1 /mnt/data', explanation: 'Mount a partition to a directory' },
      { command: 'umount /mnt/data', explanation: 'Unmount a filesystem' },
      { command: 'cat /etc/fstab', explanation: 'View persistent mount configurations' },
    ],
    challenge: { objective: 'Find the 5 largest files in /var and display their sizes.', hint: 'Use find with -exec du or du -a | sort -rn | head' }
  },
  {
    id: 'shell', title: 'Shell Scripting', icon: Code, completed: false, difficulty: 'Advanced',
    description: 'Automate tasks with Bash scripts — variables, loops, conditionals, and functions.',
    commands: [
      { command: '#!/bin/bash', explanation: 'Shebang line — tell the system to use Bash to interpret the script' },
      { command: 'BACKUP_DIR="/backups/$(date +%Y%m%d)"', explanation: 'Variable assignment with command substitution for dates' },
      { command: 'if [ -d "$DIR" ]; then echo "exists"; fi', explanation: 'Conditional: check if a directory exists' },
      { command: 'for file in *.log; do gzip "$file"; done', explanation: 'Loop: compress all .log files in the current directory' },
      { command: 'while read -r line; do echo "$line"; done < input.txt', explanation: 'Read a file line by line' },
      { command: 'function deploy() { echo "Deploying $1..."; }', explanation: 'Define a reusable function' },
      { command: 'crontab -e', explanation: 'Edit cron jobs for scheduled task automation' },
      { command: '0 2 * * * /opt/scripts/backup.sh >> /var/log/backup.log 2>&1', explanation: 'Cron: run backup daily at 2 AM, logging output' },
    ],
    challenge: { objective: 'Write a script that checks if Nginx is running. If not, restart it and log the event.', hint: 'Use systemctl is-active, if/else, and echo with >> append' }
  },
];

const LinuxLabs = () => {
  const [activeTab, setActiveTab] = useState<'basics' | 'intermediate' | 'advanced'>('basics');
  const [selectedModule, setSelectedModule] = useState<LabModule | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const modulesMap = {
    basics: basicModules,
    intermediate: intermediateModules,
    advanced: advancedModules,
  };

  const currentModules = modulesMap[activeTab];

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="labs-container">
      <div className="labs-header">
        <h1>Linux Playground</h1>
        <p>Master command-line skills from fundamental navigation to advanced system administration and scripting.</p>
      </div>

      <div className="labs-content">
        <div className="labs-sidebar glass-panel">
          <div className="labs-tabs">
            <button className={`tab-btn ${activeTab === 'basics' ? 'active' : ''}`} onClick={() => { setActiveTab('basics'); setSelectedModule(null); }}>
              Fundamentals
            </button>
            <button className={`tab-btn ${activeTab === 'intermediate' ? 'active' : ''}`} onClick={() => { setActiveTab('intermediate'); setSelectedModule(null); }}>
              Intermediate
            </button>
            <button className={`tab-btn ${activeTab === 'advanced' ? 'active' : ''}`} onClick={() => { setActiveTab('advanced'); setSelectedModule(null); }}>
              Advanced
            </button>
          </div>
          
          <div className="module-list">
            {currentModules.map(mod => (
              <div 
                key={mod.id} 
                className={`module-item ${selectedModule?.id === mod.id ? 'selected' : ''} ${mod.completed ? 'completed' : ''}`}
                onClick={() => setSelectedModule(mod)}
              >
                <mod.icon size={18} />
                <div className="module-item-text">
                  <span>{mod.title}</span>
                  <span className={`mini-badge ${mod.difficulty.toLowerCase()}`}>{mod.difficulty}</span>
                </div>
                <ChevronRight size={14} className="module-chevron" />
              </div>
            ))}
          </div>
        </div>

        <div className="labs-main-area">
          {selectedModule ? (
            <motion.div 
              key={selectedModule.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="module-detail"
            >
              {/* Terminal Area */}
              <div className="labs-terminal-area glass-panel">
                <div className="terminal-header">
                  <div className="terminal-controls">
                    <span className="control close"></span>
                    <span className="control minimize"></span>
                    <span className="control maximize"></span>
                  </div>
                  <div className="terminal-title">
                    <Terminal size={14} /> root@devsecops-lab:~
                  </div>
                  <div className="terminal-actions">
                    <button className="icon-btn" title="Reset VM"><RefreshCw size={16}/></button>
                  </div>
                </div>
                <div className="terminal-body">
                  <div className="terminal-output">
                    <p className="sys-msg">Welcome to Ubuntu 22.04 LTS — DevSecOps Lab Environment</p>
                    <p className="sys-msg">Module: {selectedModule.title}</p>
                    <br />
                    {selectedModule.commands.slice(0, 3).map((cmd, i) => (
                      <div key={i}>
                        <p className="prompt"><span className="user">root@devsecops-lab</span>:<span className="path">~</span># {cmd.command}</p>
                        <p className="cmd-output">→ {cmd.explanation}</p>
                      </div>
                    ))}
                    <p className="prompt"><span className="user">root@devsecops-lab</span>:<span className="path">~</span># <span className="cursor"></span></p>
                  </div>
                </div>
              </div>

              {/* Commands Reference */}
              <div className="commands-reference glass-panel">
                <h3><Play size={18} /> Command Reference: {selectedModule.title}</h3>
                <p className="ref-desc">{selectedModule.description}</p>
                <div className="command-list">
                  {selectedModule.commands.map(cmd => (
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

              {/* Challenge */}
              <div className="challenge-card glass-panel">
                <h3>🎯 Challenge</h3>
                <p className="challenge-objective">{selectedModule.challenge.objective}</p>
                <details className="hint-toggle">
                  <summary>💡 Show Hint</summary>
                  <p>{selectedModule.challenge.hint}</p>
                </details>
                <button className="btn-primary btn-sm"><Play size={16} /> Submit Solution</button>
              </div>
            </motion.div>
          ) : (
            <div className="module-placeholder glass-panel">
              <Terminal size={48} className="placeholder-icon" />
              <h2>Select a module to begin</h2>
              <p>Choose a topic from the sidebar to view commands, examples, and hands-on challenges.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinuxLabs;

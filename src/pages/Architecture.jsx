import {
  Building2, Users, Route, HardDrive, KeyRound, Search,
  BarChart3, ShieldCheck, ArrowDown, Cloud, Lock, Database,
  Eye, FileSearch, Activity,
} from 'lucide-react';

const layers = [
  {
    title: 'AWS Organization (Management Account)',
    icon: Building2,
    nodes: [
      { name: 'AWS Organizations', desc: 'Central governance', icon: Building2, color: 'var(--accent-cyan)' },
      { name: 'Organization Trail', desc: 'CloudTrail config', icon: Route, color: 'var(--accent-blue)' },
      { name: 'Service Control Policies', desc: 'Preventive guardrails', icon: Lock, color: 'var(--accent-purple)' },
    ],
  },
  {
    title: 'Member Accounts',
    icon: Users,
    nodes: [
      { name: 'Production US-East', desc: '123456789012', icon: Cloud, color: 'var(--color-danger)' },
      { name: 'Production EU-West', desc: '234567890123', icon: Cloud, color: 'var(--color-danger)' },
      { name: 'Staging', desc: '345678901234', icon: Cloud, color: 'var(--color-warning)' },
      { name: 'Dev Backend', desc: '456789012345', icon: Cloud, color: 'var(--accent-blue)' },
      { name: 'Dev Frontend', desc: '567890123456', icon: Cloud, color: 'var(--accent-blue)' },
      { name: 'Security Audit', desc: '678901234567', icon: ShieldCheck, color: 'var(--color-success)' },
    ],
  },
  {
    title: 'CloudTrail Organization Trail',
    icon: Route,
    nodes: [
      { name: 'API Activity Logging', desc: 'All management events', icon: Activity, color: 'var(--accent-cyan)' },
      { name: 'Data Events', desc: 'S3 & Lambda data events', icon: Database, color: 'var(--accent-blue)' },
      { name: 'Insights Events', desc: 'Anomaly detection', icon: Eye, color: 'var(--accent-purple)' },
      { name: 'Multi-Region', desc: 'All regions covered', icon: Cloud, color: 'var(--color-success)' },
    ],
  },
  {
    title: 'Centralized S3 Bucket (Log Destination)',
    icon: HardDrive,
    nodes: [
      { name: 'S3 Bucket', desc: 'org-cloudtrail-central', icon: HardDrive, color: 'var(--accent-cyan)' },
      { name: 'S3 Versioning', desc: 'Immutable log storage', icon: Database, color: 'var(--accent-blue)' },
      { name: 'Lifecycle Policies', desc: '90d → IA, 365d → Glacier', icon: Activity, color: 'var(--accent-purple)' },
      { name: 'Bucket Policy', desc: 'Cross-account access', icon: Lock, color: 'var(--color-warning)' },
    ],
  },
  {
    title: 'Encryption (KMS)',
    icon: KeyRound,
    nodes: [
      { name: 'KMS CMK', desc: 'SSE-KMS encryption', icon: KeyRound, color: 'var(--accent-cyan)' },
      { name: 'Key Rotation', desc: 'Automatic annual rotation', icon: Activity, color: 'var(--color-success)' },
      { name: 'Key Policy', desc: 'Cross-account decrypt', icon: Lock, color: 'var(--accent-purple)' },
    ],
  },
  {
    title: 'Analytics & Monitoring',
    icon: Search,
    nodes: [
      { name: 'Amazon Athena', desc: 'SQL query on S3 logs', icon: Search, color: 'var(--accent-cyan)' },
      { name: 'QuickSight', desc: 'Visual dashboards', icon: BarChart3, color: 'var(--accent-blue)' },
      { name: 'CloudWatch', desc: 'Real-time alarms', icon: Activity, color: 'var(--color-warning)' },
      { name: 'CloudWatch Logs', desc: 'Log group integration', icon: FileSearch, color: 'var(--accent-purple)' },
    ],
  },
  {
    title: 'Security & Compliance',
    icon: ShieldCheck,
    nodes: [
      { name: 'GuardDuty', desc: 'Threat detection', icon: ShieldCheck, color: 'var(--color-danger)' },
      { name: 'Security Hub', desc: 'Compliance standards', icon: ShieldCheck, color: 'var(--accent-cyan)' },
      { name: 'AWS Config', desc: 'Resource compliance', icon: FileSearch, color: 'var(--color-warning)' },
      { name: 'SNS Notifications', desc: 'Alert delivery', icon: Activity, color: 'var(--color-success)' },
    ],
  },
];

export default function Architecture() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Architecture</h2>
        <p>Multi-Account CloudTrail Log Aggregation architecture flow</p>
      </div>

      <div className="arch-container">
        {layers.map((layer, i) => {
          const LayerIcon = layer.icon;
          return (
            <div key={i}>
              {i > 0 && (
                <div className="arch-arrow" style={{ padding: '8px 0' }}>
                  <ArrowDown size={24} />
                </div>
              )}
              <div className="arch-layer">
                <div className="arch-layer-title">
                  <LayerIcon size={16} />
                  {layer.title}
                </div>
                <div className="arch-nodes">
                  {layer.nodes.map((node, j) => {
                    const NodeIcon = node.icon;
                    return (
                      <div key={j} className="arch-node">
                        <div
                          className="arch-node-icon"
                          style={{ background: `${node.color}22`, color: node.color }}
                        >
                          <NodeIcon size={20} />
                        </div>
                        <div className="arch-node-name">{node.name}</div>
                        <div className="arch-node-desc">{node.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

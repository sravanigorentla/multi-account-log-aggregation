import { useState, useMemo } from 'react';
import { accounts, environmentSummary } from '../data/accounts';
import {
  Cloud, Server, Shield, CheckCircle, AlertTriangle, XCircle, Activity,
} from 'lucide-react';
import StatCard from '../components/StatCard';

const envColors = {
  Production: { border: 'var(--color-danger)', bg: 'var(--color-danger-dim)' },
  Testing: { border: 'var(--color-warning)', bg: 'var(--color-warning-dim)' },
  Development: { border: 'var(--accent-blue)', bg: 'var(--accent-blue-dim)' },
};

export default function Accounts() {
  const [activeEnv, setActiveEnv] = useState('All');

  const filteredAccounts = useMemo(() => {
    if (activeEnv === 'All') return accounts;
    return accounts.filter((a) => a.environment === activeEnv);
  }, [activeEnv]);

  const envs = ['All', 'Production', 'Testing', 'Development'];

  const formatDate = (iso) => {
    if (!iso) return 'Never';
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>AWS Accounts</h2>
        <p>Manage and monitor CloudTrail logging across all AWS accounts</p>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid">
        <StatCard icon={Cloud} iconColor="cyan" value={accounts.length} label="Total Accounts" />
        <StatCard icon={CheckCircle} iconColor="green" value={accounts.filter(a => a.cloudTrailEnabled).length} label="CloudTrail Enabled" />
        <StatCard icon={AlertTriangle} iconColor="yellow" value={accounts.filter(a => a.loggingStatus === 'Warning').length} label="Warnings" />
        <StatCard icon={XCircle} iconColor="red" value={accounts.filter(a => !a.cloudTrailEnabled).length} label="Trails Inactive" />
      </div>

      {/* Environment Tabs */}
      <div className="env-tabs">
        {envs.map((env) => (
          <button
            key={env}
            className={`env-tab ${activeEnv === env ? 'active' : ''}`}
            onClick={() => setActiveEnv(env)}
          >
            {env} {env !== 'All' && `(${environmentSummary[env]?.count || 0})`}
          </button>
        ))}
      </div>

      {/* Account Cards */}
      <div className="accounts-grid">
        {filteredAccounts.map((acct) => {
          const colors = envColors[acct.environment] || { border: 'var(--text-muted)', bg: 'rgba(100,116,139,0.15)' };
          return (
            <div key={acct.id} className="account-card">
              <div className="account-card-header">
                <div>
                  <div className="account-card-name">{acct.name}</div>
                  <div className="account-card-id">{acct.accountId}</div>
                </div>
                <span className="badge" style={{ background: colors.bg, color: colors.border }}>
                  {acct.environment}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span className={`status-dot ${acct.loggingStatus === 'Active' ? 'active' : acct.loggingStatus === 'Warning' ? 'warning' : 'inactive'}`} />
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: acct.loggingStatus === 'Active' ? 'var(--color-success)' : acct.loggingStatus === 'Warning' ? 'var(--color-warning)' : 'var(--text-muted)',
                }}>
                  {acct.cloudTrailEnabled ? `CloudTrail ${acct.loggingStatus}` : 'CloudTrail Disabled'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                <span className="badge badge-info">{acct.region}</span>
                <span className="badge badge-muted">{acct.owner}</span>
              </div>

              <div className="account-card-stats">
                <div className="account-stat">
                  <div className="account-stat-value">
                    {acct.eventCount > 0 ? acct.eventCount.toLocaleString() : '—'}
                  </div>
                  <div className="account-stat-label">Total Events</div>
                </div>
                <div className="account-stat">
                  <div className="account-stat-value">{formatDate(acct.lastEventTime)}</div>
                  <div className="account-stat-label">Last Event</div>
                </div>
              </div>

              {acct.s3Bucket && (
                <div style={{
                  marginTop: 12, padding: '8px 12px',
                  background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)',
                  fontSize: '0.7rem', color: 'var(--text-muted)',
                  fontFamily: 'monospace',
                }}>
                  <Server size={12} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  s3://{acct.s3Bucket}
                </div>
              )}

              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 12 }}>
                {acct.tags.map((tag) => (
                  <span key={tag} style={{
                    fontSize: '0.6rem', padding: '2px 8px',
                    background: 'var(--bg-elevated)', borderRadius: 12,
                    color: 'var(--text-muted)',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

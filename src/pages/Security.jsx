import { useState } from 'react';
import {
  ShieldAlert, ShieldCheck, AlertTriangle, AlertCircle, Info,
  Clock, Eye, CheckCircle, X,
} from 'lucide-react';
import { alerts, alertsSummary } from '../data/alerts';
import StatCard from '../components/StatCard';

const severityConfig = {
  critical: { color: 'var(--color-danger)', bg: 'var(--color-danger-dim)', icon: AlertCircle, label: 'Critical' },
  high: { color: '#f97316', bg: 'rgba(249,115,22,0.15)', icon: AlertTriangle, label: 'High' },
  medium: { color: 'var(--color-warning)', bg: 'var(--color-warning-dim)', icon: Info, label: 'Medium' },
  low: { color: 'var(--accent-cyan)', bg: 'var(--accent-cyan-dim)', icon: Info, label: 'Low' },
};

const statusConfig = {
  open: { color: 'var(--color-danger)', bg: 'var(--color-danger-dim)', label: 'Open' },
  investigating: { color: '#f97316', bg: 'rgba(249,115,22,0.15)', label: 'Investigating' },
  monitoring: { color: 'var(--color-warning)', bg: 'var(--color-warning-dim)', label: 'Monitoring' },
  resolved: { color: 'var(--color-success)', bg: 'var(--color-success-dim)', label: 'Resolved' },
};

export default function Security() {
  const [filter, setFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState(null);

  const filtered = filter === 'all'
    ? alerts
    : alerts.filter((a) => a.severity === filter || a.status === filter);

  const formatDate = (iso) => {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Security & Alerts</h2>
        <p>Monitor security events and threat alerts across all accounts</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard icon={AlertCircle} iconColor="red" value={alertsSummary.critical} label="Critical Alerts" />
        <StatCard icon={AlertTriangle} iconColor="yellow" value={alertsSummary.high} label="High Severity" />
        <StatCard icon={ShieldAlert} iconColor="cyan" value={alertsSummary.open} label="Open Alerts" />
        <StatCard icon={ShieldCheck} iconColor="green" value={alertsSummary.resolved} label="Resolved" />
      </div>

      {/* Filters */}
      <div className="env-tabs" style={{ marginBottom: 20 }}>
        {['all', 'critical', 'high', 'medium', 'low', 'open', 'resolved'].map((f) => (
          <button
            key={f}
            className={`env-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((alert) => {
          const sev = severityConfig[alert.severity];
          const stat = statusConfig[alert.status];
          const SevIcon = sev.icon;

          return (
            <div
              key={alert.id}
              className="account-card"
              style={{
                cursor: 'pointer',
                borderLeft: `3px solid ${sev.color}`,
              }}
              onClick={() => setSelectedAlert(alert)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius-md)',
                  background: sev.bg, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0,
                }}>
                  <SevIcon size={20} color={sev.color} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                      {alert.title}
                    </span>
                    <span className="badge" style={{ background: sev.bg, color: sev.color }}>
                      {sev.label}
                    </span>
                    <span className="badge" style={{ background: stat.bg, color: stat.color }}>
                      {stat.label}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: 10 }}>
                    {alert.description}
                  </p>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} /> {formatDate(alert.timestamp)}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Eye size={12} /> {alert.account}
                    </span>
                    <span className="badge badge-info">{alert.service}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="modal-overlay" onClick={() => setSelectedAlert(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>{selectedAlert.title}</h3>
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                  <span className="badge" style={{
                    background: severityConfig[selectedAlert.severity].bg,
                    color: severityConfig[selectedAlert.severity].color,
                  }}>
                    {severityConfig[selectedAlert.severity].label}
                  </span>
                  <span className="badge" style={{
                    background: statusConfig[selectedAlert.status].bg,
                    color: statusConfig[selectedAlert.status].color,
                  }}>
                    {statusConfig[selectedAlert.status].label}
                  </span>
                </div>
              </div>
              <button className="modal-close" onClick={() => setSelectedAlert(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Account</span>
                <span className="detail-value">{selectedAlert.account}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Account ID</span>
                <span className="detail-value" style={{ fontFamily: 'monospace' }}>{selectedAlert.accountId}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Service</span>
                <span className="detail-value">{selectedAlert.service}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Event</span>
                <span className="detail-value">{selectedAlert.eventName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Timestamp</span>
                <span className="detail-value">{formatDate(selectedAlert.timestamp)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Source</span>
                <span className="detail-value">{selectedAlert.source}</span>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div className="detail-label" style={{ marginBottom: 6 }}>Description</div>
              <p style={{
                color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6,
                background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', padding: 14,
              }}>
                {selectedAlert.description}
              </p>
            </div>

            <div>
              <div className="detail-label" style={{ marginBottom: 6 }}>Recommendation</div>
              <div style={{
                background: 'var(--accent-cyan-dim)',
                border: '1px solid rgba(6,182,212,0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                fontSize: '0.85rem',
                color: 'var(--accent-cyan)',
                lineHeight: 1.6,
              }}>
                {selectedAlert.recommendation}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

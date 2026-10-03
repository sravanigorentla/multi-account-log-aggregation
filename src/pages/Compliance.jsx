import { useState } from 'react';
import {
  ShieldCheck, TrendingUp, Clock, FileText,
  CheckCircle, XCircle, AlertTriangle,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { complianceFrameworks, auditLogs, complianceTrend } from '../data/compliance';
import StatCard from '../components/StatCard';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1a2236', border: '1px solid rgba(6,182,212,0.3)',
      borderRadius: 10, padding: '10px 14px', fontSize: '0.75rem',
    }}>
      <div style={{ color: '#94a3b8', marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {p.value}%
        </div>
      ))}
    </div>
  );
};

export default function Compliance() {
  const [selectedFramework, setSelectedFramework] = useState(null);

  const avgScore = Math.round(
    complianceFrameworks.reduce((sum, f) => sum + f.score, 0) / complianceFrameworks.length
  );
  const totalPassing = complianceFrameworks.reduce((sum, f) => sum + f.passing, 0);
  const totalControls = complianceFrameworks.reduce((sum, f) => sum + f.totalControls, 0);
  const totalFailing = complianceFrameworks.reduce((sum, f) => sum + f.failing, 0);

  const formatDate = (iso) => {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'var(--color-success)';
    if (score >= 80) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Compliance & Audit</h2>
        <p>Track compliance frameworks and audit activity across your AWS organization</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard icon={ShieldCheck} iconColor="green" value={`${avgScore}%`} label="Avg Compliance Score" trend="+5%" />
        <StatCard icon={CheckCircle} iconColor="cyan" value={totalPassing} label="Controls Passing" />
        <StatCard icon={XCircle} iconColor="red" value={totalFailing} label="Controls Failing" />
        <StatCard icon={TrendingUp} iconColor="purple" value={complianceFrameworks.length} label="Frameworks Tracked" />
      </div>

      {/* Compliance Trend Chart */}
      <div className="chart-card" style={{ marginBottom: 28 }}>
        <div className="chart-card-header">
          <div>
            <div className="chart-card-title">Compliance Score Trend</div>
            <div className="chart-card-subtitle">6-month compliance progression across frameworks</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={complianceTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis domain={[60, 100]} tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
            <Line type="monotone" dataKey="CIS" stroke="#06b6d4" strokeWidth={2} dot={false} name="CIS AWS" />
            <Line type="monotone" dataKey="SOC2" stroke="#3b82f6" strokeWidth={2} dot={false} name="SOC 2" />
            <Line type="monotone" dataKey="PCI" stroke="#f59e0b" strokeWidth={2} dot={false} name="PCI DSS" />
            <Line type="monotone" dataKey="HIPAA" stroke="#8b5cf6" strokeWidth={2} dot={false} name="HIPAA" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Framework Cards */}
      <div style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Compliance Frameworks</h3>
        <div className="accounts-grid">
          {complianceFrameworks.map((fw) => (
            <div
              key={fw.id}
              className="compliance-card"
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedFramework(selectedFramework?.id === fw.id ? null : fw)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{fw.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{fw.description}</div>
                </div>
              </div>

              {/* Score Circle */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20,
              }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: `conic-gradient(${getScoreColor(fw.score)} ${fw.score * 3.6}deg, var(--bg-primary) 0deg)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'var(--bg-card)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column',
                  }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: getScoreColor(fw.score) }}>
                      {fw.score}
                    </span>
                    <span style={{ fontSize: '0.5rem', color: 'var(--text-muted)' }}>SCORE</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-success)', fontSize: '1.1rem' }}>{fw.passing}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Passing</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-danger)', fontSize: '1.1rem' }}>{fw.failing}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Failing</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '1.1rem' }}>{fw.notApplicable}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>N/A</div>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="compliance-categories">
                {fw.categories.map((cat, i) => (
                  <div key={i} className="compliance-category">
                    <div className="compliance-category-header">
                      <span className="compliance-category-name">{cat.name}</span>
                      <span className="compliance-category-score">{cat.score}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className={`progress-bar-fill ${cat.score >= 90 ? 'green' : cat.score >= 80 ? 'yellow' : 'red'}`}
                        style={{ width: `${cat.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                marginTop: 16, fontSize: '0.7rem', color: 'var(--text-muted)',
              }}>
                <Clock size={12} />
                Last audit: {formatDate(fw.lastAudit)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="table-card">
        <div className="table-card-header">
          <span className="table-card-title">Recent Audit Activity</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>Framework</th>
                <th>Initiated By</th>
                <th>Result</th>
                <th>Findings</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {formatDate(log.timestamp)}
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{log.action}</td>
                  <td><span className="badge badge-info">{log.framework}</span></td>
                  <td>{log.user}</td>
                  <td><span className="badge badge-success">{log.result}</span></td>
                  <td>
                    {log.findings > 0 ? (
                      <span className="badge badge-warning">{log.findings} findings</span>
                    ) : (
                      <span className="badge badge-success">Clean</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

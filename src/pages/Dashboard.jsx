import { useState } from 'react';
import {
  Cloud, Activity, Database, ShieldAlert, CheckCircle, AlertTriangle,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import StatCard from '../components/StatCard';
import EventDetailModal from '../components/EventDetailModal';
import { dashboardStats, eventVolumeByHour, eventsByService, eventsByAccount, weeklyTrend } from '../data/dashboardData';
import { recentEvents } from '../data/cloudtrailEvents';

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
          {p.name}: {p.value.toLocaleString()}
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h2>Dashboard</h2>
            <p>Multi-Account CloudTrail Log Aggregation Overview</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="status-dot active" />
            <span style={{ fontSize: '0.8rem', color: 'var(--color-success)', fontWeight: 600 }}>
              All Systems Operational
            </span>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <StatCard
          icon={Cloud} iconColor="cyan"
          value={dashboardStats.totalAccounts} label="AWS Accounts"
          trend="+2 this month" trendDir="up"
        />
        <StatCard
          icon={Activity} iconColor="blue"
          value={dashboardStats.totalEvents.toLocaleString()} label="CloudTrail Events"
          trend="+12.5%" trendDir="up"
        />
        <StatCard
          icon={Database} iconColor="purple"
          value={dashboardStats.logsCollected} label="Logs Collected"
          trend="+340 GB" trendDir="up"
        />
        <StatCard
          icon={ShieldAlert} iconColor="red"
          value={dashboardStats.securityAlerts} label="Security Alerts"
          trend={`${dashboardStats.criticalAlerts} critical`} trendDir="down"
        />
        <StatCard
          icon={CheckCircle} iconColor="green"
          value={`${dashboardStats.trailsActive}/${dashboardStats.trailsTotal}`} label="CloudTrail Active"
          trend="1 inactive" trendDir="down"
        />
        <StatCard
          icon={AlertTriangle} iconColor="yellow"
          value={`${dashboardStats.complianceScore}%`} label="Compliance Score"
          trend="+5% vs last month" trendDir="up"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Event Volume (24h)</div>
              <div className="chart-card-subtitle">CloudTrail events by hour</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={eventVolumeByHour}>
              <defs>
                <linearGradient id="gradEvents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradErrors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
              <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} width={50} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="events" stroke="#06b6d4" fill="url(#gradEvents)" strokeWidth={2} name="Events" />
              <Area type="monotone" dataKey="errors" stroke="#ef4444" fill="url(#gradErrors)" strokeWidth={2} name="Errors" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Events by Service</div>
              <div className="chart-card-subtitle">Distribution across AWS services</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={eventsByService}
                cx="50%" cy="50%"
                innerRadius={60} outerRadius={95}
                paddingAngle={3}
                dataKey="value"
              >
                {eventsByService.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value}%`, name]}
                contentStyle={{
                  background: '#1a2236', border: '1px solid rgba(6,182,212,0.3)',
                  borderRadius: 10, fontSize: '0.75rem',
                }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: '0.7rem', color: '#94a3b8' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="charts-grid-equal">
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Events by Account</div>
              <div className="chart-card-subtitle">Today's activity per AWS account</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={eventsByAccount} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="account" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} width={90} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="events" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={14} name="Events" />
              <Bar dataKey="errors" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={14} name="Errors" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Weekly Trend</div>
              <div className="chart-card-subtitle">Events and alerts this week</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar yAxisId="left" dataKey="events" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={24} name="Events" />
              <Bar yAxisId="right" dataKey="alerts" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={24} name="Alerts" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Events Table */}
      <div className="table-card">
        <div className="table-card-header">
          <span className="table-card-title">Recent CloudTrail Events</span>
          <span className="badge badge-info">{recentEvents.length} latest</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Account</th>
                <th>User</th>
                <th>Event</th>
                <th>Service</th>
                <th>Source IP</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.map((evt) => (
                <tr key={evt.id} className="clickable" onClick={() => setSelectedEvent(evt)}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {formatTime(evt.timestamp)}
                  </td>
                  <td>{evt.account}</td>
                  <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {evt.userName}
                  </td>
                  <td style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{evt.eventName}</td>
                  <td><span className="badge badge-info">{evt.awsService}</span></td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{evt.sourceIPAddress}</td>
                  <td>
                    {evt.errorCode ? (
                      <span className="badge badge-danger">{evt.errorCode}</span>
                    ) : (
                      <span className="badge badge-success">Success</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedEvent && (
        <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}

export default function StatCard({ icon: Icon, iconColor, value, label, trend, trendDir }) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className={`stat-card-icon ${iconColor}`}>
          <Icon size={20} />
        </div>
        {trend && (
          <span className={`stat-card-trend ${trendDir || 'up'}`}>{trend}</span>
        )}
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
}

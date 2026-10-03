import { X } from 'lucide-react';

export default function EventDetailModal({ event, onClose }) {
  if (!event) return null;

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>{event.eventName}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>
              {event.awsService} · {event.account}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Event ID</span>
            <span className="detail-value" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
              {event.requestId}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Timestamp</span>
            <span className="detail-value">{formatDate(event.timestamp)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Account</span>
            <span className="detail-value">{event.account}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Account ID</span>
            <span className="detail-value" style={{ fontFamily: 'monospace' }}>{event.accountId}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">User / Principal</span>
            <span className="detail-value">{event.userName}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">AWS Service</span>
            <span className="detail-value">{event.awsService}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Event Source</span>
            <span className="detail-value">{event.eventSource}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Region</span>
            <span className="detail-value">{event.awsRegion}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Source IP</span>
            <span className="detail-value">{event.sourceIPAddress}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">User Agent</span>
            <span className="detail-value">{event.userAgent}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Read Only</span>
            <span className="detail-value">{event.readOnly ? 'Yes' : 'No'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Status</span>
            <span className="detail-value">
              {event.errorCode ? (
                <span className="badge badge-danger">{event.errorCode}</span>
              ) : (
                <span className="badge badge-success">Success</span>
              )}
            </span>
          </div>
        </div>

        {event.errorMessage && (
          <div style={{ marginBottom: 20 }}>
            <div className="detail-label" style={{ marginBottom: 6 }}>Error Message</div>
            <div style={{
              background: 'var(--color-danger-dim)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              fontSize: '0.8rem',
              color: '#fca5a5',
            }}>
              {event.errorMessage}
            </div>
          </div>
        )}

        {event.resources && event.resources.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div className="detail-label" style={{ marginBottom: 8 }}>Resources</div>
            {event.resources.map((r, i) => (
              <div key={i} style={{
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                fontSize: '0.8rem',
                marginBottom: 4,
              }}>
                <span style={{ color: 'var(--text-muted)' }}>{r.type}:</span>{' '}
                <span style={{ color: 'var(--accent-cyan)' }}>{r.name}</span>
              </div>
            ))}
          </div>
        )}

        {event.requestParameters && Object.keys(event.requestParameters).length > 0 && (
          <div>
            <div className="detail-label" style={{ marginBottom: 8 }}>Request Parameters</div>
            <pre style={{
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              fontSize: '0.75rem',
              color: 'var(--accent-cyan)',
              overflowX: 'auto',
              border: '1px solid var(--border-color)',
            }}>
              {JSON.stringify(event.requestParameters, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

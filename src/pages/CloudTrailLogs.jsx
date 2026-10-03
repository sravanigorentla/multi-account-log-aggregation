import { useState, useMemo } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { cloudTrailEvents } from '../data/cloudtrailEvents';
import EventDetailModal from '../components/EventDetailModal';

const PAGE_SIZE = 20;

export default function CloudTrailLogs() {
  const [search, setSearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [accountFilter, setAccountFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const services = useMemo(() => {
    const s = new Set(cloudTrailEvents.map((e) => e.awsService));
    return ['All', ...Array.from(s).sort()];
  }, []);

  const accountNames = useMemo(() => {
    const a = new Set(cloudTrailEvents.map((e) => e.account));
    return ['All', ...Array.from(a).sort()];
  }, []);

  const filtered = useMemo(() => {
    return cloudTrailEvents.filter((evt) => {
      if (serviceFilter !== 'All' && evt.awsService !== serviceFilter) return false;
      if (statusFilter === 'Success' && evt.errorCode) return false;
      if (statusFilter === 'Error' && !evt.errorCode) return false;
      if (accountFilter !== 'All' && evt.account !== accountFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          evt.eventName.toLowerCase().includes(q) ||
          evt.userName.toLowerCase().includes(q) ||
          evt.sourceIPAddress.toLowerCase().includes(q) ||
          evt.account.toLowerCase().includes(q) ||
          evt.awsService.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, serviceFilter, statusFilter, accountFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
  };

  const handlePageChange = (newPage) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  // Reset page when filters change
  const handleSearch = (val) => { setSearch(val); setPage(1); };
  const handleServiceFilter = (val) => { setServiceFilter(val); setPage(1); };
  const handleStatusFilter = (val) => { setStatusFilter(val); setPage(1); };
  const handleAccountFilter = (val) => { setAccountFilter(val); setPage(1); };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h2>CloudTrail Logs</h2>
            <p>Search and analyze CloudTrail events across all AWS accounts</p>
          </div>
          <button className="btn btn-outline">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="table-card" style={{ marginBottom: 0 }}>
        <div className="table-card-header" style={{ flexWrap: 'wrap' }}>
          <div className="search-bar">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search events, users, IPs..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select
              className="filter-select"
              value={accountFilter}
              onChange={(e) => handleAccountFilter(e.target.value)}
            >
              {accountNames.map((a) => (
                <option key={a} value={a}>{a === 'All' ? 'All Accounts' : a}</option>
              ))}
            </select>
            <select
              className="filter-select"
              value={serviceFilter}
              onChange={(e) => handleServiceFilter(e.target.value)}
            >
              {services.map((s) => (
                <option key={s} value={s}>{s === 'All' ? 'All Services' : s}</option>
              ))}
            </select>
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Success">Success</option>
              <option value="Error">Error</option>
            </select>
          </div>
        </div>

        {/* Results info */}
        <div style={{
          padding: '10px 20px',
          borderBottom: '1px solid var(--border-color)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <span>Showing {paginated.length} of {filtered.length} events</span>
          <span>{filtered.filter(e => e.errorCode).length} errors found</span>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Account</th>
                <th>User / Principal</th>
                <th>Event Name</th>
                <th>AWS Service</th>
                <th>Source IP</th>
                <th>Region</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">
                      <Filter size={32} />
                      <p>No events match your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((evt) => (
                  <tr key={evt.id} className="clickable" onClick={() => setSelectedEvent(evt)}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {formatTime(evt.timestamp)}
                    </td>
                    <td style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {evt.account}
                    </td>
                    <td style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {evt.userName}
                    </td>
                    <td style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
                      {evt.eventName}
                    </td>
                    <td><span className="badge badge-info">{evt.awsService}</span></td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {evt.sourceIPAddress}
                    </td>
                    <td><span className="badge badge-muted">{evt.awsRegion}</span></td>
                    <td>
                      {evt.errorCode ? (
                        <span className="badge badge-danger">{evt.errorCode}</span>
                      ) : (
                        <span className="badge badge-success">Success</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <span className="pagination-info">
              Page {page} of {totalPages}
            </span>
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let num;
                if (totalPages <= 5) {
                  num = i + 1;
                } else if (page <= 3) {
                  num = i + 1;
                } else if (page >= totalPages - 2) {
                  num = totalPages - 4 + i;
                } else {
                  num = page - 2 + i;
                }
                return (
                  <button
                    key={num}
                    className={`pagination-btn ${page === num ? 'active' : ''}`}
                    onClick={() => handlePageChange(num)}
                  >
                    {num}
                  </button>
                );
              })}
              <button
                className="pagination-btn"
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedEvent && (
        <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}

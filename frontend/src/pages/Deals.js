import { useState, useEffect } from 'react';
import { Plus, Trash2, Handshake, X, DollarSign } from 'lucide-react';
import { api } from '../utils/api';

const PLATFORMS = ['Twitter/X', 'Instagram', 'YouTube', 'Newsletter', 'TikTok', 'LinkedIn', 'Podcast'];
const STATUSES = ['negotiating', 'active', 'ongoing', 'completed'];
const TYPES = ['Sponsored Post', 'Newsletter Sponsorship', 'Affiliate', 'Ambassador', 'Product Review', 'Consulting'];

const STATUS_LABELS = {
  negotiating: 'tag-negotiating',
  active: 'tag-active',
  ongoing: 'tag-ongoing',
  completed: 'tag-completed'
};

export default function Deals({ showToast }) {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ brand: '', type: 'Sponsored Post', value: '', platform: 'Instagram', status: 'negotiating', dueDate: '', notes: '' });

  const load = () => api.get('/deals').then(d => { setDeals(d); setLoading(false); });
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.brand.trim()) return;
    await api.post('/deals', { ...form, value: parseFloat(form.value) || 0 });
    setForm({ brand: '', type: 'Sponsored Post', value: '', platform: 'Instagram', status: 'negotiating', dueDate: '', notes: '' });
    setShowModal(false);
    load();
    showToast('Deal added!');
  };

  const del = async (id) => {
    await api.del(`/deals/${id}`);
    load();
    showToast('Deal removed', 'error');
  };

  const updateStatus = async (id, status) => {
    await api.put(`/deals/${id}`, { status });
    load();
  };

  const pipeline = deals.filter(d => d.status === 'active' || d.status === 'negotiating').reduce((a, b) => a + b.value, 0);
  const earned = deals.filter(d => d.status === 'completed').reduce((a, b) => a + b.value, 0);

  const fmtDate = (d) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) return <div className="loading"><div className="spinner" />Loading deals...</div>;

  return (
    <>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <div className="page-title">Brand Deals</div>
            <div className="page-subtitle">Manage your partnerships, sponsorships, and affiliate deals.</div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={14} />Add Deal
          </button>
        </div>
      </div>

      <div className="page-content">
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 28 }}>
          <div className="stat-card accent">
            <div className="stat-label"><DollarSign size={12} />Pipeline Value</div>
            <div className="stat-value">${pipeline.toLocaleString()}</div>
            <div className="stat-change neutral">{deals.filter(d => d.status === 'negotiating' || d.status === 'active').length} active deals</div>
          </div>
          <div className="stat-card success">
            <div className="stat-label"><DollarSign size={12} />Completed Deals</div>
            <div className="stat-value">${earned.toLocaleString()}</div>
            <div className="stat-change neutral">{deals.filter(d => d.status === 'completed').length} completed</div>
          </div>
          <div className="stat-card accent3">
            <div className="stat-label"><Handshake size={12} />Total Deals</div>
            <div className="stat-value">{deals.length}</div>
            <div className="stat-change neutral">across all platforms</div>
          </div>
        </div>

        <div className="deals-grid">
          {deals.map(deal => (
            <div key={deal.id} className="deal-card">
              <div className="deal-card-top">
                <div>
                  <div className="deal-brand">{deal.brand}</div>
                  <div className="deal-type">{deal.type}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="deal-value">${deal.value?.toLocaleString()}</div>
                  <span className={`tag ${STATUS_LABELS[deal.status] || 'tag-draft'}`}>{deal.status}</span>
                </div>
              </div>

              {deal.notes && (
                <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.5, marginBottom: 8 }}>{deal.notes}</div>
              )}

              <div className="deal-meta">
                <span className="platform-pill">{deal.platform}</span>
                {deal.dueDate && (
                  <span style={{ fontSize: 11, color: 'var(--text3)' }}>Due: {fmtDate(deal.dueDate)}</span>
                )}
              </div>

              <div className="deal-actions">
                <select
                  value={deal.status}
                  onChange={e => updateStatus(deal.id, e.target.value)}
                  style={{ fontSize: 11, padding: '4px 8px', width: 'auto', flex: 1 }}
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button className="btn btn-ghost" style={{ padding: '5px 8px' }} onClick={() => del(deal.id)}>
                  <Trash2 size={12} style={{ color: 'var(--danger)' }} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {deals.length === 0 && (
          <div className="empty-state">
            <Handshake size={40} style={{ margin: '0 auto 12px', color: 'var(--text3)' }} />
            <h3>No deals yet</h3>
            <p>Add your first brand deal or sponsorship to track it here.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-title">
              <span><Handshake size={16} style={{ marginRight: 8, verticalAlign: 'middle', color: 'var(--accent)' }} />New Deal</span>
              <button className="btn btn-ghost" style={{ padding: '4px' }} onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-form">
              <div className="grid-2">
                <div className="form-group">
                  <label>Brand Name *</label>
                  <input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} placeholder="e.g. Notion, Adobe..." autoFocus />
                </div>
                <div className="form-group">
                  <label>Deal Value ($)</label>
                  <input type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} placeholder="0" />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Deal Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    {TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Platform</label>
                  <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}>
                    {PLATFORMS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Deliverables, terms, contacts..." />
              </div>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={create}>Save Deal</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

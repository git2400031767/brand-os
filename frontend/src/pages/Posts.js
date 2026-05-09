import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, X, CheckCircle, Clock } from 'lucide-react';
import { api } from '../utils/api';

const PLATFORMS = ['Twitter/X', 'Instagram', 'YouTube', 'Newsletter', 'TikTok', 'LinkedIn'];
const STATUS_MAP = { scheduled: 'tag-scheduled', published: 'tag-published', draft: 'tag-draft' };

export default function Posts({ showToast }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', platform: 'Twitter/X', content: '', scheduledAt: '', status: 'scheduled' });

  const load = () => api.get('/posts').then(d => { setPosts(d); setLoading(false); });
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.title.trim()) return;
    await api.post('/posts', form);
    setForm({ title: '', platform: 'Twitter/X', content: '', scheduledAt: '', status: 'scheduled' });
    setShowModal(false);
    load();
    showToast('Post scheduled!');
  };

  const del = async (id) => {
    await api.del(`/posts/${id}`);
    load();
    showToast('Post removed', 'error');
  };

  const markPublished = async (id) => {
    await api.put(`/posts/${id}`, { status: 'published' });
    load();
    showToast('Marked as published!');
  };

  const fmtDate = (d) => {
    if (!d) return '—';
    const dt = new Date(d);
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const upcoming = posts.filter(p => p.status === 'scheduled');
  const published = posts.filter(p => p.status === 'published');

  if (loading) return <div className="loading"><div className="spinner" />Loading content queue...</div>;

  return (
    <>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <div className="page-title">Content Queue</div>
            <div className="page-subtitle">Schedule and track your posts across all platforms.</div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={14} />Schedule Post
          </button>
        </div>
      </div>

      <div className="page-content">
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <div className="stat-card accent" style={{ flex: 1, padding: '16px 20px' }}>
            <div className="stat-label"><Clock size={12} />Upcoming</div>
            <div className="stat-value" style={{ fontSize: 24 }}>{upcoming.length}</div>
          </div>
          <div className="stat-card success" style={{ flex: 1, padding: '16px 20px' }}>
            <div className="stat-label"><CheckCircle size={12} />Published</div>
            <div className="stat-value" style={{ fontSize: 24 }}>{published.length}</div>
          </div>
        </div>

        {upcoming.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div className="section-header">
              <div className="section-title"><Calendar />Scheduled</div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Platform</th>
                    <th>Scheduled For</th>
                    <th>Content</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {upcoming.map(post => (
                    <tr key={post.id}>
                      <td>{post.title}</td>
                      <td><span className="platform-pill">{post.platform}</span></td>
                      <td style={{ color: 'var(--accent)', fontWeight: 500 }}>{fmtDate(post.scheduledAt)}</td>
                      <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.content}</td>
                      <td><span className={`tag ${STATUS_MAP[post.status]}`}>{post.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: 11 }} onClick={() => markPublished(post.id)}>
                            <CheckCircle size={11} />Publish
                          </button>
                          <button className="btn btn-ghost" style={{ padding: '5px 8px' }} onClick={() => del(post.id)}>
                            <Trash2 size={12} style={{ color: 'var(--danger)' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {published.length > 0 && (
          <div>
            <div className="section-header">
              <div className="section-title"><CheckCircle />Published</div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Platform</th>
                    <th>Published At</th>
                    <th>Views</th>
                    <th>Clicks</th>
                    <th>Rate</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {published.map(post => (
                    <tr key={post.id}>
                      <td>{post.title}</td>
                      <td><span className="platform-pill">{post.platform}</span></td>
                      <td>{fmtDate(post.scheduledAt)}</td>
                      <td>{post.engagement?.views?.toLocaleString() || '—'}</td>
                      <td>{post.engagement?.clicks?.toLocaleString() || '—'}</td>
                      <td style={{ color: 'var(--success)' }}>{post.engagement?.rate || '—'}</td>
                      <td>
                        <button className="btn btn-ghost" style={{ padding: '5px 8px' }} onClick={() => del(post.id)}>
                          <Trash2 size={12} style={{ color: 'var(--danger)' }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {posts.length === 0 && (
          <div className="empty-state">
            <Calendar size={40} style={{ margin: '0 auto 12px', color: 'var(--text3)' }} />
            <h3>No posts yet</h3>
            <p>Schedule your first piece of content to get started.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-title">
              <span><Calendar size={16} style={{ marginRight: 8, verticalAlign: 'middle', color: 'var(--accent)' }} />Schedule a Post</span>
              <button className="btn btn-ghost" style={{ padding: '4px' }} onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-form">
              <div className="form-group">
                <label>Post Title *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Post title or working title..." autoFocus />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Platform</label>
                  <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}>
                    {PLATFORMS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Schedule Date/Time</label>
                  <input type="datetime-local" value={form.scheduledAt} onChange={e => setForm({ ...form, scheduledAt: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Content / Notes</label>
                <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Draft text, key points, or link to script..." />
              </div>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={create}>Schedule</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

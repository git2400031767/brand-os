import { useState, useEffect } from 'react';
import { Plus, Trash2, Lightbulb, X } from 'lucide-react';
import { api } from '../utils/api';

const STATUSES = ['draft', 'in-progress', 'ready'];

const STATUS_LABELS = {
  draft: '💡 Draft',
  'in-progress': '⚡ In Progress',
  ready: '✅ Ready'
};

const PLATFORMS = [
  'Twitter/X',
  'Instagram',
  'YouTube',
  'Newsletter',
  'TikTok',
  'LinkedIn',
  'Podcast'
];

export default function Ideas({ showToast }) {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: '',
    platform: 'Twitter/X',
    notes: '',
    tags: ''
  });

  // LOAD IDEAS
  const load = () =>
    api.get('/ideas').then((d) => {
      setIdeas(d);
      setLoading(false);
    });

  useEffect(() => {
    load();
  }, []);

  // CREATE IDEA
  const create = async () => {
    if (!form.title.trim()) return;

    const tags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    await api.post('/ideas', {
      ...form,
      tags
    });

    setForm({
      title: '',
      platform: 'Twitter/X',
      notes: '',
      tags: ''
    });

    setShowModal(false);
    load();

    showToast('Idea saved!');
  };

  // UPDATE STATUS
  const updateStatus = async (id, status) => {
    await api.put(`/ideas/${id}`, { status });
    load();
  };

  // DELETE IDEA
  const del = async (id) => {
    await api.del(`/ideas/${id}`);
    load();

    showToast('Idea deleted', 'error');
  };

  const byStatus = (s) =>
    ideas.filter((i) => i.status === s);

  if (loading)
    return (
      <div className="loading">
        <div className="spinner" />
        Loading ideas...
      </div>
    );

  return (
    <>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <div className="page-title">Ideas Board</div>

            <div className="page-subtitle">
              Capture, develop, and ship your content ideas.
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <Plus size={14} />
            New Idea
          </button>
        </div>
      </div>

      <div className="page-content">
        <div className="kanban">
          {STATUSES.map((status) => (
            <div key={status} className="kanban-col">

              <div className="kanban-col-header">
                <div className="kanban-col-title">
                  {STATUS_LABELS[status]}
                </div>

                <span className="kanban-count">
                  {byStatus(status).length}
                </span>
              </div>

              {byStatus(status).length === 0 && (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '32px 16px',
                    color: 'var(--text3)',
                    fontSize: 13
                  }}
                >
                  No ideas here yet
                </div>
              )}

              {byStatus(status).map((idea) => (
                <div key={idea._id} className="idea-card">

                  <div className="idea-card-title">
                    {idea.title}
                  </div>

                  {idea.notes && (
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--text3)',
                        marginBottom: 8,
                        lineHeight: 1.5
                      }}
                    >
                      {idea.notes}
                    </div>
                  )}

                  <div className="idea-tags">
                    {idea.tags?.map((t) => (
                      <span key={t} className="idea-tag">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div
                    className="idea-card-meta"
                    style={{ marginTop: 10 }}
                  >
                    <span className="platform-pill">
                      {idea.platform}
                    </span>

                    <div
                      style={{
                        display: 'flex',
                        gap: 6,
                        marginLeft: 'auto'
                      }}
                    >
                      <select
                        value={idea.status}
                        onChange={(e) =>
                          updateStatus(
                            idea._id,
                            e.target.value
                          )
                        }
                        style={{
                          fontSize: 11,
                          padding: '3px 6px',
                          width: 'auto',
                          cursor: 'pointer'
                        }}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                      <button
                        className="btn btn-ghost"
                        style={{ padding: '3px 6px' }}
                        onClick={() => del(idea._id)}
                      >
                        <Trash2
                          size={12}
                          style={{ color: 'var(--danger)' }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) =>
            e.target === e.currentTarget &&
            setShowModal(false)
          }
        >
          <div className="modal">

            <div className="modal-title">
              <span>
                <Lightbulb
                  size={16}
                  style={{
                    marginRight: 8,
                    verticalAlign: 'middle',
                    color: 'var(--accent)'
                  }}
                />
                New Idea
              </span>

              <button
                className="btn btn-ghost"
                style={{ padding: '4px' }}
                onClick={() => setShowModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-form">

              <div className="form-group">
                <label>Idea Title *</label>

                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value
                    })
                  }
                  placeholder="e.g. How I grew to 10k followers..."
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Platform</label>

                <select
                  value={form.platform}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      platform: e.target.value
                    })
                  }
                >
                  {PLATFORMS.map((p) => (
                    <option key={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Notes</label>

                <textarea
                  value={form.notes}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      notes: e.target.value
                    })
                  }
                  placeholder="Key points, angles, or references..."
                />
              </div>

              <div className="form-group">
                <label>Tags (comma-separated)</label>

                <input
                  value={form.tags}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tags: e.target.value
                    })
                  }
                  placeholder="e.g. growth, strategy, tutorial"
                />
              </div>

              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  onClick={create}
                >
                  Save Idea
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
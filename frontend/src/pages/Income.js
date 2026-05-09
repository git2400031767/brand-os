import { useState, useEffect } from 'react';
import { Plus, Trash2, DollarSign, X, TrendingUp } from 'lucide-react';
import { api } from '../utils/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

const CATEGORIES = ['brand-deals', 'products', 'affiliate', 'services', 'other'];
const CAT_LABELS = { 'brand-deals': 'Sponsorships', 'products': 'Digital Products', 'affiliate': 'Affiliate', 'services': 'Services', 'other': 'Other' };
const CAT_COLORS = { 'brand-deals': '#E8FF47', 'products': '#7B61FF', 'affiliate': '#4ADE80', 'services': '#FF6B35', 'other': '#9090A8' };

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.fill || p.color }}>${p.value?.toLocaleString()}</div>
      ))}
    </div>
  );
};

export default function Income({ showToast }) {
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ source: '', amount: '', month: 'May 2025', category: 'brand-deals' });

  const load = () => api.get('/income').then(d => { setIncome(d); setLoading(false); });
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.source.trim() || !form.amount) return;
    await api.post('/income', { ...form, amount: parseFloat(form.amount) });
    setForm({ source: '', amount: '', month: 'May 2025', category: 'brand-deals' });
    setShowModal(false);
    load();
    showToast('Income entry added!');
  };

  const del = async (id) => {
    await api.del(`/income/${id}`);
    load();
    showToast('Entry removed', 'error');
  };

  const months = [...new Set(income.map(i => i.month))];
  const latestMonth = months[0] || 'May 2025';
  const thisMonth = income.filter(i => i.month === latestMonth);
  const totalThisMonth = thisMonth.reduce((a, b) => a + b.amount, 0);
  const totalAllTime = income.reduce((a, b) => a + b.amount, 0);

  // Donut data by category
  const byCat = {};
  thisMonth.forEach(i => {
    byCat[i.category] = (byCat[i.category] || 0) + i.amount;
  });
  const pieData = Object.entries(byCat).map(([cat, val]) => ({ name: CAT_LABELS[cat] || cat, value: val, cat }));

  // Bar data by month
  const byMonth = {};
  income.forEach(i => {
    byMonth[i.month] = (byMonth[i.month] || 0) + i.amount;
  });
  const barData = Object.entries(byMonth).reverse().map(([month, total]) => ({ month, total }));

  if (loading) return <div className="loading"><div className="spinner" />Loading income...</div>;

  return (
    <>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <div className="page-title">Income Tracker</div>
            <div className="page-subtitle">Track every revenue stream from your creator business.</div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={14} />Add Income
          </button>
        </div>
      </div>

      <div className="page-content">
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 28 }}>
          <div className="stat-card accent">
            <div className="stat-label"><DollarSign size={12} />This Month</div>
            <div className="stat-value">${totalThisMonth.toLocaleString()}</div>
            <div className="stat-change neutral">{latestMonth}</div>
          </div>
          <div className="stat-card success">
            <div className="stat-label"><TrendingUp size={12} />All-Time Revenue</div>
            <div className="stat-value">${totalAllTime.toLocaleString()}</div>
            <div className="stat-change neutral">{months.length} months tracked</div>
          </div>
          <div className="stat-card accent3">
            <div className="stat-label"><DollarSign size={12} />Revenue Streams</div>
            <div className="stat-value">{Object.keys(byCat).length}</div>
            <div className="stat-change neutral">active this month</div>
          </div>
        </div>

        <div className="income-summary">
          <div className="income-donut-wrap">
            <div className="section-title" style={{ marginBottom: 16 }}>Income Breakdown</div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={CAT_COLORS[entry.cat] || '#ccc'} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="income-legend">
              {pieData.map(({ name, value, cat }) => (
                <div key={cat} className="income-legend-item">
                  <div className="income-legend-label">
                    <span className="income-dot" style={{ background: CAT_COLORS[cat] }} />
                    {name}
                  </div>
                  <span className="income-legend-value">${value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="income-bar-chart">
            <div className="section-title" style={{ marginBottom: 16 }}>Monthly Revenue</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="section-header" style={{ marginBottom: 14 }}>
          <div className="section-title"><DollarSign />All Entries</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Source</th>
                <th>Category</th>
                <th>Month</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {income.map(entry => (
                <tr key={entry.id}>
                  <td>{entry.source}</td>
                  <td>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      fontSize: 12, color: 'var(--text2)'
                    }}>
                      <span className="income-dot" style={{ background: CAT_COLORS[entry.category] }} />
                      {CAT_LABELS[entry.category] || entry.category}
                    </span>
                  </td>
                  <td>{entry.month}</td>
                  <td style={{ color: 'var(--accent)', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                    ${entry.amount?.toLocaleString()}
                  </td>
                  <td>
                    <button className="btn btn-ghost" style={{ padding: '5px 8px' }} onClick={() => del(entry.id)}>
                      <Trash2 size={12} style={{ color: 'var(--danger)' }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-title">
              <span><DollarSign size={16} style={{ marginRight: 8, verticalAlign: 'middle', color: 'var(--accent)' }} />Log Income</span>
              <button className="btn btn-ghost" style={{ padding: '4px' }} onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-form">
              <div className="form-group">
                <label>Source *</label>
                <input value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} placeholder="e.g. Notion Sponsorship, Gumroad Sales..." autoFocus />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Amount ($)</label>
                  <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0" />
                </div>
                <div className="form-group">
                  <label>Month</label>
                  <input value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} placeholder="e.g. May 2025" />
                </div>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
                </select>
              </div>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={create}>Log Income</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

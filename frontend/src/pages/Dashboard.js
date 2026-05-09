import { useEffect, useState } from 'react';
import { Users, DollarSign, Handshake, Calendar, TrendingUp, Lightbulb, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { api } from '../utils/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const GROWTH_DATA_MOCK = [
  { month: 'Jan', followers: 10200, income: 5200 },
  { month: 'Feb', followers: 11800, income: 6100 },
  { month: 'Mar', followers: 13400, income: 7400 },
  { month: 'Apr', followers: 15300, income: 7520 },
  { month: 'May', followers: 14540, income: 8540 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
      <div style={{ color: 'var(--text3)', marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {p.dataKey === 'income' ? '$' : ''}{p.value?.toLocaleString()}
        </div>
      ))}
    </div>
  );
};

export default function Dashboard({ showToast }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard').then(d => { setStats(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="spinner" /><span>Loading your dashboard...</span></div>;
  if (!stats) return <div className="loading">Could not connect to API. Is the backend running?</div>;

  const STAT_CARDS = [
    { label: 'Total Followers', value: stats.totalFollowers?.toLocaleString(), icon: Users, change: '+12.4%', up: true, variant: 'accent' },
    { label: 'Monthly Income', value: `$${stats.monthlyIncome?.toLocaleString()}`, icon: DollarSign, change: `${stats.incomeGrowth}%`, up: parseFloat(stats.incomeGrowth) >= 0, variant: 'success' },
    { label: 'Active Deals', value: stats.activeDeals, icon: Handshake, change: `$${stats.pendingDealsValue?.toLocaleString()} pipeline`, up: true, variant: 'accent2' },
    { label: 'Scheduled Posts', value: stats.scheduledPosts, icon: Calendar, change: `${stats.ideasReady} ideas ready`, up: true, variant: 'accent3' },
  ];

  return (
    <>
      <div className="page-header">
        <div className="page-title">Good morning ✦</div>
        <div className="page-subtitle">Here's what's happening with your brand today.</div>
      </div>
      <div className="page-content">
        <div className="stats-grid">
          {STAT_CARDS.map(({ label, value, icon: Icon, change, up, variant }) => (
            <div key={label} className={`stat-card ${variant}`}>
              <div className="stat-label"><Icon size={13} />{label}</div>
              <div className="stat-value">{value}</div>
              <div className={`stat-change ${up ? 'up' : 'down'}`}>
                {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {change}
              </div>
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ gap: 24, marginBottom: 24 }}>
          <div className="card">
            <div className="section-header">
              <div className="section-title"><TrendingUp />Follower Growth</div>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={GROWTH_DATA_MOCK}>
                  <defs>
                    <linearGradient id="gf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E8FF47" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#E8FF47" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="followers" stroke="#E8FF47" strokeWidth={2} fill="url(#gf)" name="Followers" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="section-header">
              <div className="section-title"><DollarSign />Income Trend</div>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={GROWTH_DATA_MOCK}>
                  <defs>
                    <linearGradient id="gi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4ADE80" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#4ADE80" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="income" stroke="#4ADE80" strokeWidth={2} fill="url(#gi)" name="Income" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="section-header">
            <div className="section-title"><Lightbulb />Platform Breakdown</div>
          </div>
          <div className="platform-cards">
            {Object.entries(stats.followersByPlatform || {}).map(([platform, count]) => {
              const max = Math.max(...Object.values(stats.followersByPlatform));
              const pct = Math.round((count / max) * 100);
              const colors = { twitter: '#1DA1F2', instagram: '#E1306C', youtube: '#FF0000', newsletter: '#7B61FF' };
              return (
                <div key={platform} className="platform-card">
                  <div className="platform-card-name">{platform}</div>
                  <div className="platform-card-count">{count.toLocaleString()}</div>
                  <div className="platform-card-bar">
                    <div className="platform-card-bar-fill" style={{ width: `${pct}%`, background: colors[platform] || 'var(--accent)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

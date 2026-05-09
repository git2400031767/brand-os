import { useEffect, useState } from 'react';
import { BarChart2, TrendingUp, Eye, Zap } from 'lucide-react';
import { api } from '../utils/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const COLORS = { twitter: '#1DA1F2', instagram: '#E1306C', youtube: '#FF0000', newsletter: '#7B61FF' };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
      <div style={{ color: 'var(--text3)', marginBottom: 6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color, marginBottom: 2 }}>
          <span style={{ textTransform: 'capitalize' }}>{p.dataKey}</span>: {p.value?.toLocaleString()}
        </div>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics').then(d => { setAnalytics(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="spinner" />Loading analytics...</div>;
  if (!analytics) return <div className="loading">Failed to load analytics.</div>;

  const totalFollowers = Object.values(analytics.followers).reduce((a, b) => a + b, 0);

  return (
    <>
      <div className="page-header">
        <div className="page-title">Analytics</div>
        <div className="page-subtitle">Track your growth across all platforms in one view.</div>
      </div>

      <div className="page-content">
        <div className="platform-cards">
          {Object.entries(analytics.followers).map(([platform, count]) => {
            const pct = Math.round((count / totalFollowers) * 100);
            return (
              <div key={platform} className="platform-card">
                <div className="platform-card-name">{platform}</div>
                <div className="platform-card-count" style={{ color: COLORS[platform] || 'var(--accent)' }}>{count.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{pct}% of total</div>
                <div className="platform-card-bar">
                  <div className="platform-card-bar-fill" style={{ width: `${pct}%`, background: COLORS[platform] || 'var(--accent)' }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid-2" style={{ gap: 24, marginBottom: 24 }}>
          <div className="card">
            <div className="section-header">
              <div className="section-title"><TrendingUp />Growth Over Time</div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={analytics.growth}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
                {Object.keys(COLORS).map(k => (
                  <Line key={k} type="monotone" dataKey={k} stroke={COLORS[k]} strokeWidth={2} dot={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="section-header">
              <div className="section-title"><BarChart2 />Monthly Comparison</div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={analytics.growth}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="newsletter" fill="#7B61FF" radius={[3, 3, 0, 0]} />
                <Bar dataKey="twitter" fill="#1DA1F2" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="section-header">
            <div className="section-title"><Zap />Top Performing Content</div>
          </div>
          <div className="table-wrap" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>Content</th>
                  <th>Platform</th>
                  <th>Engagement</th>
                  <th>Reach</th>
                  <th>Engagement Rate</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topPosts.map((post, i) => {
                  const rate = ((post.engagement / post.reach) * 100).toFixed(1);
                  return (
                    <tr key={i}>
                      <td>{post.title}</td>
                      <td><span className="platform-pill">{post.platform}</span></td>
                      <td style={{ color: 'var(--accent)', fontWeight: 600 }}>{post.engagement.toLocaleString()}</td>
                      <td>{post.reach.toLocaleString()}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 2, maxWidth: 80 }}>
                            <div style={{ width: `${Math.min(rate, 100)}%`, height: '100%', background: 'var(--success)', borderRadius: 2 }} />
                          </div>
                          <span style={{ color: 'var(--success)', fontWeight: 600 }}>{rate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

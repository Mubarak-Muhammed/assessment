import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { AppDispatch, RootState } from '../store';
import { fetchInteractions } from '../store/interactionSlice';

const StatCard = ({ icon, label, value, color, change }: {
  icon: string; label: string; value: number | string; color: string; change?: string;
}) => (
  <div className="stat-card">
    <div className={`stat-icon ${color}`}>{icon}</div>
    <div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {change && <div className="stat-change">{change}</div>}
    </div>
  </div>
);

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { interactions, loading } = useSelector((s: RootState) => s.interaction);
  const auth = useSelector((s: RootState) => s.auth);

  useEffect(() => { dispatch(fetchInteractions()); }, [dispatch]);

  const total = interactions.length;
  const followUps = interactions.filter(i => i.follow_up_required).length;
  const positive = interactions.filter(i => i.sentiment === 'positive').length;
  const today = new Date().toISOString().split('T')[0];
  const todayCount = interactions.filter(i => i.interaction_date === today).length;

  const recent = [...interactions].slice(0, 8);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Welcome back, {auth.user?.name?.split(' ')[0]} 👋</h1>
          <p>Here's your HCP interaction overview for today · {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="header-actions">
          <Link to="/log" className="btn btn-primary">
            ✏️ Log Interaction
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard icon="📋" label="Total Interactions" value={total} color="blue" change={`+${todayCount} today`} />
        <StatCard icon="🔔" label="Follow-Ups Due" value={followUps} color="orange" />
        <StatCard icon="😊" label="Positive Meetings" value={positive} color="green" change={total ? `${Math.round((positive/total)*100)}% rate` : '—'} />
        <StatCard icon="📅" label="Today's Visits" value={todayCount} color="purple" />
      </div>

      {/* 2-col layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Recent Interactions */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700 }}>Recent Interactions</h2>
            <Link to="/interactions" className="btn btn-ghost btn-sm">View All →</Link>
          </div>
          {loading && <div style={{ textAlign: 'center', padding: '30px' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>}
          {!loading && recent.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3>No interactions yet</h3>
              <p>Start by logging your first HCP interaction</p>
            </div>
          )}
          {!loading && (
            <div className="activity-list">
              {recent.map(item => (
                <div key={item.id} className="activity-item">
                  <div className={`activity-dot ${item.sentiment ?? 'neutral'}`} />
                  <div className="activity-content">
                    <h4>Dr. {item.hcp_name}</h4>
                    <p>{item.hospital} · {item.meeting_type}</p>
                  </div>
                  <div className="activity-time">
                    {new Date(item.interaction_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Tools Quick Access */}
        <div className="card">
          <h2 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>🤖 AI Tools Quick Access</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Switch to the Chat tab on Log Interaction to access all AI tools.
          </p>
          {[
            { icon: '🔬', name: 'Log Interaction', desc: 'AI extracts entities from your notes' },
            { icon: '✏️', name: 'Edit Interaction', desc: 'Update specific fields by ID' },
            { icon: '📅', name: 'Follow-Up Plan', desc: 'AI generates strategic next steps' },
            { icon: '👨‍⚕️', name: 'Doctor Insights', desc: 'AI profile & engagement strategy' },
            { icon: '📝', name: 'Meeting Summary', desc: 'Transform raw notes to CRM entries' },
          ].map(tool => (
            <div key={tool.name} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 12px', borderRadius: '8px',
              background: 'var(--bg-secondary)', marginBottom: '8px',
              border: '1px solid var(--border-color)',
            }}>
              <span style={{ fontSize: '20px' }}>{tool.icon}</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{tool.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{tool.desc}</div>
              </div>
            </div>
          ))}
          <Link to="/log?tab=chat" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
            Open AI Chat Interface →
          </Link>
        </div>
      </div>
    </div>
  );
}

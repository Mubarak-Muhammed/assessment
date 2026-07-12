import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { fetchInteractions, updateInteraction, setCurrentInteraction } from '../store/interactionSlice';
import { showToast } from '../store/uiSlice';
import type { Interaction } from '../types';

function EditModal({ interaction, onClose }: { interaction: Interaction; onClose: () => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState<Interaction>({ ...interaction });
  const { loading } = useSelector((s: RootState) => s.interaction);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      await dispatch(updateInteraction({ id: form.id, data: form })).unwrap();
      dispatch(showToast({ message: '✅ Interaction updated!', type: 'success' }));
      onClose();
    } catch {
      dispatch(showToast({ message: 'Failed to update interaction.', type: 'error' }));
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>✏️ Edit Interaction</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div style={{ display: 'grid', gap: '14px' }}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Doctor Name</label>
              <input className="form-input" name="hcp_name" value={form.hcp_name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Hospital</label>
              <input className="form-input" name="hospital" value={form.hospital} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Products Discussed</label>
              <input className="form-input" name="products_discussed" value={form.products_discussed ?? ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Sentiment</label>
              <select className="form-select" name="sentiment" value={form.sentiment ?? 'neutral'} onChange={handleChange}>
                <option value="positive">😊 Positive</option>
                <option value="neutral">😐 Neutral</option>
                <option value="negative">😟 Negative</option>
              </select>
            </div>
            <div className="form-group form-full">
              <label className="form-label">Notes</label>
              <textarea className="form-textarea" name="notes" value={form.notes ?? ''} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InteractionsList() {
  const dispatch = useDispatch<AppDispatch>();
  const { interactions, loading } = useSelector((s: RootState) => s.interaction);
  const [editTarget, setEditTarget] = useState<Interaction | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => { dispatch(fetchInteractions()); }, [dispatch]);

  const filtered = interactions.filter(i =>
    i.hcp_name.toLowerCase().includes(search.toLowerCase()) ||
    i.hospital.toLowerCase().includes(search.toLowerCase()) ||
    (i.products_discussed ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const sentimentBadge = (s?: string) => {
    const map: Record<string, string> = { positive: 'badge-positive', neutral: 'badge-neutral', negative: 'badge-negative' };
    const icons: Record<string, string> = { positive: '😊', neutral: '😐', negative: '😟' };
    const cls = map[s ?? 'neutral'] ?? 'badge-neutral';
    return <span className={`badge ${cls}`}>{icons[s ?? 'neutral']} {s ?? 'neutral'}</span>;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>HCP Interactions</h1>
          <p>{interactions.length} total interactions logged</p>
        </div>
        <div className="header-actions">
          <input
            id="search-interactions"
            className="form-input"
            style={{ width: '240px' }}
            placeholder="🔍 Search doctor, hospital..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner" style={{ margin: '0 auto', width: '32px', height: '32px' }} />
          <p style={{ color: 'var(--text-muted)', marginTop: '16px' }}>Loading interactions...</p>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>{search ? 'No results found' : 'No interactions yet'}</h3>
          <p>{search ? `No interactions matching "${search}"` : 'Log your first HCP interaction to see it here.'}</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Hospital</th>
                <th>Date</th>
                <th>Meeting Type</th>
                <th>Products</th>
                <th>Sentiment</th>
                <th>Follow-Up</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>Dr. {item.hcp_name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.specialization}</div>
                  </td>
                  <td>{item.hospital}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {new Date(item.interaction_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td><span className="badge badge-blue">{item.meeting_type}</span></td>
                  <td style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.products_discussed || '—'}
                  </td>
                  <td>{sentimentBadge(item.sentiment)}</td>
                  <td>
                    {item.follow_up_required
                      ? <span className="badge badge-purple">🔔 Required</span>
                      : <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>None</span>}
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => { dispatch(setCurrentInteraction(item)); setEditTarget(item); }}
                    >
                      ✏️ Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editTarget && (
        <EditModal interaction={editTarget} onClose={() => setEditTarget(null)} />
      )}
    </div>
  );
}

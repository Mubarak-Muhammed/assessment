import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import LogForm from '../components/features/LogForm';
import ChatInterface from '../components/features/ChatInterface';

export default function LogInteraction() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'chat' ? 'chat' : 'form';
  const [activeTab, setActiveTab] = useState<'form' | 'chat'>(initialTab);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Log HCP Interaction</h1>
          <p>Record a new interaction with a Healthcare Professional using the structured form or AI chat</p>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="tab-bar">
        <button
          id="tab-form"
          className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => setActiveTab('form')}
        >
          📋 Structured Form
        </button>
        <button
          id="tab-chat"
          className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          🤖 AI Chat Interface
        </button>
      </div>

      {activeTab === 'form' ? (
        <div className="card">
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>
              📋 New Interaction Entry
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Fill in the details of your HCP visit. Fields marked with <span style={{ color: 'var(--accent-danger)' }}>*</span> are required.
            </p>
          </div>
          <LogForm />
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '16px', padding: '14px 18px', background: 'rgba(79,142,247,0.06)', borderRadius: '12px', border: '1px solid rgba(79,142,247,0.15)' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
              💡 <strong style={{ color: 'var(--accent-primary)' }}>How to use the AI tools:</strong> Just describe your meeting naturally, or ask for doctor insights, follow-up plans, or meeting summaries. The AI agent will automatically call the right tool.
            </p>
          </div>

          {/* Tool cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '16px' }}>
            {[
              { icon: '🔬', name: 'Log Interaction', hint: 'Describe your meeting' },
              { icon: '✏️', name: 'Edit Interaction', hint: 'Update logged data' },
              { icon: '📅', name: 'Follow-Up Plan', hint: 'Plan next steps' },
              { icon: '👨‍⚕️', name: 'Doctor Insights', hint: 'HCP profile AI' },
              { icon: '📝', name: 'Meeting Summary', hint: 'Summarize notes' },
            ].map(tool => (
              <div key={tool.name} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                borderRadius: '10px', padding: '12px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>{tool.icon}</div>
                <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '3px' }}>{tool.name}</div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{tool.hint}</div>
              </div>
            ))}
          </div>

          <ChatInterface />
        </div>
      )}
    </div>
  );
}

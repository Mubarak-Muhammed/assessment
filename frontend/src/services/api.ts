import axios from 'axios';
import type { Interaction, AgentResponse } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// ── Interactions ─────────────────────────────────────────────────────────────
export const getAllInteractions = (): Promise<Interaction[]> =>
  api.get('/interaction/all').then(r => r.data);

export const getInteraction = (id: string): Promise<Interaction> =>
  api.get(`/interaction/${id}`).then(r => r.data);

export const logInteractionForm = (data: Omit<Interaction, 'id'>): Promise<Interaction> =>
  api.post('/interaction/form', data).then(r => r.data);

export const editInteraction = (id: string, data: Partial<Interaction>): Promise<Interaction> =>
  api.put(`/interaction/edit/${id}`, data).then(r => r.data);

// ── AI Agent ─────────────────────────────────────────────────────────────────
export const sendAgentMessage = (
  message: string,
  context?: Record<string, unknown>
): Promise<AgentResponse> =>
  api.post('/agent/chat', { message, context }).then(r => r.data);

export default api;

import { createSlice } from '@reduxjs/toolkit';

const agentSlice = createSlice({
  name: 'agent',
  initialState: {
    status: 'idle' as 'idle' | 'thinking' | 'done',
    lastToolUsed: null as string | null,
  },
  reducers: {
    setAgentStatus: (state, action) => { state.status = action.payload; },
    setLastTool: (state, action) => { state.lastToolUsed = action.payload; },
  },
});

export const { setAgentStatus, setLastTool } = agentSlice.actions;
export default agentSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ChatMessage } from '../types';
import { sendAgentMessage } from '../services/api';

let msgCounter = 0;
const newId = () => `msg-${Date.now()}-${++msgCounter}`;

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (message: string, { rejectWithValue }) => {
    try { return await sendAgentMessage(message); }
    catch (e: unknown) { return rejectWithValue((e as Error).message); }
  }
);

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
}

const chatSlice = createSlice({
  name: 'chat',
  initialState: { messages: [], loading: false, error: null } as ChatState,
  reducers: {
    addUserMessage: (state, action: PayloadAction<string>) => {
      state.messages.push({
        id: newId(),
        role: 'user',
        content: action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    clearChat: (state) => {
      state.messages = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          id: newId(),
          role: 'assistant',
          content: action.payload.response,
          timestamp: new Date().toISOString(),
          toolUsed: action.payload.tool_used,
          extractedData: action.payload.extracted_data,
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.messages.push({
          id: newId(),
          role: 'assistant',
          content: '⚠️ Sorry, I encountered an error. Please check if the backend is running.',
          timestamp: new Date().toISOString(),
        });
      });
  },
});

export const { addUserMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;

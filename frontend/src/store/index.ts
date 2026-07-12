import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import interactionReducer from './interactionSlice';
import chatReducer from './chatSlice';
import agentReducer from './agentSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    interaction: interactionReducer,
    chat: chatReducer,
    agent: agentReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  activeTab: 'form' | 'chat';
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info';
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    activeTab: 'form',
    toastMessage: null,
    toastType: 'info',
  } as UIState,
  reducers: {
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    setActiveTab: (state, action: PayloadAction<'form' | 'chat'>) => {
      state.activeTab = action.payload;
    },
    showToast: (state, action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' }>) => {
      state.toastMessage = action.payload.message;
      state.toastType = action.payload.type;
    },
    clearToast: (state) => { state.toastMessage = null; },
  },
});

export const { toggleSidebar, setActiveTab, showToast, clearToast } = uiSlice.actions;
export default uiSlice.reducer;

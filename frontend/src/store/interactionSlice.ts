import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Interaction } from '../types';
import { getAllInteractions, logInteractionForm, editInteraction } from '../services/api';

// ── Async Thunks ─────────────────────────────────────────────────────────────
export const fetchInteractions = createAsyncThunk(
  'interaction/fetchAll',
  async (_, { rejectWithValue }) => {
    try { return await getAllInteractions(); }
    catch (e: unknown) { return rejectWithValue((e as Error).message); }
  }
);

export const createInteraction = createAsyncThunk(
  'interaction/create',
  async (data: Omit<Interaction, 'id'>, { rejectWithValue }) => {
    try { return await logInteractionForm(data); }
    catch (e: unknown) { return rejectWithValue((e as Error).message); }
  }
);

export const updateInteraction = createAsyncThunk(
  'interaction/update',
  async ({ id, data }: { id: string; data: Partial<Interaction> }, { rejectWithValue }) => {
    try { return await editInteraction(id, data); }
    catch (e: unknown) { return rejectWithValue((e as Error).message); }
  }
);

// ── Slice ────────────────────────────────────────────────────────────────────
interface InteractionState {
  interactions: Interaction[];
  currentInteraction: Interaction | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: InteractionState = {
  interactions: [],
  currentInteraction: null,
  loading: false,
  error: null,
  successMessage: null,
};

const interactionSlice = createSlice({
  name: 'interaction',
  initialState,
  reducers: {
    setCurrentInteraction: (state, action: PayloadAction<Interaction | null>) => {
      state.currentInteraction = action.payload;
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAll
      .addCase(fetchInteractions.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        state.loading = false;
        state.interactions = action.payload;
      })
      .addCase(fetchInteractions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // create
      .addCase(createInteraction.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createInteraction.fulfilled, (state, action) => {
        state.loading = false;
        state.interactions.unshift(action.payload);
        state.successMessage = 'Interaction logged successfully!';
      })
      .addCase(createInteraction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // update
      .addCase(updateInteraction.fulfilled, (state, action) => {
        const idx = state.interactions.findIndex(i => i.id === action.payload.id);
        if (idx !== -1) state.interactions[idx] = action.payload;
        state.successMessage = 'Interaction updated successfully!';
      });
  },
});

export const { setCurrentInteraction, clearMessages } = interactionSlice.actions;
export default interactionSlice.reducer;

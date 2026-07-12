import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: { name: 'Alex Carter', role: 'Field Representative', region: 'North Zone' },
    isAuthenticated: true,
  },
  reducers: {},
});

export default authSlice.reducer;

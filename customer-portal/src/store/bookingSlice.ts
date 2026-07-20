import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface BookingState {
  currentDraftId: string | null;
  unsavedChanges: boolean;
}

const initialState: BookingState = {
  currentDraftId: null,
  unsavedChanges: false,
};

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setDraftId: (state, action: PayloadAction<string>) => {
      state.currentDraftId = action.payload;
    },
    setUnsavedChanges: (state, action: PayloadAction<boolean>) => {
      state.unsavedChanges = action.payload;
    }
  },
});

export const { setDraftId, setUnsavedChanges } = bookingSlice.actions;
export default bookingSlice.reducer;

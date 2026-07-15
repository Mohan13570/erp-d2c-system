// src/features/ai/aiSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/lib/store';

// Types for conversation and messages (simplified)
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

interface AIState {
  conversations: Conversation[];
  currentConversationId: string | null;
  loading: boolean;
  typing: boolean;
}

const initialState: AIState = {
  conversations: [],
  currentConversationId: null,
  loading: false,
  typing: false,
};

// Async thunk to fetch conversations (placeholder implementation)
export const fetchConversations = createAsyncThunk(
  'ai/fetchConversations',
  async (params: { page: number }) => {
    // In a real app, you'd call an API. Here we return an empty list.
    return [] as Conversation[];
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    setCurrentConversationId(state, action: PayloadAction<string | null>) {
      state.currentConversationId = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setTyping(state, action: PayloadAction<boolean>) {
      state.typing = action.payload;
    },
    // Additional reducers can be added as needed.
  },
  extraReducers: (builder) => {
    builder.addCase(fetchConversations.fulfilled, (state, action) => {
      state.conversations = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchConversations.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchConversations.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const { setCurrentConversationId, setLoading, setTyping } = aiSlice.actions;

export default aiSlice.reducer;

// Selectors
export const selectConversations = (state: RootState) => state.ai.conversations;
export const selectCurrentConversationId = (state: RootState) => state.ai.currentConversationId;
export const selectLoading = (state: RootState) => state.ai.loading;
export const selectTyping = (state: RootState) => state.ai.typing;
export const selectMessages = (state: RootState) => {
  const convId = state.ai.currentConversationId;
  if (!convId) return [] as Message[];
  const conv = state.ai.conversations.find((c) => c.id === convId);
  return conv ? conv.messages : [];
};

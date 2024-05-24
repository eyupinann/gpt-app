// store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Mesajlar için slice oluşturun
const messagesSlice = createSlice({
  name: 'messages',
  initialState: [],
  reducers: {
    addMessage: (state, action) => {
      state.push(action.payload);
    },
    clearMessages: () => {
      return [];
    },
  },
});

export const { addMessage, clearMessages } = messagesSlice.actions;

const store = configureStore({
  reducer: {
    messages: messagesSlice.reducer,
  },
});

export default store;

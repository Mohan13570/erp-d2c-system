import { configureStore, combineReducers } from '@reduxjs/toolkit';
import aiReducer from '@/features/ai/aiSlice';

// placeholder root reducer, replace with actual slices
const rootReducer = combineReducers({
  ai: aiReducer,
});
export const makeStore = () => {
  return configureStore({ reducer: rootReducer });
};
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

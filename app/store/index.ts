import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import spendingCategoryReducer from './spendingCategorySlice';
import incomeCategoryReducer from './incomeCategorySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    spendingCategory: spendingCategoryReducer,
    incomeCategoryReducer: incomeCategoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
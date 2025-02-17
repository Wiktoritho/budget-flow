import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Transaction {
  name: string;
  category: string;
  value: number;
  date: string;
}

interface User {
  email: string;
  spending: Transaction[];
  income: Transaction[];
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: Boolean;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isLoggedIn = true;
      state.isLoading = false;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.isLoading = false;
      state.user = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUserData: (state, action: PayloadAction<{ spending: Transaction[]; income: Transaction[] }>) => {
      if (state.user) {
        state.user.spending = action.payload.spending;
        state.user.income = action.payload.income;
      }
    },
  },
});

export const { login, logout, setLoading, setUserData } = authSlice.actions;
export default authSlice.reducer;

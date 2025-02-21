import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Category {
  value: string;
  label: string;
}

interface IncomeCategoryState {
  incomeCategories: Category[];
}

const initialState: IncomeCategoryState = {
  incomeCategories: [],
};


const incomeCategorySlice = createSlice({
  name: "incomeCategory",
  initialState,
  reducers: {
    setIncomeCategoryData: (state, action: PayloadAction<{ categories: Category[] }>) => {
      state.incomeCategories = action.payload.categories;
    },
  },
});

export const { setIncomeCategoryData } = incomeCategorySlice.actions;
export default incomeCategorySlice.reducer;

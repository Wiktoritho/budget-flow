import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Category {
  value: string;
  label: string;
}

interface SpendingCategoryState {
  spendingCategories: Category[];
}

const initialState: SpendingCategoryState = {
  spendingCategories: [],
};


const spendingCategorySlice = createSlice({
  name: "spendingCategory",
  initialState,
  reducers: {
    setSpendingCategoryData: (state, action: PayloadAction<{ categories: Category[] }>) => {
      state.spendingCategories = action.payload.categories;
    },
  },
});

export const { setSpendingCategoryData } = spendingCategorySlice.actions;
export default spendingCategorySlice.reducer;

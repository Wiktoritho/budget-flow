import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Category {
  value: string;
  label: string;
}

interface CategoryState {
  categories: Category[];
}

const initialState: CategoryState = {
  categories: [],
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategoryData: (state, action: PayloadAction<{ categories: Category[] }>) => {
      state.categories = action.payload.categories;
    },
  },
});

export const { setCategoryData } = categorySlice.actions;
export default categorySlice.reducer;

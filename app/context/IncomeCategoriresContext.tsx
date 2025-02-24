import React, { createContext, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import { setIncomeCategoryData } from "@/app/store/incomeCategorySlice";
import axios from "axios";

const IncomeCategoriesContext = createContext<any>(null);

export function IncomeCategoriesProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const getIncomeCategories = async () => {
    if (!user?.email) return;

    try {
      const response = await axios.get("/api/users");
      const userData = response.data.find((item: any) => item.email === user.email);

      if (userData?.incomeCategories?.length > 0) {
        const formattedCategories = userData.incomeCategories.map((category: string) => ({
          value: category,
          label: category,
        }));

        dispatch(setIncomeCategoryData({ categories: formattedCategories }));
      } else {
        console.log("No Categories");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return <IncomeCategoriesContext.Provider value={{ getIncomeCategories }}>{children}</IncomeCategoriesContext.Provider>;
}

export function useIncomeCategories() {
  return useContext(IncomeCategoriesContext);
}

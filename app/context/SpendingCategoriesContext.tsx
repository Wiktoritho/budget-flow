import React, { createContext, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import { setSpendingCategoryData } from "@/app/store/spendingCategorySlice";
import axios from "axios";

const SpendingCategoriesContext = createContext<any>(null);

export function SpendingCategoriesProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    
    const getSpendingCategories = async () => {
    if (!user?.email) return;

    try {
      const response = await axios.get("/api/users");
      const userData = response.data.find((item: any) => item.email === user.email);

      if (userData?.spendingCategories?.length > 0) {
        const formattedCategories = userData.spendingCategories.map((category: string) => ({
          value: category,
          label: category,
        }));

        dispatch(setSpendingCategoryData({ categories: formattedCategories }));
      } else {
        console.log("No Categories");
      }
    } catch (error) {
      console.error(error);
    }
    };

    
    return (
        <SpendingCategoriesContext.Provider value={{ getSpendingCategories }}>
            {children}
        </SpendingCategoriesContext.Provider>
    )
}

export function useSpendingCategories() {
    return useContext(SpendingCategoriesContext)
}
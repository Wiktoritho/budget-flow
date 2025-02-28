import React, { createContext, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import axios from "axios";
import { setUserData } from "../store/authSlice";

const UserDataContext = createContext<any>(null);

export function GetDataProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const getData = async () => {
    const response = await axios.get("/api/users", {
      params: {
        email: user?.email,
      },
    });
    const userData = response.data.find((item: any) => item.email === user?.email);
    if (userData) {
      dispatch(setUserData({ spending: userData.spending, income: userData.income, name: userData.name }));
    }
  };

  return <UserDataContext.Provider value={{ getData }}>{children}</UserDataContext.Provider>;
}

export function useUserData() {
  return useContext(UserDataContext);
}

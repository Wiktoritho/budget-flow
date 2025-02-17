"use client";

import { Poppins } from "next/font/google";
import "./globals.css";
import styles from "./page.module.scss";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store";
import Cookie from "js-cookie";
import { useEffect } from "react";
import { login, logout, setLoading } from "./store/authSlice";

const poppinsSans = Poppins({
  subsets: ["latin"],
  weight: "400",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <LayoutWithUserCheck>{children}</LayoutWithUserCheck>
    </Provider>
  );
}

const LayoutWithUserCheck = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = Cookie.get("user");
    if (user) {
      dispatch(login(JSON.parse(user)));
    } else {
      dispatch(logout());
    }

    dispatch(setLoading(false));
  }, [dispatch]);

  return (
    <html lang="en">
      <body className={`${poppinsSans.className}`}>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
};

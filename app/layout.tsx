"use client";

import { Poppins } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer/Footer";
import styles from "./page.module.scss";
import { Provider } from "react-redux";
import { store } from "./store";

const poppinsSans = Poppins({
  subsets: ['latin'],
  weight: '400',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <html lang="en">
        <body className={`${poppinsSans.className}`}>
          <main className={styles.main}>{children}</main>
          <Footer />
        </body>
      </html>
    </Provider>
  );
}

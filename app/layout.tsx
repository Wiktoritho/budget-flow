import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import styles from "./page.module.scss";

const poppinsSans = Poppins({
  subsets: ['latin'],
  weight: '400'
});

export const metadata: Metadata = {
  title: "Budget Flow - your home budget",
  description: "Take care of your budget by using a Budget Flow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppinsSans.className}`}>
      <Navbar userActive={true}/>
        <main className={styles.main}>
        {children}
        </main>
      <Footer/>
      </body>
    </html>
  );
}

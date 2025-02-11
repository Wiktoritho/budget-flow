import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar/Navbar";

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
        <Navbar/>
        {children}
      </body>
    </html>
  );
}

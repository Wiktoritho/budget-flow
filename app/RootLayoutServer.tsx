'use server';

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Budget Flow - your home budget",
  description: "Take care of your budget by using Budget Flow",
};

export default function RootLayoutServer({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
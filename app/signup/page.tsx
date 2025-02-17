"use client";
import UserForm from "../components/UserForm/UserForm";
import Navbar from "../components/Navbar/Navbar";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  const router = useRouter();

  const { isLoggedIn, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isLoading && isLoggedIn) {
      router.push("/dashboard");
    }
  }, [router, isLoading, isLoggedIn]);

  if (isLoading || isLoggedIn) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar userActive={isLoggedIn} />
      <UserForm type="Sign up" />
    </>
  );
}

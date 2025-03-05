"use client";
import UserForm from "../components/UserForm/UserForm";
import Navbar from "../components/Navbar/Navbar";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MoonLoader } from "react-spinners";
import style from "../page.module.scss"

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
    return (<div className={style.loader}>
        <MoonLoader/>
      </div>);
  }

  return (
    <>
      <Navbar search={false} userActive={isLoggedIn} />
      <UserForm type="Log in" />
    </>
  );
}

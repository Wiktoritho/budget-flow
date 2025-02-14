'use client';
import UserForm from "../components/UserForm/UserForm";
import Navbar from "../components/Navbar/Navbar";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function Login() {

  const userActive = useSelector((state: RootState) => state.auth.isLoggedIn)

  return (
    <>
      <Navbar userActive={userActive}/>
      <UserForm type="Sign up" />
     </> )
}

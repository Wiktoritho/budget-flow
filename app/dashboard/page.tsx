'use client';

import styles from "./page.module.scss";
import Menu from "../components/Menu/Menu";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Navbar from "../components/Navbar/Navbar";

export default function Dashboard() {

  const userActive = useSelector((state: RootState) => state.auth.isLoggedIn)

  return (
    <>
      <Navbar userActive={userActive}/>
      <div className={styles.dashboard}>
      <Menu />
      </div>
      </>
  );
}

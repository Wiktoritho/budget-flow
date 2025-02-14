'use client';

import styles from "./page.module.scss";
import Menu from "../components/Menu/Menu";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "../store";
import Navbar from "../components/Navbar/Navbar";
import axios from "axios";

export default function Dashboard() {

  const userActive = useSelector((state: RootState) => state.auth.isLoggedIn)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/test'); 
        console.log(response);
        
      } catch (error) {
        console.error("Błąd podczas pobierania danych:", error);
      }
    };

    fetchData();
  }, [])

  return (
    <>
      <Navbar userActive={userActive}/>
      <div className={styles.dashboard}>
      <Menu />
      </div>
      </>
  );
}

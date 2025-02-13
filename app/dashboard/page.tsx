'use client';

import styles from "./page.module.scss";
import Menu from "../components/Menu/Menu";
import { useEffect } from "react";

export default function Dashboard() {

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/users').then((res) => res.json())
      console.log(response);
      
    };

    fetchUsers()
  }, [])

  return (
    <div className={styles.dashboard}>
      <Menu />
    </div>
  );
}

"use client";
import styles from "./Navbar.module.scss";
import Link from "next/link";
import Button from "../Button/Button";
import Image from "next/image";
import { useState } from "react";

interface NavbarProps {
  userActive: Boolean;
  onSearch?: (query: string) => void;
  addTransaction?: (value: Boolean) => void;
}

export default function Navbar({ userActive, onSearch, addTransaction }: NavbarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <div className={styles.navbar__block}>
          <Link className={styles.navbar__block_header} href="/">
            BudgetFlow
          </Link>
          {!userActive ? (
            <div className={styles.navbar__block_flex}>
              <Link href="/">Home</Link>
              <Link href="">About us</Link>
              <Link href="">Contact</Link>
            </div>
          ) : (
            <div className={styles.navbar__block_flex}>
              <input placeholder="Search for expenses" onChange={handleSearch} />
            </div>
          )}
        </div>
        {!userActive ? (
          <div className={styles.navbar__block}>
            <Link href="/login" className={styles.navbar__block_titledLink}>
              Log in
            </Link>
            <Link href="/signup" className={styles.navbar__block_titledLink}>
              Sign up
            </Link>
          </div>
        ) : (
          <div className={styles.navbar__block}>
            <Button text="Add" variant="green" onClick={() => addTransaction?.(true)}/>
            <Link className={styles.navbar__block_profile} href="/profile">
              <Image src="/Images/profile-pic.jpg" alt="Profile Picture" width={44} height={44} />
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

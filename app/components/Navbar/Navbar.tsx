import styles from "./Navbar.module.scss";
import Link from "next/link";
import Button from "../Button/Button";
import Image from "next/image";

export default function Navbar({ userActive }: { userActive: boolean }) {
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
              <input placeholder="Search for expenses" />
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
            <Button text="Add" variant="green" />
            <Link className={styles.navbar__block_profile} href='/profile'>
              <Image src="/Images/profile-pic.jpg" alt="Profile Picture" width={44} height={44} />
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

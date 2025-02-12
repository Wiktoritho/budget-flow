import styles from "./Navbar.module.scss";
import Link from "next/link";

export default function Navbar() {
    return(
        <header className={styles.header}>
            <nav className={styles.navbar}>
            <div className={styles.navbar__block}>
                <Link className={styles.navbar__block_header} href="/">BudgetFlow</Link>
                <div className={styles.navbar__block_flex}>
                    <Link href="/">Home</Link>
                    <Link href="">About us</Link>
                    <Link href="">Contact</Link>
                </div>
            </div>
            <div className={styles.navbar__block}>
                <Link href="/login" className={styles.navbar__block_titledLink}>Log in</Link>
                <Link href="/signup" className={styles.navbar__block_titledLink}>Sign up</Link>
            </div>
            </nav>
        </header>
        
    )
}
import styles from "./Navbar.module.scss";

export default function Navbar() {
    return(
        <header className={styles.header}>
            <nav className={styles.navbar}>
            <div className={styles.navbar__block}>
                <a className={styles.navbar__block_header} href="/">BudgetFlow</a>
                <div className={styles.navbar__block_flex}>
                    <a href="/">Home</a>
                    <a href="">About us</a>
                    <a href="">Contact</a>
                </div>
            </div>
            <div className={styles.navbar__block}>
                <a href="/login" className={styles.navbar__block_titledLink}>Log in</a>
                <a href="/signup" className={styles.navbar__block_titledLink}>Sign up</a>
            </div>
            </nav>
        </header>
        
    )
}
import styles from "./Menu.module.scss";
import Image from "next/image";
import Link from "next/link";

export default function Menu() {
  return (
    <div className={styles.menu}>
      <div className={styles.menu__block}>
        <Link className={styles.menu__block_row} href='/dashboard'>
          <div>
            <Image src="/Icons/home.svg" alt="Home Icon" width={20} height={20} />
          </div>
          <p>Home</p>
        </Link>
        <Link className={styles.menu__block_row} href='/flow'>
          <div>
            <Image src="/Icons/hanger.svg" alt="Hanger Icon" width={20} height={20} />
          </div>
          <p>Flow</p>
        </Link>
        <Link className={styles.menu__block_row} href='/categories'>
          <div>
            <Image src="/Icons/categories.svg" alt="Categories Icon" width={20} height={20} />
          </div>
          <p>Categories</p>
        </Link>
        <Link className={styles.menu__block_row} href='/statistics'>
          <div>
            <Image src="/Icons/statistics.svg" alt="Statistics Icon" width={20} height={20} />
          </div>
          <p>Statistics</p>
        </Link>
        <Link className={styles.menu__block_row} href='/expected'>
          <div>
            <Image src="/Icons/expected.svg" alt="Expected Icon" width={20} height={20} />
          </div>
          <p>Expected</p>
        </Link>
        <Link className={styles.menu__block_row} href='/settings'>
          <div>
            <Image src="/Icons/settings.svg" alt="Settings Icon" width={20} height={20} />
          </div>
          <p>Settings</p>
        </Link>
      </div>
      <div className={styles.menu__block}>
        <Link className={styles.menu__block_row} href='/logout'>
          <div>
            <Image src="/Icons/logout.svg" alt="Logout Icon" width={20} height={20} />
          </div>
          <p>Log out</p>
        </Link>
      </div>
    </div>
  );
}

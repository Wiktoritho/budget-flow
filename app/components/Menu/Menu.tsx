import styles from "./Menu.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import Cookie from "js-cookie";
import { logout } from "@/app/store/authSlice";
import { useRouter } from "next/navigation";
import { closeConnection } from "@/app/utils/db";

export default function Menu() {
  const dispatch = useDispatch();
  const router = useRouter();
  const handleLogout = () => {
    dispatch(logout());
    Cookie.remove("user");
    closeConnection();
    router.push("/login");
  };

  return (
    <div className={styles.menu}>
      <div className={styles.menu__block}>
        <Link className={styles.menu__block_row} href="/dashboard">
          <div>
            <Image src="/Icons/home.svg" alt="Home Icon" width={20} height={20} />
          </div>
          <p>Home</p>
        </Link>
        <Link className={styles.menu__block_row} href="/flow">
          <div>
            <Image src="/Icons/hanger.svg" alt="Hanger Icon" width={20} height={20} />
          </div>
          <p>Flow</p>
        </Link>
        <Link className={styles.menu__block_row} href="/">
          <div>
            <Image src="/Icons/categories.svg" alt="Categories Icon" width={20} height={20} />
          </div>
          <p>Categories</p>
        </Link>
        <Link className={styles.menu__block_row} href="/">
          <div>
            <Image src="/Icons/expected.svg" alt="Expected Icon" width={20} height={20} />
          </div>
          <p>Expected</p>
        </Link>
        <Link className={styles.menu__block_row} href="/">
          <div>
            <Image src="/Icons/settings.svg" alt="Settings Icon" width={20} height={20} />
          </div>
          <p>Settings</p>
        </Link>
      </div>
      <div className={styles.menu__block}>
        <div className={styles.menu__block_row} onClick={handleLogout}>
          <div>
            <Image src="/Icons/logout.svg" alt="Logout Icon" width={20} height={20} />
          </div>
          <p>Log out</p>
        </div>
      </div>
    </div>
  );
}

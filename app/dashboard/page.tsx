import styles from "./page.module.scss";
import Menu from "../components/Menu/Menu";

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <Menu />
      
    </div>
  );
}

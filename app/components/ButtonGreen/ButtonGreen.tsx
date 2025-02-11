import styles from "./ButtonGreen.module.scss";

export default function ButtonGreen({ text }: { text: String }) {
  return <button className={styles.buttonGreen}>{text}</button>;
}

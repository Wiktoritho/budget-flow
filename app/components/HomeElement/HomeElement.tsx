import styles from "./HomeElement.module.scss";
import Button from "../Button/Button";

interface HomeElementProps {
  title: string;
  subtitle: string;
  text: string;
  buttonText: string;
  image: string;
  alt: string;
}

export default function HomeElement({
  title,
  subtitle,
  text,
  buttonText,
  image,
  alt
}: HomeElementProps) {
  return (
    <div className={styles.homeElement}>
      <img src={`/Icons/${image}`} alt={alt}/>
      <div className={styles.homeElement__block}>
        <p className={styles.homeElement__block_subtitle}>{subtitle}</p>
        <h3 className={styles.homeElement__block_title}>{title}</h3>
        <p className={styles.homeElement__block_text}>{text}</p>
        <Button text={buttonText} variant="green"/>
      </div>
    </div>
  );
}

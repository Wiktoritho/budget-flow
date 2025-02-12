import styles from "./HomeElement.module.scss";
import Button from "../Button/Button";
import Image from "next/image";

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
  alt,
}: HomeElementProps) {
  return (
    <div className={styles.homeElement}>
      <Image
        src={`/Icons/${image}`}
        alt={alt}
        width={460}
        height={460}
        layout="responsive"
        loading="lazy"
      />
      <div className={styles.homeElement__block}>
        <p className={styles.homeElement__block_subtitle}>{subtitle}</p>
        <h3 className={styles.homeElement__block_title}>{title}</h3>
        <p className={styles.homeElement__block_text}>{text}</p>
        <Button text={buttonText} href="/login" variant="green" />
      </div>
    </div>
  );
}

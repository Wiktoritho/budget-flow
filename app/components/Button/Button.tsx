import styles from "./Button.module.scss";
import Link from "next/link";

interface ButtonProps {
  text: string;
  variant?: "green" | "white";
  href?: string;
  onClick?: () => void;
}

export default function Button({ text, variant = "green", href, onClick }: ButtonProps) {
  if (href) {
    return (
      <Link
        className={variant === "green" ? styles.buttonGreen : styles.buttonWhite}
        href={href}
        passHref
      >
        {text}
      </Link>
    );
  }
  return (
    <button
      className={variant === "green" ? styles.buttonGreen : styles.buttonWhite} onClick={onClick}
    >
      {text}
    </button>
  );
  
}

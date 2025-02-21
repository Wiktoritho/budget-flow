import styles from "./Button.module.scss";
import Link from "next/link";
import clsx from "clsx";

interface ButtonProps {
  text: string;
  variant?: "green" | "white";
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  greenActive?: string;
}

export default function Button({ text, variant = "green", href, onClick, disabled, greenActive }: ButtonProps) {

  const buttonClass = clsx(
    variant === "green" ? styles.buttonGreen : styles.buttonWhite,
    greenActive === text && styles.activeButton
  )

  if (href) {
    return (
      <Link
        className={buttonClass}
        href={href}
        passHref
      >
        {text}
      </Link>
    );
  }
  return (
    <button
      className={buttonClass} onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
  
}

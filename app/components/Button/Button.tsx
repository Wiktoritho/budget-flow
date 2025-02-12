import styles from "./Button.module.scss";

interface ButtonProps {
  text: string;
  variant?: "green" | "white";
}

export default function Button({ text, variant = "green" }: ButtonProps) {
  return (
    <button
      className={variant === "green" ? styles.buttonGreen : styles.buttonWhite}
    >
      {text}
    </button>
  );
}

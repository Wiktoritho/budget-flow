import styles from "./page.module.scss";
import ButtonGreen from "./components/ButtonGreen/ButtonGreen";
import HomeElement from "./components/HomeElement/HomeElement";

export default function Home() {
  const homeElements = [
    {
      title: "Introducing BudgetFlow",
      subtitle: "",
      text: "Join our community and experience the benefits today!",
      buttonText: "Try for free",
      image: "home-element1.png",
      alt: "Money Chart Icon",
    },
    {
      title: "All your finances in one place",
      subtitle: "Budget Pro",
      text: "We take care of your finances, helping you track, manage, and grow your money.",
      buttonText: "Try now",
      image: "home-element2.png",
      alt: "Save Money Icon",
    },
    {
      title: "Save money and stay on budget",
      subtitle: "Cost Saver",
      text: "Powerful tool that helps you reduce costs and save money on your daily expenses. With advanced analytics and optimization algorithms, CostSaver analyzes your spending habits and identifies areas for improvement.",
      buttonText: "Try now",
      image: "home-element3.png",
      alt: "Piggy Safe Icon",
    },
  ];

  return (
    <main className={styles.main}>
      <section className={styles.main__container}>
        <div className={styles.intro}>
          <div className={styles.intro__block}>
            <h1 className={styles.intro__block_header}>
              The best way to manage your budget.
            </h1>
            <div className={styles.intro__block_buttons}>
              <ButtonGreen text="Try for free" />
              <ButtonGreen text="See how it works" />
            </div>
          </div>
          <img src="/Icons/money-chart.png" alt="Money Chart Picture" />
        </div>
      </section>
      <section className={styles.main__container}>
        {homeElements.map((element, index) => (
          <HomeElement
            key={index}
            image={element.image}
            alt={element.alt}
            subtitle={element.subtitle}
            title={element.title}
            text={element.text}
            buttonText={element.buttonText}
          />
        ))}
      </section>
    </main>
  );
}

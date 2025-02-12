"use client";

import { useEffect, useRef } from "react";
import styles from "./page.module.scss";
import Image from "next/image";
import Button from "./components/Button/Button";
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

  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles["section-enter"]);
          }
        });
      },
      { threshold: 0.3 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <section className={styles.main__container}>
        <div className={styles.intro}>
          <div className={styles.intro__block}>
            <h1 className={styles.intro__block_header}>
              The best way to manage your budget.
            </h1>
            <div className={styles.intro__block_buttons}>
              <Button text="Try for free" variant="green" />
              <Button text="See how it works" variant="green" />
            </div>
          </div>
          <Image src="/Icons/money-chart.png" alt="Money Chart Picture" />
        </div>
      </section>
      <section
        className={styles.main__container}
        ref={(el) => {
          if (el) sectionsRef.current[0] = el;
        }}
      >
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
      <section
        className={styles.main__container}
        ref={(el) => {
          if (el) sectionsRef.current[1] = el;
        }}
      >
        <div className={styles.grayBlock}>
          <Image
            className={styles.grayBlock__absolute}
            src="/Icons/grayblock-image.png"
            alt="IT guy"
          />
          <div className={styles.grayBlock__container}>
            <h2 className={styles.grayBlock__container_header}>
              How to join our community
            </h2>
            <p className={styles.grayBlock__container_text}>
              Just 3 simple steps to manage your finances.
            </p>
            <Button text="Join BudgetFlow" variant="white" />
          </div>
          <div className={styles.grayBlock__container}>
            <div className={styles.grayBlock__container_step}>
              <h3>Step 1</h3>
              <p>Sign up and start tracking your finances today.</p>
            </div>
            <div className={styles.grayBlock__container_step}>
              <h3>Step 2</h3>
              <p>
                Get insights into your expected budgets for the upcoming
                periods.
              </p>
            </div>
            <div className={styles.grayBlock__container_step}>
              <h3>Step 3</h3>
              <p>Track your finances with ease.</p>
            </div>
          </div>
        </div>
      </section>
      <section
        className={styles.main__container}
        ref={(el) => {
          if (el) sectionsRef.current[2] = el;
        }}
      >
        <div className={styles.grayBlock}>
          <div className={styles.grayBlock__container}>
            <h2 className={styles.grayBlock__container_header}>
              Join BudgetFlow
            </h2>
            <p className={styles.grayBlock__container_text}>
              Start taking control of your finances now.
            </p>
            <Button text="Join now" variant="white" />
          </div>
          <div className={styles.grayBlock__container}>
            <Image
              className={styles.grayBlock__container_image}
              src="/Icons/grayblock-image2.png"
              alt="Tech girl icon"
            />
          </div>
        </div>
      </section>
    </>
  );
}

"use client";
import styles from "./page.module.scss";
import style from "../page.module.scss";
import Navbar from "../components/Navbar/Navbar";
import Menu from "../components/Menu/Menu";
import Footer from "../components/Footer/Footer";
import Modal from "../components/ModalTransaction/ModalTransaction";
import GrayContainer from "../components/GrayContainer/GrayContainer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UseDispatch } from "react-redux";
import { MoonLoader } from "react-spinners";
import { useUserData } from "../context/GetUserDataContext";
import { useSpendingCategories } from "../context/SpendingCategoriesContext";
import { useIncomeCategories } from "../context/IncomeCategoriresContext";

export default function Flow() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isLoggedIn, isLoading } = useSelector((state: RootState) => state.auth);
  const { spendingCategories } = useSelector((state: RootState) => state.spendingCategory);
  const { incomeCategories } = useSelector((state: RootState) => state.incomeCategory);
  const { getData } = useUserData();
  const [newTransaction, setNewTransaction] = useState<Boolean>(false);
  const { getSpendingCategories } = useSpendingCategories();
  const { getIncomeCategories } = useIncomeCategories();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    if (user?.email && !user.spending) {
      getData();
    }
  }, [isLoggedIn, isLoading, router, user?.email, user?.spending]);

  useEffect(() => {
    if (user?.email && spendingCategories.length === 0) {
      getSpendingCategories();
    }
    if (user?.email && incomeCategories.length === 0) {
      getIncomeCategories();
    }
  }, [user?.email]);

  if (isLoading) {
    return (
      <div className={style.loader}>
        <MoonLoader />
      </div>
    );
  }

  return (
    isLoggedIn && (
      <>
        <Navbar userActive={true} addTransaction={() => setNewTransaction(true)} />
        <div className={styles.dashboard}>
          <Menu />
          <section className={styles.dashboard__section}>
            <div className={styles.dashboard__section_top}>
              <h2>Spendings</h2>
            </div>
            <div className={styles.dashboard__section_bottom}>
              <div className={styles.dashboard__section_bottom_flex}>
                <GrayContainer title="Overview" transactionType="spending" selects={true} />
              </div>
            </div>
            <div className={styles.dashboard__section_top}>
              <h2>Incomes</h2>
            </div>
            <div className={styles.dashboard__section_bottom}>
              <div className={styles.dashboard__section_bottom_flex}>
                <GrayContainer title="Overview" transactionType="income" selects={true}/>
              </div>
            </div>
          </section>
        </div>
        {newTransaction && <Modal isOpen={newTransaction} onClose={() => setNewTransaction(false)} title="Add new transaction" email={user?.email} />}
        <Footer />
      </>
    )
  );
}

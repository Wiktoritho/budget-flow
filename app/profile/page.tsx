"use client";
import styles from "./page.module.scss";
import style from "../page.module.scss";
import Navbar from "../components/Navbar/Navbar";
import Menu from "../components/Menu/Menu";
import Footer from "../components/Footer/Footer";
import Modal from "../components/ModalTransaction/ModalTransaction";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserData } from "../context/GetUserDataContext";
import { MoonLoader } from "react-spinners";
import { useSpendingCategories } from "../context/SpendingCategoriesContext";
import { useIncomeCategories } from "../context/IncomeCategoriresContext";

export default function Profile() {
  const router = useRouter();
  const [newTransaction, setNewTransaction] = useState<Boolean>(false);
  const { spendingCategories } = useSelector((state: RootState) => state.spendingCategory);
  const { incomeCategories } = useSelector((state: RootState) => state.incomeCategory);
  const { user, isLoggedIn, isLoading } = useSelector((state: RootState) => state.auth);
  const { getData } = useUserData();
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
        <Navbar userActive={true} search={false} addTransaction={() => setNewTransaction(true)} />
        <div className={styles.dashboard}>
          <Menu />
          <section className={styles.dashboard__section}>
            <div className={styles.profile}>
              <h3>Profile Overview</h3>
              <div className={styles.dashboard__section_top}>
                <div className={styles.dashboard__section_block}>
                  <p>Name: <span>{user?.name}</span></p>
                  <button>Change Name</button>
                </div>
                <div className={styles.dashboard__section_block}>
                  <p>Password: <span>***********</span></p>
                  <button>Change Password</button>
                </div>
                <div className={styles.dashboard__section_block}>
                  <p>E-mail: <span>{user?.email}</span></p>
                  <button>Change E-mail</button>
                </div>
                <div className={styles.dashboard__section_block}>
                  <p>Picture: <span>
                  <Image src="/Images/profile-pic.jpg" alt="Profile Picture" width={44} height={44}/>
                  </span></p>
                  <button>Change Picture</button>
                </div>
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

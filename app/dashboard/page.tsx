"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import style from "../page.module.scss";
import Menu from "../components/Menu/Menu";
import Navbar from "../components/Navbar/Navbar";
import Image from "next/image";
import Footer from "../components/Footer/Footer";
import Button from "../components/Button/Button";
import Modal from "../components/Modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/index";
import { useRouter } from "next/navigation";
import axios from "axios";
import { setUserData } from "../store/authSlice";
import { Transaction } from "../store/authSlice";
import { MoonLoader } from "react-spinners";

export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const periods = ["Daily", "Weekly", "Monthly", "Yearly"];
  const { user, isLoggedIn, isLoading } = useSelector((state: RootState) => state.auth);

  const [selectedPeriod, setSelectedPeriod] = useState<string>("Yearly");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newTransaction, setNewTransaction] = useState<Boolean>(false);

  const filterByDate = (spending: Transaction[]) => {
    const currentDate = new Date();
    return spending.filter((element) => {
      const elementDate = new Date(element.date);
      switch (selectedPeriod) {
        case "Daily":
          return elementDate.toDateString() === currentDate.toDateString();
        case "Weekly":
          const startOfWeek = currentDate.getDate() - currentDate.getDay();
          const endOfWeek = startOfWeek + 6;
          return elementDate >= new Date(currentDate.setDate(startOfWeek)) && elementDate <= new Date(currentDate.setDate(endOfWeek));
        case "Monthly":
          return elementDate.getMonth() === currentDate.getMonth() && elementDate.getFullYear() === currentDate.getFullYear();
        case "Yearly":
          return elementDate.getFullYear() === currentDate.getFullYear();
        default:
          return true;
      }
    });
  };

  const sortByValue = (spending: Transaction[]) => {
    return spending.sort((a, b) => b.value - a.value);
  };

  const filterBySearch = (spending: Transaction[]) => {
    return spending.filter((element) => element.name.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  const filteredSpending = Array.isArray(user?.spending) ? filterBySearch(sortByValue(filterByDate(user.spending))) : [];

  const getImageFromCategory = (category: string) => {
    return `${category.toLowerCase().replaceAll(" ", "-")}.png`;
  };

  const removeTransaction = async (id: number) => {
    const response = await axios.post("/api/users/remove", {
      email: user?.email,
      transactionId: id,
    });

    const data = response.data;
    if (data.message === "Transaction removed") {
      dispatch(setUserData({ spending: data.data.spending, income: data.data.income }));
    } else {
      console.log("Error when removing transaction");
    }
  };

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const getData = async () => {
      const response = await axios.get("/api/users", {
        params: {
          email: user?.email,
        },
      });
      const userData = response.data.find((item: any) => item.email === user?.email);
      if (userData) {
        dispatch(setUserData({ spending: userData.spending, income: userData.income }));
      }
    };
    if (user?.email) {
      getData();
    }
  }, [isLoggedIn, isLoading, router, user?.email, dispatch]);

  if (isLoading) {
    return (<div className={style.loader}>
        <MoonLoader/>
      </div>);
  }

  return (
    isLoggedIn && (
      <>
        <Navbar userActive={true} onSearch={setSearchQuery} addTransaction={() => setNewTransaction(true)} />
        <div className={styles.dashboard}>
          <Menu />
          <section className={styles.dashboard__section}>
            <div className={styles.dashboard__section_top}>
              <h2>Select period</h2>
              <div>
                {periods.map((button) => (
                  <Button key={button} text={button} variant="green" onClick={() => setSelectedPeriod(button)} />
                ))}
              </div>
            </div>
            <div className={styles.dashboard__section_bottom}>
              <h2>Top spendings</h2>
              <div className={styles.tiles}>
                {filteredSpending.length > 0 ? (
                  filteredSpending.map((element, index) => (
                    <div key={index} className={styles.tiles__tile}>
                      {element.category && (
                        <Image
                          className={styles.tiles__tile_image}
                          src={`/Images/Categories/${getImageFromCategory(element.category)}`}
                          alt={`/Images/Categories/${getImageFromCategory(element.category)}`}
                          width={100}
                          height={300}
                          layout="responsive"
                        />
                      )}
                      <p className={styles.tiles__tile_header}>{element.name}</p>
                      <p className={styles.tiles__tile_price}>{element.value} PLN</p>
                      <div className={styles.tiles__tile_delete} onClick={() => removeTransaction(element.id)}>
                        <Image src="/Icons/delete.svg" alt="Delete Icon" width={20} height={20} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={styles.tiles__none}>No spending data available</p>
                )}
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

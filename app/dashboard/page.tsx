"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import style from "../page.module.scss";
import Menu from "../components/Menu/Menu";
import Navbar from "../components/Navbar/Navbar";
import Image from "next/image";
import Footer from "../components/Footer/Footer";
import Button from "../components/Button/Button";
import Modal from "../components/ModalTransaction/ModalTransaction";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/index";
import { useRouter } from "next/navigation";
import axios from "axios";
import { setUserData } from "../store/authSlice";
import { Transaction } from "../store/authSlice";
import { MoonLoader } from "react-spinners";
import SmallModal from "../components/SmallModal/SmallModal";
import { useUserData } from "../context/GetUserDataContext";

export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const periods = ["Daily", "Weekly", "Monthly", "Yearly"];
  const { user, isLoggedIn, isLoading } = useSelector((state: RootState) => state.auth);
  const [isSpendingLoading, setIsSpendingLoading] = useState(true);
  const [isIncomeLoading, setIsIncomeLoading] = useState(true);

  const [selectedSpendingPeriod, setSelectedSpendingPeriod] = useState<string>("Yearly");
  const [selectedIncomePeriod, setSelectedIncomePeriod] = useState<string>("Yearly");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newTransaction, setNewTransaction] = useState<Boolean>(false);
  const [editTransaction, setEditTransaction] = useState<Boolean>(false);
  const [tempTransactionId, setTempTransactionId] = useState({
    id: 0,
    type: "",
  }); 
  const { getData } = useUserData();

  const filterByDate = (transactions: Transaction[], selectedPeriod: string) => {
    const currentDate = new Date();

    return transactions.filter((element) => {
      const elementDate = new Date(element.date);

      switch (selectedPeriod) {
        case "Daily":
          return elementDate.toDateString() === currentDate.toDateString();
        case "Weekly":
          const startOfWeek = new Date(currentDate);
          startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          return elementDate >= startOfWeek && elementDate <= endOfWeek;
        case "Monthly":
          return elementDate.getMonth() === currentDate.getMonth() && elementDate.getFullYear() === currentDate.getFullYear();
        case "Yearly":
          return elementDate.getFullYear() === currentDate.getFullYear();
        default:
          return true;
      }
    });
  };

  const sortByValue = (transactions: Transaction[]) => {
    return transactions.sort((a, b) => b.value - a.value);
  };

  const filterSpendingBySearch = (spending: Transaction[]) => {
    return spending.filter((element) => element.name.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  const filteredSpending = Array.isArray(user?.spending) ? filterSpendingBySearch(sortByValue(filterByDate(user.spending, selectedSpendingPeriod))) : [];

  const filteredIncome = Array.isArray(user?.income) ? sortByValue(filterByDate(user.income, selectedIncomePeriod)) : [];
  
  const getImageFromCategory = (category: string) => {
    return `${category.toLowerCase().replaceAll(" ", "-")}.png`;
  };

  const removeTransaction = async (id: number, type: string) => {
    const response = await axios.post("/api/users/remove", {
      email: user?.email,
      transactionId: id,
      type: type,
    });

    const data = response.data;
    if (data.message === "Transaction removed") {
      dispatch(setUserData({ spending: data.data.spending, income: data.data.income }));
    } else {
      console.log("Error when removing transaction");
    }
  };

  const changeTransaction = (id: number, type: string) => {
    setEditTransaction(true);
    setTempTransactionId({
      id: id,
      type: type,
    });
  };

  useEffect(() => {
    if (!isLoading) {
      setIsIncomeLoading(false);
      setIsSpendingLoading(false);
    }
  }, [filteredIncome, filteredSpending, isLoading]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (user?.email) {
      getData();
    }
  }, [isLoggedIn, isLoading, router, user?.email]);

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
        <Navbar userActive={true} onSearch={setSearchQuery} addTransaction={() => setNewTransaction(true)} />
        <div className={styles.dashboard}>
          <Menu />
          <section className={styles.dashboard__section}>
            <div className={styles.dashboard__section_top}>
              <h2>Top spendings</h2>
              <div>
                {periods.map((button) => (
                  <Button key={button} text={button} variant="green" onClick={() => setSelectedSpendingPeriod(button)} greenActive={selectedSpendingPeriod} />
                ))}
              </div>
            </div>
            <div className={styles.dashboard__section_bottom}>
              <div className={styles.tiles}>
                {isSpendingLoading ? (
                  <MoonLoader />
                ) : filteredSpending.length > 0 ? (
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
                      <div className={styles.tiles__tile_delete} onClick={() => removeTransaction(element.id, "spending")}>
                        <Image src="/Icons/delete.svg" alt="Delete Icon" width={20} height={20} />
                      </div>
                      <div className={styles.tiles__tile_edit} onClick={() => changeTransaction(element.id, "spending")}>
                        <Image src="/Icons/edit.png" alt="Edit Icon" width={20} height={20} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={styles.tiles__none}>No spending data available</p>
                )}
              </div>
            </div>
            <div className={styles.dashboard__section_top}>
              <h2>Top incomes</h2>
              <div>
                {periods.map((button) => (
                  <Button key={button} text={button} variant="green" onClick={() => setSelectedIncomePeriod(button)} greenActive={selectedIncomePeriod} />
                ))}
              </div>
            </div>
            <div className={styles.dashboard__section_bottom}>
              <div className={styles.tiles}>
                {isIncomeLoading ? (
                  <MoonLoader />
                ) : filteredIncome.length > 0 ? (
                  filteredIncome.map((element, index) => (
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
                      <div className={styles.tiles__tile_delete} onClick={() => removeTransaction(element.id, "income")}>
                        <Image src="/Icons/delete.svg" alt="Delete Icon" width={20} height={20} />
                      </div>
                      <div className={styles.tiles__tile_edit} onClick={() => changeTransaction(element.id, "income")}>
                        <Image src="/Icons/edit.png" alt="Edit Icon" width={20} height={20} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={styles.tiles__none}>No Income data available</p>
                )}
              </div>
            </div>
          </section>
        </div>
        {newTransaction && <Modal isOpen={newTransaction} onClose={() => setNewTransaction(false)} title="Add new transaction" email={user?.email} />}
        {editTransaction && <SmallModal isOpen={editTransaction} onClose={() => setEditTransaction(false)} title="Edit Transaction" email={user?.email} transactionId={tempTransactionId} />}
        <Footer />
      </>
    )
  );
}

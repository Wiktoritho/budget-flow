"use client";

import { useEffect } from "react";
import styles from "./page.module.scss";
import Menu from "../components/Menu/Menu";
import Navbar from "../components/Navbar/Navbar";
import Image from "next/image";
import Footer from "../components/Footer/Footer";
import Button from "../components/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/index";
import { useRouter } from "next/navigation";
import axios from "axios";
import { setUserData } from "../store/authSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const periods = ["Daily", "Weekly", "Monthly", "Yearly"];
  const { user, isLoggedIn, isLoading } = useSelector((state: RootState) => state.auth);

  const testsome = () => {
    console.log(user);
  };

  interface User {
    email: string;
    name: string;
  }

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
      const userData = response.data.find((item: User) => item.email === user?.email);
      if (userData) {
        dispatch(setUserData({ spending: userData.spending, income: userData.income }));
      }
    };
    if (user?.email) {
      getData();
    }
  }, [isLoggedIn, isLoading, router, user?.email, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    isLoggedIn && (
      <>
        <Navbar userActive={true} />
        <div className={styles.dashboard}>
          <Menu />
          <section className={styles.dashboard__section}>
            <div className={styles.dashboard__section_top}>
              <h2>Select period</h2>
              <div>
                {periods.map((button) => (
                  <Button key={button} text={button} variant="green" />
                ))}
              </div>
            </div>
            <div className={styles.dashboard__section_bottom}>
              <h2>Top spendings</h2>
              <div className={styles.tiles}>
                {Array.isArray(user?.spending) ? (
                  user.spending.map((element, index) => (
                    <div key={index} className={styles.tiles__tile}>
                      <Image
                        className={styles.tiles__tile_image}
                        src="/Images/Categories/food-and-household-chemicals.png"
                        alt="Food and Household Chemicals"
                        width={100}
                        height={300}
                        layout="responsive"
                      />
                      <p className={styles.tiles__tile_header}>{element.name}</p>
                      <p className={styles.tiles__tile_price}>{element.value} PLN</p>
                    </div>
                  ))
                ) : (
                  <p className={styles.tiles__none}>No spending data available</p>
                )}
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </>
    )
  );
}

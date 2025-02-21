"use client";
import axios from "axios";
import styles from "./ModalTransaction.module.scss";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "@/app/store/authSlice";
import { v4 as uuidv4 } from "uuid";
import Button from "../Button/Button";
import Select from "react-select";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { setSpendingCategoryData } from "@/app/store/spendingCategorySlice";
import { setIncomeCategoryData } from "@/app/store/incomeCategorySlice";
import Image from "next/image";

interface ModalProps {
  isOpen: Boolean;
  title: string;
  onClose: () => void;
  email: string | undefined;
}

export default function Modal({ isOpen, onClose, title, email }: ModalProps) {
  if (!isOpen) return null;

  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { spendingCategories } = useSelector((state: RootState) => state.spendingCategory);
  const { incomeCategories } = useSelector((state: RootState) => state.incomeCategoryReducer);

  const [transactionData, setTransactionData] = useState({
    name: "",
    value: "",
    category: "",
    date: new Date().toISOString(),
    id: uuidv4(),
  });

  const [transactionError, setTransactionError] = useState({
    name: false,
    value: false,
    category: false,
  });

  const [spendingShow, setSpendingShow] = useState(false);
  const [incomeShow, setIncomeShow] = useState(false);

  const getSpendingCategories = async () => {
    if (!user?.email) return;

    try {
      const response = await axios.get("/api/users");
      const userData = response.data.find((item: any) => item.email === user.email);

      if (userData?.spendingCategories?.length > 0) {
        const formattedCategories = userData.spendingCategories.map((category: string) => ({
          value: category,
          label: category,
        }));

        dispatch(setSpendingCategoryData({ categories: formattedCategories }));
      } else {
        console.log("No Categories");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getIncomeCategories = async () => {
    if (!user?.email) return;

    try {
      const response = await axios.get("/api/users");
      const userData = response.data.find((item: any) => item.email === user.email);

      if (userData?.incomeCategories?.length > 0) {
        const formattedCategories = userData.incomeCategories.map((category: string) => ({
          value: category,
          label: category,
        }));

        dispatch(setIncomeCategoryData({ categories: formattedCategories }));
      } else {
        console.log("No Categories");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user?.email && spendingCategories.length === 0) {
      getSpendingCategories();
    }
    if (user?.email && incomeCategories.length === 0) {
      getIncomeCategories();
    }
  }, [user?.email]);

  const setData = async (type: string) => {
    const response = await axios.post("/api/users/update", {
      email: email,
      transactionData: transactionData,
      type: type,
    });
    const data = response.data;

    if (data.message === "Data Updated" && data.data) {
      dispatch(setUserData({ spending: data.data.spending, income: data.data.income }));
    } else {
      console.log("Failed to update data");
    }

    clearData();
    onClose();
  };

  const clearData = () => {
    setTransactionError({
      name: false,
      value: false,
      category: false,
    });

    setTransactionData({
      name: "",
      value: "",
      category: "",
      date: new Date().toISOString(),
      id: uuidv4(),
    });
  };

  const handleSave = (type: string) => {
    const trimmedName = transactionData.name.trim();
    const trimmedCategory = transactionData.category.trim();
    const trimmedValue = transactionData.value.trim();

    let error = {
      name: false,
      value: false,
      category: false,
    };

    if (!trimmedName) {
      error.name = true;
    }
    if (!trimmedValue || isNaN(Number(trimmedValue)) || Number(trimmedValue) <= 0) {
      error.value = true;
    }
    if (!trimmedCategory) {
      error.category = true;
    }

    setTransactionError(error);

    if (error.name || error.value || error.category) {
      return;
    }

    setData(type);
  };

  return (
    <div className={styles.modal__overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal__header}>
          <h2>{title}</h2>
          <button className={styles.modal__closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        <div
          className={styles.modal__choice}
          onClick={() => {
            setSpendingShow(!spendingShow);
            clearData();
            if (incomeShow) {
              setIncomeShow(false);
            }
          }}>
          <p className={styles.modal__choice_header}>Spending</p>
          <div className={styles.modal__choice_button}>
            <Image
              className={spendingShow ? styles.modal__choice_button_image_rotated : styles.modal__choice_button_image}
              src="/Icons/expand-more.png"
              alt="Expand More Icon"
              width={30}
              height={20}
            />
          </div>
        </div>
        <div className={spendingShow ? styles.modal__content_show : styles.modal__content}>
          <div className={styles.modal__content_show_inputs}>
            <label>
              Name
              <input
                type="text"
                placeholder="Name"
                value={transactionData.name}
                onChange={(e) =>
                  setTransactionData({
                    ...transactionData,
                    name: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Price
              <input
                type="number"
                placeholder="Value"
                value={transactionData.value}
                onChange={(e) => {
                  const value = e.target.value;
                  const regex = /^\d*\.{0,1}\d{0,2}$/;
                  if (regex.test(value)) {
                    setTransactionData({
                      ...transactionData,
                      value: value,
                    });
                  }
                }}
              />
            </label>
            <label>
              Category
              {spendingCategories.length > 0 ? (
                <Select
                  styles={{
                    control: (baseStyles) => ({
                      ...baseStyles,
                      minHeight: "50px",
                      borderRadius: "12px",
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      height: "50px",
                      display: "flex",
                      alignItems: "center",
                      borderTopLeftRadius: "12px",
                      borderBottomLeftRadius: "12px",
                      backgroundColor: "#d3d3d3",
                    }),
                    input: (base) => ({
                      ...base,
                      margin: "-5px",
                      borderTopRightRadius: "12px",
                      borderBottomRightRadius: "12px",
                      cursor: "pointer",
                    }),
                    indicatorsContainer: (base) => ({
                      ...base,
                      height: "50px",
                      backgroundColor: "#d3d3d3",
                      borderTopRightRadius: "12px",
                      borderBottomRightRadius: "12px",
                      cursor: "pointer",
                    }),
                  }}
                  options={spendingCategories}
                  value={spendingCategories.find((option) => option.value === transactionData.category) || null}
                  onChange={(selectedOption) =>
                    setTransactionData({
                      ...transactionData,
                      category: selectedOption ? selectedOption.value : "",
                    })
                  }
                />
              ) : (
                <p>Loading...</p>
              )}
            </label>
          </div>
          {(transactionError.name || transactionError.value || transactionError.category) && <p className={styles.modal__content_show_error}>Every data must be filled.</p>}
          <div className={styles.modal__content_show_buttons}>
            <Button onClick={() => handleSave("spending")} text="Save" variant="green" />
            <Button onClick={onClose} text="Cancel" variant="white" />
          </div>
        </div>
        <div
          className={styles.modal__choice}
          onClick={() => {
            setIncomeShow(!incomeShow);
            clearData();
            if (spendingShow) {
              setSpendingShow(false);
            }
          }}>
          <p className={styles.modal__choice_header}>Income</p>
          <div className={styles.modal__choice_button}>
            <Image className={incomeShow ? styles.modal__choice_button_image_rotated : styles.modal__choice_button_image} src="/Icons/expand-more.png" alt="Expand More Icon" width={30} height={20} />
          </div>
        </div>
        <div className={incomeShow ? styles.modal__content_show : styles.modal__content}>
          <div className={styles.modal__content_show_inputs}>
            <label>
              Name
              <input
                type="text"
                placeholder="Name"
                value={transactionData.name}
                onChange={(e) =>
                  setTransactionData({
                    ...transactionData,
                    name: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Price
              <input
                type="number"
                placeholder="Value"
                value={transactionData.value}
                onChange={(e) => {
                  const value = e.target.value;
                  const regex = /^\d*\.{0,1}\d{0,2}$/;
                  if (regex.test(value)) {
                    setTransactionData({
                      ...transactionData,
                      value: value,
                    });
                  }
                }}
              />
            </label>
            <label>
              Category
              {incomeCategories.length > 0 ? (
                <Select
                  styles={{
                    control: (baseStyles) => ({
                      ...baseStyles,
                      minHeight: "50px",
                      borderRadius: "12px",
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      height: "50px",
                      display: "flex",
                      alignItems: "center",
                      borderTopLeftRadius: "12px",
                      borderBottomLeftRadius: "12px",
                      backgroundColor: "#d3d3d3",
                    }),
                    input: (base) => ({
                      ...base,
                      margin: "-5px",
                      borderTopRightRadius: "12px",
                      borderBottomRightRadius: "12px",
                      cursor: "pointer",
                    }),
                    indicatorsContainer: (base) => ({
                      ...base,
                      height: "50px",
                      backgroundColor: "#d3d3d3",
                      borderTopRightRadius: "12px",
                      borderBottomRightRadius: "12px",
                      cursor: "pointer",
                    }),
                  }}
                  options={incomeCategories}
                  value={incomeCategories.find((option) => option.value === transactionData.category) || null}
                  onChange={(selectedOption) =>
                    setTransactionData({
                      ...transactionData,
                      category: selectedOption ? selectedOption.value : "",
                    })
                  }
                />
              ) : (
                <p>Loading...</p>
              )}
            </label>
          </div>
          {(transactionError.name || transactionError.value || transactionError.category) && <p className={styles.modal__content_show_error}>Every data must be filled.</p>}
          <div className={styles.modal__content_show_buttons}>
            <Button onClick={() => handleSave("income")} text="Save" variant="green" />
            <Button onClick={onClose} text="Cancel" variant="white" />
          </div>
        </div>
      </div>
    </div>
  );
}

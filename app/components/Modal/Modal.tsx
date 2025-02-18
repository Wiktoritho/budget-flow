"use client";
import axios from "axios";
import styles from "./Modal.module.scss";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "@/app/store/authSlice";
import { v4 as uuidv4 } from "uuid";
import Button from "../Button/Button";
import Select from "react-select";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

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

  const [transactionData, setTransactionData] = useState({
    name: "",
    value: "",
    category: "",
    date: new Date().toISOString(),
    id: uuidv4(),
  });

  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);

  const [transactionError, setTransactionError] = useState({
    name: true,
    value: true,
    category: true,
  });

  const getCategories = async () => {
    try {
      const response = await axios.get("/api/users");
      const userData = response.data.find(
        (item: any) => item.email === user?.email
      );

      if (userData && userData.categories) {
        setCategories(
          userData.categories.map((category: string) => ({
            value: category,
            label: category,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    if (user?.email) {
      getCategories();
    }
  }, [user?.email]);

  const setData = async () => {
    const response = await axios.post("/api/users/update", {
      email: email,
      transactionData: transactionData,
    });
    const data = response.data;

    if (data.message === "Data Updated" && data.data) {
      dispatch(
        setUserData({ spending: data.data.spending, income: data.data.income })
      );
    } else {
      console.log("Failed to update data");
    }

    setTransactionData({
      name: "",
      value: "",
      category: "",
      date: new Date().toISOString(),
      id: uuidv4(),
    });
    onClose();
  };

  const handleSave = () => {
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
    if (
      !trimmedValue ||
      isNaN(Number(trimmedValue)) ||
      Number(trimmedValue) <= 0
    ) {
      error.value = true;
    }
    if (!trimmedCategory) {
      error.category = true;
    }

    setTransactionError(error);

    if (error.name || error.value || error.category) {
      console.log(error);
      return;
    }

    setData();
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
        <div className={styles.modal__content}>
          <div className={styles.modal__content_inputs}>
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
              {categories.length > 0 ? (
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
                    }),
                    indicatorsContainer: (base) => ({
                      ...base,
                      height: "50px",
                      backgroundColor: "#d3d3d3",
                      stroke: "white",
                      borderTopRightRadius: "12px",
                      borderBottomRightRadius: "12px",
                    }),
                  }}
                  options={categories}
                  value={
                    categories.find(
                      (option) => option.value === transactionData.category
                    ) || null
                  }
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
          <div className={styles.modal__content_buttons}>
            <Button onClick={handleSave} text="Save" variant="green" />
            <Button onClick={onClose} text="Cancel" variant="white" />
          </div>
        </div>
      </div>
    </div>
  );
}

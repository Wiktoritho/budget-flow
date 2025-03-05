"use client";
import styles from "./SmallModal.module.scss";
import Button from "../Button/Button";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import { useState } from "react";
import Select from "react-select";
import { Category } from "@/app/store/incomeCategorySlice";
import { useIncomeCategories } from "@/app/context/IncomeCategoriresContext";
import { useSpendingCategories } from "@/app/context/SpendingCategoriesContext";
import { setUserData } from "@/app/store/authSlice";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface ObjectProps {
  id: number;
  type: string;
}

interface ModalProps {
  isOpen: Boolean;
  title: string;
  onClose: () => void;
  email: string | undefined;
  transactionId: ObjectProps;
}

export default function SmallModal({ isOpen, title, onClose, email, transactionId }: ModalProps) {
  if (!isOpen) return null;

  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { spendingCategories } = useSelector((state: RootState) => state.spendingCategory);
  const { incomeCategories } = useSelector((state: RootState) => state.incomeCategory);
  const [tempCategories, setTempCategories] = useState<Category[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);

  const { getIncomeCategories } = useIncomeCategories();
  const { getSpendingCategories } = useSpendingCategories();

  const [transactionError, setTransactionError] = useState({
    name: false,
    value: false,
    category: false,
  });

  const [transactionData, setTransactionData] = useState({
    name: "",
    value: "",
    category: "",
    date: new Date().toISOString(),
    id: transactionId.id,
  });

  useEffect(() => {
    if (user?.email && spendingCategories.length === 0) {
      getSpendingCategories();
    }
    if (user?.email && incomeCategories.length === 0) {
      getIncomeCategories();
    }
  }, [user?.email]);

  useEffect(() => {
    if (transactionId.type === "spending") {
      setTempCategories(spendingCategories);
    } else if (transactionId.type === "income") {
      setTempCategories(incomeCategories);
    }
  }, [spendingCategories, incomeCategories]);

  const setData = async (type: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setTransactionData({
      ...transactionData,
      id: transactionId.id,
    });
    const response = await axios.post("/api/users/edit", {
      email: email,
      transactionData: transactionData,
      type: type,
    });
    const data = response.data;

    if (data.message === "Data Updated" && data.data) {
      dispatch(setUserData({ spending: data.data.spending, income: data.data.income, name: data.data.name }));
      setIsProcessing(false);
    } else {
      console.log("Failed to update data");
      setIsProcessing(false);
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
      id: transactionId.id,
    });

    setStartDate(null);
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
        <div className={styles.modal__content_show}>
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
              {tempCategories.length > 0 ? (
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
                  options={tempCategories}
                  value={tempCategories.find((option) => option.value === transactionData.category) || null}
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
            <label>
              Date
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  setTransactionData({
                    ...transactionData,
                    date: date ? date.toISOString() : new Date().toISOString(),
                  });
                }}
                placeholderText="Select date"
              />
            </label>
          </div>
          {(transactionError.name || transactionError.value || transactionError.category) && <p className={styles.modal__content_show_error}>Every data must be filled.</p>}
          <div className={styles.modal__content_show_buttons}>
            <Button onClick={() => handleSave(transactionId.type)} text="Save" variant="green" />
            <Button onClick={onClose} text="Cancel" variant="white" />
          </div>
        </div>
      </div>
    </div>
  );
}

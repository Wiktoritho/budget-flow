"use client";
import styles from "./SmallModal.module.scss";
import Button from "../Button/Button";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import { useState } from "react";
import Select from "react-select";
import { setSpendingCategoryData } from "@/app/store/spendingCategorySlice";
import { setIncomeCategoryData } from "@/app/store/incomeCategorySlice";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Category } from "@/app/store/incomeCategorySlice";

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
    const { incomeCategories } = useSelector((state: RootState) => state.incomeCategoryReducer);
    const [tempCategories, setTempCategories] = useState<Category[]>([])

  const [transactionData, setTransactionData] = useState({
    name: "",
    value: "",
    category: "",
    date: new Date().toISOString(),
    id: uuidv4(),
  });

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
    
    useEffect(() => {
        if (transactionId.type === 'spending') {
            setTempCategories(spendingCategories)
        } else if (transactionId.type === 'income') {
            setTempCategories(incomeCategories)
        } 

        
    }, [spendingCategories, incomeCategories])

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
              <input type="text" placeholder="Name" />
            </label>
            <label>
              Price
              <input type="number" placeholder="Value" />
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
                  //t
              )}
            </label>
          </div>
          <div className={styles.modal__content_show_buttons}>
            <Button onClick={onClose} text="Save" variant="green" />
            <Button onClick={onClose} text="Cancel" variant="white" />
          </div>
        </div>
      </div>
    </div>
  );
}

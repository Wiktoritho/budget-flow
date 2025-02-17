"use client";
import axios from "axios";
import styles from "./Modal.module.scss";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "@/app/store/authSlice";
import { v4 as uuidv4 } from "uuid";

interface ModalProps {
  isOpen: Boolean;
  title: string;
  onClose: () => void;
  email: string | undefined;
}

export default function Modal({ isOpen, onClose, title, email }: ModalProps) {
  if (!isOpen) return null;

  const dispatch = useDispatch();

  const [transactionData, setTransactionData] = useState({
    name: "",
    value: 0,
    category: "",
    date: new Date().toISOString(),
    id: uuidv4()
  });

  const setData = async () => {
    const response = await axios.post("/api/users/update", {
      email: email,
      transactionData: transactionData,
    });
    const data = response.data;

    if (data.message === "Data Updated" && data.data) {
      dispatch(setUserData({ spending: data.data.spending, income: data.data.income }));
    } else {
        console.log("Failed to update data");
        
    }

    setTransactionData({ name: "", value: 0, category: "", date: new Date().toISOString(), id: uuidv4() });
    onClose();
  };

  const handleSave = () => {
    const trimmedName = transactionData.name.trim();
    const trimmedCategory = transactionData.category.trim();

    if (!trimmedName || transactionData.value <= 0 || !trimmedCategory) {
      alert("Please fill all fields correctly.");
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
          <input type="text" placeholder="Name" value={transactionData.name} onChange={(e) => setTransactionData({ ...transactionData, name: e.target.value })} />
          <input type="number" placeholder="Value" value={transactionData.value} onChange={(e) => setTransactionData({ ...transactionData, value: Number(e.target.value) })} />
          <input type="text" placeholder="Category" value={transactionData.category} onChange={(e) => setTransactionData({ ...transactionData, category: e.target.value })} />
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

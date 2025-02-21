"use client";

import { Formik } from "formik";
import Button from "../Button/Button";
import styles from "./UserForm.module.scss";
import Image from "next/image";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";
import { useState } from "react";

interface FormValues {
  email: string;
  password: string;
}

export default function LoginForm({ type }: { type: string }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (values: FormValues, helpers: any) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const response = await axios.post("/api/login", values);
      if (response.status === 200) {
        Cookie.set("user", JSON.stringify({ email: values.email }), { expires: 7 });
        dispatch(login({ email: values.email, spending: [], income: [] }));
        router.push("/dashboard");
        setIsProcessing(false);
      }
    } catch (error: any) {
      if (error.response) {
        helpers.setErrors({ password: error.response.data.error });
        setIsProcessing(false);
      } else {
        console.error("Error: ", error.message);
        setIsProcessing(false);
      }
    }
  };

  const handleRegister = async (values: FormValues, helpers: any) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const response = await axios.post("/api/register", values);
      if (response.status === 200) {
        setIsProcessing(false);
      }
    } catch (error: any) {
      if (error.response) {
        helpers.setErrors({ password: error.response.data.error });
        setIsProcessing(false);
      } else {
        console.error("Error: ", error.message);
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles.login__header}>
        <Image src="/Icons/Icon-wallet.png" alt="wallet icon" width={40} height={48} />
        <h1>BudgetFlow</h1>
      </div>
      <Formik<FormValues>
        initialValues={{ email: "", password: "" }}
        validate={(values) => {
          const errors: Record<string, string> = {};
          if (!values.email) {
            errors.email = "Email is required";
          } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = "Invalid email address";
          }

          if (!values.password) {
            errors.password = "Password is required";
          } else if (values.password.length < 6) {
            errors.password = "Password must be at least 6 characters long";
          }

          return errors;
        }}
        onSubmit={(values, helpers) => {
          if (type === "Log in") {
            handleLogin(values, helpers);
          } else {
            handleRegister(values, helpers);
          }
        }}>
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <form onSubmit={handleSubmit} className={styles.login__form}>
            <label className={styles.login__form_label}>
              Email
              <input className={styles.login__form_input} type="email" name="email" onChange={handleChange} onBlur={handleBlur} value={values.email} />
              {errors.email && touched.email && <div className={styles.login__form_error}>{errors.email}</div>}
            </label>

            <label className={styles.login__form_label}>
              Password
              <input className={styles.login__form_input} type="password" name="password" onChange={handleChange} onBlur={handleBlur} value={values.password} />
              {errors.password && touched.password && <div className={styles.login__form_error}>{errors.password}</div>}
            </label>
            <div className={styles.login__form_buttons}>
              <Button text={type} variant="green" disabled={false} />
              {type === "Log in" && <p>Forgot your password?</p>}
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}

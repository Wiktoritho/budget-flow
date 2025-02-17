"use client";

import { Formik } from "formik";
import Button from "../Button/Button";
import styles from "./UserForm.module.scss";
import Image from "next/image";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import { useRouter } from "next/navigation";
import Cookie from 'js-cookie';

interface FormValues {
  email: string;
  password: string;
}

export default function LoginForm({ type }: { type: string }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (values: FormValues) => {
    try {
      const response = await axios.post("/api/login", values);
      Cookie.set('user', JSON.stringify({email: values.email}), { expires: 7})
      dispatch(login({ email: values.email }));
      router.push('/dashboard')
    } catch (error: any) {
      if (error.response) {
        console.error(error.response.data.error);
      } else {
        console.error("Error: ", error.message);
      }
    }
  };

  const handleRegister = async (values: FormValues) => {
    try {
      const response = await axios.post("/api/register", values);
    } catch (error) {
      console.error(error);
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
        onSubmit={(values, { setSubmitting }) => {
          if (type === "Log in") {
            handleLogin(values);
          } else {
            handleRegister(values);
          }
          setSubmitting(false);
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
              <Button text={type} variant="green" />
              {type === "Log in" && <p>Forgot your password?</p>}
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}

"use client";

import { Formik } from "formik";
import Button from "../Button/Button";
import styles from "./UserForm.module.scss";
import Image from "next/image";

interface FormValues {
  email: string;
  password: string;
}

export default function LoginForm({ type }: { type: string }) {
  return (
    <div className={styles.login}>
      <div className={styles.login__header}>
        <Image src="/Icons/Icon-wallet.png" alt="wallet icon" width={40} height={48}/>
        <h1>BudgetFlow</h1>
      </div>
      <Formik<FormValues>
        initialValues={{ email: "", password: "" }}
        validate={(values) => {
          const errors: Record<string, string> = {};
          if (!values.email) {
            errors.email = "Email is required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }

          if (!values.password) {
            errors.password = "Password is required";
          }

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit} className={styles.login__form}>
            <label className={styles.login__form_label}>
              Username
              <input
                className={styles.login__form_input}
                type="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
              {errors.email && touched.email && (
                <div className={styles.login__form_error}>{errors.email}</div>
              )}
            </label>

            <label className={styles.login__form_label}>
              Password
              <input
                className={styles.login__form_input}
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
              {errors.password && touched.password && (
                <div className={styles.login__form_error}>
                  {errors.password}
                </div>
              )}
            </label>
            <div className={styles.login__form_buttons}>
              <Button text={type} variant="green" />
              { type === "Log in" && <p>Forgot your password?</p>}
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}

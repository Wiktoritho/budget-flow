"use client";
import { useEffect, useState, useMemo, forwardRef, ForwardedRef, Ref } from "react";
import styles from "./GrayContainer.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import dynamic from "next/dynamic";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface GrayContainerProps {
  title: string;
  transactionType: string;
  selects: boolean;
}

interface InputProps {
  value: string;
  onClick: () => void;
  className?: string;
}

export default function GrayContainer({ title, transactionType, selects }: GrayContainerProps) {
  const { spendingCategories } = useSelector((state: RootState) => state.spendingCategory);
  const { incomeCategories } = useSelector((state: RootState) => state.incomeCategory);
  const { user } = useSelector((state: RootState) => state.auth);
  const [showBar, setShowBar] = useState(false);
  const [pieChart, setPieChart] = useState(false);

  const [currentDates, setCurrentDates] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: new Date(),
    end: null,
  });
  const [comparedDates, setComparedDates] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: new Date(),
    end: null,
  });

  const [currentValues, setCurrentValues] = useState<{ value: number; category: string }[]>([]);
  const [comparedValues, setComparedValues] = useState<{ value: number; category: string }[]>([]);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const colors = ["#FF0000", "green", "#0000FF", "orange", "#30d5c8", "#FF00FF", "#C0C0C0", "#808080", "#800000", "#808000", "#000080", "#800080"];

  const onChange = (dates: (Date | null)[], type: "current" | "compared") => {
    const [start, end] = dates;
    if (type === "current") {
      setCurrentDates({ start, end });
      if (end) {
        setShowBar(true);
        setPieChart(true)
      }
    } else {
      setComparedDates({ start, end });
      if (end) {
        setShowBar(true);
      }
    }
  };

  const filterData = (data: any[], startDate: Date | null, endDate: Date | null) => {
    if (startDate && endDate) {
      return data.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }
    return [];
  };

  const updateValues = (data: any[], startDate: Date | null, endDate: Date | null, setValues: React.Dispatch<React.SetStateAction<any[]>>, categories: string[]) => {
    const filteredData = filterData(data, startDate, endDate);

    const groupedData = filteredData.reduce((acc, element) => {
      const { value, category } = element;

      const numericValue = parseFloat(value);

      if (acc[category]) {
        acc[category] += numericValue;
      } else {
        acc[category] = numericValue;
      }

      return acc;
    }, {} as { [category: string]: number });

    const result = categories.map((category) => ({
      value: groupedData[category] || 0,
      category,
    }));

    setValues(result);
  };

  useEffect(() => {
    if (transactionType === "spending" && user?.spending) {
      updateValues(user.spending, currentDates.start, currentDates.end, setCurrentValues, categories);
      updateValues(user.spending, comparedDates.start, comparedDates.end, setComparedValues, categories);
    } else if (transactionType === "income" && user?.income) {
      updateValues(user.income, currentDates.start, currentDates.end, setCurrentValues, categories);
      updateValues(user.income, comparedDates.start, comparedDates.end, setComparedValues, categories);
    }
  }, [user, currentDates, comparedDates, transactionType]);

  useEffect(() => {
    if (!currentDates.end && !comparedDates.end) {
      setShowBar(false);
      setPieChart(false)
    }
  }, [currentDates.end, comparedDates.end]);

  const spendingSeries = useMemo(() => {
    return [
      {
        name: transactionType === "spending" ? "Current period spendings" : "Current period incomes",
        data: currentValues.map((element) => element.value),
      },
      {
        name: transactionType === "spending" ? "Compared period spendings" : "Compared period incomes",
        data: comparedValues.map((element) => element.value),
      },
    ];
  }, [currentValues, comparedValues, transactionType]);

  const monthlyOverview = useMemo(() => {
    const flowByMonth: number[] = new Array(12).fill(0);

    if (user?.spending && transactionType === "spending") {
      user.spending.forEach((transaction) => {
        const date = new Date(transaction.date);
        const monthIndex = date.getMonth();

        const value = Number(transaction.value);
        if (!isNaN(value)) {
          flowByMonth[monthIndex] += value;
        }
      });
    } else if (user?.income && transactionType === "income") {
      user.income.forEach((transaction) => {
        const date = new Date(transaction.date);
        const monthIndex = date.getMonth();

        const value = Number(transaction.value);
        if (!isNaN(value)) {
          flowByMonth[monthIndex] += value;
        }
      });
    }

    return flowByMonth;
  }, [user?.spending]);

  const BarChart = useMemo(() => dynamic(() => import("../BarChart/BarChart"), { ssr: false }), []);

  const PieChart = useMemo(() => dynamic(() => import("../PieChart/PieChart"), { ssr: false }), []);

  const DateInput = forwardRef<HTMLButtonElement, InputProps>(({ value, onClick, className }: InputProps, ref: Ref<HTMLButtonElement>) => {
    return (
      <button className={className} onClick={onClick} ref={ref}>
        {value}
      </button>
    );
  });

  const categories = useMemo(() => {
    return transactionType === "spending" ? spendingCategories.map((category) => category.label) : incomeCategories.map((category) => category.label);
  }, [spendingCategories, incomeCategories, transactionType]);

  return (
    <div className={styles.grayContainer}>
      <h3>{title}</h3>
      {selects && (
        <>
          <div className={styles.grayContainer__navigation}>
            <div className={styles.grayContainer__navigation_block}>
              <p>Current period</p>
              <DatePicker
                selected={transactionType === "spending" ? currentDates.start : currentDates.start}
                onChange={(dates) => onChange(dates, "current")}
                startDate={currentDates.start}
                endDate={currentDates.end}
                selectsRange
                customInput={<DateInput value="Select date" onClick={() => { }} className={styles.grayContainer__currentInput} />}
                calendarClassName={styles.grayContainer__calendar}
              />
            </div>
            <div className={styles.grayContainer__navigation_block}>
              <p>Compared period</p>
              <DatePicker
                selected={transactionType === "spending" ? comparedDates.start : comparedDates.start}
                onChange={(dates) => onChange(dates, "compared")}
                startDate={comparedDates.start}
                endDate={comparedDates.end}
                selectsRange
                customInput={<DateInput value="Select date" onClick={() => { }} className={styles.grayContainer__comparedInput} />}
                calendarClassName={styles.grayContainer__calendar}
              />
            </div>
          </div>
          {showBar && <BarChart categories={categories} seriesData={spendingSeries} />}
        </>
      )}
      {pieChart && (
        <div className={styles.grayContainer__bottom}>
          <div className={styles.grayContainer__bottom_block}>
            <p>{transactionType === "spending" ? "Overall monthly spending" : "Overall monthly income"}</p>
            <PieChart labels={categories} seriesData={spendingSeries[0].data} />
          </div>
          <div className={styles.grayContainer__bottom_block}>
            <p>{transactionType === "spending" ? "Monthly spending" : "Monthly income"}</p>
            <BarChart
              categories={months}
              seriesData={[
                {
                  name: transactionType === "spending" ? "Monthly spendings" : "Monthly incomes",
                  data: monthlyOverview,
                },
              ]}
              colors={colors}
            />
          </div>
        </div>
      )}
    </div>
  );
}

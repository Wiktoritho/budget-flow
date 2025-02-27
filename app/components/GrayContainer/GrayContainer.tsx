"use client";
import { useEffect, useState, useMemo } from "react";
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

export default function GrayContainer({
  title,
  transactionType,
  selects,
}: GrayContainerProps) {
  const { spendingCategories } = useSelector((state: RootState) => state.spendingCategory);
  const { incomeCategories } = useSelector((state: RootState) => state.incomeCategory);
  const { user } = useSelector((state: RootState) => state.auth);
  const [showBar, setShowBar] = useState(false)
  const [lastSelectedEndDate, setLastSelectedEndDate] = useState<Date | null>(null);

  const [currentDates, setCurrentDates] = useState<{ start: Date | null; end: Date | null }>({
    start: new Date(),
    end: null,
  });
  const [comparedDates, setComparedDates] = useState<{ start: Date | null; end: Date | null }>({
    start: new Date(),
    end: null,
  });

  const [currentValues, setCurrentValues] = useState<number[]>([]);
  const [comparedValues, setComparedValues] = useState<number[]>([]);

  const onChange = (dates: (Date | null)[], type: "current" | "compared") => {
    const [start, end] = dates;
    if (type === "current") {
      setCurrentDates({ start, end });
      if (end) {
        setLastSelectedEndDate(end);
        setShowBar(true)
      }
    } else {
      setComparedDates({ start, end });
      if (end) {
        setLastSelectedEndDate(end);
        setShowBar(true)
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

  const updateValues = (data: any[], startDate: Date | null, endDate: Date | null, setValues: React.Dispatch<React.SetStateAction<number[]>>) => {
    const filteredData = filterData(data, startDate, endDate);
    setValues(filteredData.map((element) => element.value));
  };

  useEffect(() => {
    if (transactionType === "spending" && user?.spending) {
      updateValues(user.spending, currentDates.start, currentDates.end, setCurrentValues);
      updateValues(user.spending, comparedDates.start, comparedDates.end, setComparedValues);
    } else if (transactionType === "income" && user?.income) {
      updateValues(user.income, currentDates.start, currentDates.end, setCurrentValues);
      updateValues(user.income, comparedDates.start, comparedDates.end, setComparedValues);
    }
  }, [user, currentDates, comparedDates, transactionType]);

  useEffect(() => {
    if (!currentDates.end && !comparedDates.end) {
      setShowBar(false);
    }
  }, [currentDates.end, comparedDates.end]);

  const spendingSeries = useMemo(() => {
    return [
      {
        name: transactionType === "spending" ? "Current period spendings" : "Current period incomes",
        data: [...currentValues]
      },
      {
        name: transactionType === "spending" ? "Compared period spendings" : "Compared period incomes",
        data: [...comparedValues]
      },
    ];
  }, [currentValues, comparedValues, transactionType]);

  const BarChart = useMemo(() => dynamic(() => import("../BarChart/BarChart"), { ssr: false }), []);

  const categories = useMemo(() => {
    console.log(spendingCategories.map((category) => category.label));
    
    return transactionType === "spending"
      ? spendingCategories.map((category) => category.label)
      : incomeCategories.map((category) => category.label);
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
              />
            </div>
          </div>
          {showBar && <BarChart categories={categories} seriesData={spendingSeries} />}
        </>
      )}
    </div>
  );
}

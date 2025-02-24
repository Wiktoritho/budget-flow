"use client";
import { useEffect, useState, useMemo } from "react";
import styles from "./GrayContainer.module.scss";
import Select, { StylesConfig } from "react-select";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import dynamic from "next/dynamic";

interface GrayContainerProps {
  title: string;
  transactionType: string;
  selects: boolean;
}

interface Option {
  label: string;
  value: string;
}

const spendingCurrentPeriods: Option[] = [
  { label: "Today", value: "today" },
  { label: "This week", value: "this_week" },
  { label: "This month", value: "this_month" },
  { label: "This year", value: "this_year" },
];

const spendingComparedPeriods: Option[] = [
  { label: "Yesterday", value: "yesterday" },
  { label: "Last week", value: "last_week" },
  { label: "Last month", value: "last_month" },
  { label: "Last year", value: "last_year" },
];

const incomeCurrentPeriods: Option[] = [
  { label: "Today", value: "today" },
  { label: "This week", value: "this_week" },
  { label: "This month", value: "this_month" },
  { label: "This year", value: "this_year" },
];

const incomeComparedPeriods: Option[] = [
  { label: "Yesterday", value: "yesterday" },
  { label: "Last week", value: "last_week" },
  { label: "Last month", value: "last_month" },
  { label: "Last year", value: "last_year" },
];

const customSelectStyles: StylesConfig<Option, false> = {
  control: (baseStyles) => ({
    ...baseStyles,
    minHeight: 50,
    borderRadius: 12,
  }),
  valueContainer: (base) => ({
    ...base,
    height: 50,
    display: "flex",
    alignItems: "center",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: "#fff",
  }),
  input: (base) => ({
    ...base,
    margin: "-5px",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    cursor: "pointer",
  }),
  indicatorsContainer: (base) => ({
    ...base,
    height: 50,
    backgroundColor: "#fff",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    cursor: "pointer",
  }),
};

const getDateRange = (period: string) => {
  const today = new Date();
  const startDate = new Date(today);
  let endDate = new Date(today);

  switch (period) {
    case "today":
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case "this_week":
      const dayOfWeek = today.getDay();
      const diff = today.getDate() - dayOfWeek;
      startDate.setDate(diff);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      break;
    case "this_month":
      startDate.setDate(1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      break;
    case "this_year":
      startDate.setMonth(0, 1);
      endDate = new Date(today.getFullYear(), 11, 31);
      break;
    case "yesterday":
      startDate.setDate(today.getDate() - 1);
      endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999);
      break;
    case "last_week":
      const lastWeekStart = new Date(today);
      lastWeekStart.setDate(today.getDate() - today.getDay() - 7);
      startDate.setDate(lastWeekStart.getDate());
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      break;
    case "last_month":
      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      startDate.setDate(lastMonthStart.getDate());
      endDate = new Date(lastMonthStart.getFullYear(), lastMonthStart.getMonth() + 1, 0);
      break;
    case "last_year":
      startDate.setFullYear(today.getFullYear() - 1, 0, 1);
      endDate = new Date(today.getFullYear() - 1, 11, 31);
      break;
    default:
      break;
  }

  return { startDate, endDate };
};

export default function GrayContainer({ title, transactionType, selects }: GrayContainerProps) {
  const [currentSpendingPeriod, setCurrentSpendingPeriod] = useState<Option | null>(spendingCurrentPeriods[1]);
  const [comparedSpendingPeriod, setComparedSpendingPeriod] = useState<Option | null>(spendingComparedPeriods[1]);
  const [currentIncomePeriod, setCurrentIncomePeriod] = useState<Option | null>(incomeCurrentPeriods[1]);
  const [comparedIncomePeriod, setComparedIncomePeriod] = useState<Option | null>(incomeComparedPeriods[1]);
  const { spendingCategories } = useSelector((state: RootState) => state.spendingCategory);
  const { incomeCategories } = useSelector((state: RootState) => state.incomeCategory);
  const { user } = useSelector((state: RootState) => state.auth);
  const [currentSpendingValues, setCurrentSpendingValues] = useState<number[]>([]);
  const [comparedSpendingValues, setComparedSpendingValues] = useState<number[]>([]);
  const [currentIncomeValues, setCurrentIncomeValues] = useState<number[]>([]);
  const [comparedIncomeValues, setComparedIncomeValues] = useState<number[]>([]);

  const BarChart = dynamic(() => import('../BarChart/BarChart'), {ssr: false})

  useEffect(() => {
    const { startDate, endDate } = getDateRange(currentSpendingPeriod?.value || "this_week");

    if (user?.spending && user.spending.length > 0 && transactionType === "spending") {
      const filteredSpending = user.spending.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
      setCurrentSpendingValues(filteredSpending.map((element) => element.value));
    }
  }, [user?.spending, transactionType, currentSpendingPeriod]);

  useEffect(() => {
    const { startDate, endDate } = getDateRange(currentIncomePeriod?.value || "this_week");

    if (user?.income && user.income.length > 0 && transactionType === "income") {
      const filteredIncome = user.income.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
      setCurrentIncomeValues(filteredIncome.map((element) => element.value));
    }
  }, [user?.income, transactionType, currentIncomePeriod]);

  useEffect(() => {
    const { startDate, endDate } = getDateRange(comparedSpendingPeriod?.value || "last_week");

    if (user?.spending && user.spending.length > 0 && transactionType === "spending") {
      const filteredSpending = user.spending.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
      setComparedSpendingValues(filteredSpending.map((element) => element.value));
    }
  }, [user?.spending, transactionType, comparedSpendingPeriod]);

  useEffect(() => {
    const { startDate, endDate } = getDateRange(comparedIncomePeriod?.value || "last_week");

    if (user?.income && user.income.length > 0 && transactionType === "income") {
      const filteredIncome = user.income.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
      setComparedIncomeValues(filteredIncome.map((element) => element.value));
    }
  }, [user?.income, transactionType, comparedIncomePeriod]);

  const setComparedPeriod = (selected: any) => {
    if (transactionType === "spending") {
      setComparedSpendingPeriod(selected);
    }
    if (transactionType === "income") {
      setComparedIncomePeriod(selected);
    }
  };

  const setCurrentPeriod = (selected: any) => {
    if (transactionType === "spending") {
      setCurrentSpendingPeriod(selected);
    }
    if (transactionType === "income") {
      setCurrentIncomePeriod(selected);
    }
  };

  const spendingSeries = useMemo(() => {
    return [
      {
        name: transactionType === "spending" ? "Current period spendings" : "Current period incomes",
        data: transactionType === "spending" ? currentSpendingValues : currentIncomeValues,
      },
      {
        name: transactionType === "spending" ? "Compared period spendings" : "Compared period incomes",
        data: transactionType === "spending" ? comparedSpendingValues : comparedIncomeValues,
      },
    ];
  }, [currentSpendingValues, comparedSpendingValues, currentIncomeValues, comparedIncomeValues, transactionType]);

  const categories = transactionType === "spending" ? spendingCategories.map((category) => category.label) : incomeCategories.map((category) => category.label);

  return (
    <>
      <div className={styles.grayContainer}>
        <h3>{title}</h3>
        {selects && (
          <>
            <div className={styles.grayContainer__navigation}>
              <div className={styles.grayContainer__navigation_block}>
                <p>Current period</p>
                <Select
                  styles={customSelectStyles}
                  options={transactionType === "spending" ? spendingCurrentPeriods : incomeCurrentPeriods}
                  value={transactionType === "spending" ? currentSpendingPeriod : currentIncomePeriod}
                  onChange={(selected) => setCurrentPeriod(selected)}
                />
              </div>
              <div className={styles.grayContainer__navigation_block}>
                <p>Compared period</p>
                <Select
                  styles={customSelectStyles}
                  options={transactionType === "spending" ? spendingComparedPeriods : incomeComparedPeriods}
                  value={transactionType === "spending" ? comparedSpendingPeriod : comparedIncomePeriod}
                  onChange={(selected) => setComparedPeriod(selected)}
                />
              </div>
            </div>
            <BarChart categories={categories} seriesData={spendingSeries} />
          </>
        )}
      </div>
    </>
  );
}

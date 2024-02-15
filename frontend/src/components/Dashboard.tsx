import { DialogButton } from "@/components/ExpenseDialog";
import DatePicker from "@/components/datepicker/DatePicker";
import React, { useEffect } from "react";

import Budget from "@/components/budgetcard/Budget";
import CategoriesCard from "@/components/categorycard/CategoriesCard";
import OverviewCard from "./overviewcard/OverviewCard";
import SpendingCard from "./spendingcard/SpendingCard";
import { selectedDate } from "@/store/userStore";
import { useStore } from "@nanostores/react";

interface Props {
    month: string | null,
    year: string | null
}

const Dashboard: React.FC<Props> = ({ month, year }) => {
    const $selectedDate = useStore(selectedDate)

    useEffect(() => {
        const monthInt = month !== null ? parseInt(month) : null
        const yearInt = year !== null ? parseInt(year) : null

        const isValidMonth = monthInt !== null && monthInt >= 1 && monthInt <= 12;
        const isValidYear = yearInt !== null && yearInt >= 1900 && yearInt <= 2100;

        if (isValidMonth && isValidYear) {
            selectedDate.set({
                date: new Date(yearInt, monthInt - 1, 1),
                yearOnly: false
            })
        } else if (!isValidMonth && isValidYear) {
            selectedDate.set({
                ...$selectedDate,
                yearOnly: true
            })
        }
    }, [month, year])

    return (
        <>
            {/* <!-- Top --> */}
            <div className="flex items-center mt-3 flex-col justify-center gap-3 sm:flex-row sm:justify-between">
                <h1 className="text-center sm:text-left text-2xl font-bold">
                    Dashboard
                </h1>
                <div className="flex items-center gap-3.5">
                    <DatePicker />
                    <DialogButton />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row mt-5 gap-3.5">
                {/* <!-- Left side --> */}
                <div className="flex flex-col gap-3.5 max-w-96 w-full mx-auto">
                    <Budget />
                    <CategoriesCard />
                </div>

                {/* <!-- Right side --> */}
                <div className="flex flex-col gap-3.5 w-full">
                    <OverviewCard />
                    <SpendingCard />
                </div>
            </div>
        </>
    )
}

export default Dashboard
import { DialogButton } from "@/components/ExpenseDialog";
import DatePicker from "@/components/datepicker/DatePicker";
import { useStore } from "@nanostores/react";
import { selectedDate } from "@/store/userStore";
import { useEffect } from "react";

import Budget from "@/components/budgetcard/Budget";
import CategoriesCard from "@/components/categorycard/CategoriesCard";

function Dashboard() {
    const $selectedDate = useStore(selectedDate)
    useEffect(() => {
        console.log($selectedDate)
    }, [$selectedDate])

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

            <div className="flex flex-col sm:flex-row mt-5">
                {/* <!-- Left side --> */}
                <div className="flex flex-col gap-3.5 w-96">
                    <Budget />
                    <CategoriesCard />
                </div>

                {/* <!-- Right side --> */}
                {/* <div></div> */}
            </div>
        </>
    )
}

export default Dashboard
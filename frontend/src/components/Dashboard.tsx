import { DialogButton } from "@/components/ExpenseDialog";
import DatePicker from "@/components/datepicker/DatePicker";
import { useState, useEffect } from "react";

import Budget from "@/components/budgetcard/Budget";
import CategoriesCard from "@/components/categorycard/CategoriesCard";
import OverviewCard from "./overviewcard/OverviewCard";
import SpendingCard from "./spendingcard/SpendingCard";
import axios from "@/api/axios";

interface OTPSecret {
    ascii: string,
    hex: string,
    base32: string,
    otpauth_url: string
}


function Dashboard() {
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
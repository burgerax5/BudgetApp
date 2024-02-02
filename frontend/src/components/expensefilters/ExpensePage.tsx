import { useEffect } from 'react';
import { useStore } from '@nanostores/react'
import { filteredExpenses, isLoggedIn } from '@/store/userStore'
import ExpenseFilters from "@/components/expensefilters/ExpenseFilters";
import ExpensesTable from "@/components/ExpensesTable";

const ExpensePage = () => {
    const $filteredExpenses = useStore(filteredExpenses)
    const $isLoggedIn = useStore(isLoggedIn)

    useEffect(() => {
        if (!$isLoggedIn) location.replace('/login')
    }, [])

    return (
        <>
            <ExpenseFilters />
            <ExpensesTable take={undefined} showCheckbox={true} filteredExpenses={$filteredExpenses} />
        </>
    )
}

export default ExpensePage
import { useEffect } from 'react';
import { useStore } from '@nanostores/react'
import { filteredExpenses, isLoggedIn } from '@/store/userStore'
import ExpenseFilters from "@/components/expensefilters/ExpenseFilters";
import ExpensesTable from "@/components/ExpensesTable";
import ExpenseToolbar from './ExpenseToolbar';

const ExpensePage = () => {
    const $filteredExpenses = useStore(filteredExpenses)
    const $isLoggedIn = useStore(isLoggedIn)

    useEffect(() => {
        if (!$isLoggedIn) location.replace('/login')
    }, [])

    return (
        <>
            <ExpenseFilters />
            {/* <ExpenseToolbar /> */}
            <ExpensesTable take={undefined} showCheckboxAndToolbar={true} filteredExpenses={$filteredExpenses} />
        </>
    )
}

export default ExpensePage
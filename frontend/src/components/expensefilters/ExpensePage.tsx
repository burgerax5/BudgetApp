import { useEffect } from 'react';
import { useStore } from '@nanostores/react'
import { filteredExpenses, isLoggedIn, categories } from '@/store/userStore'
import ExpenseFilters from "@/components/expensefilters/ExpenseFilters";
import ExpensesTable from "@/components/expensetable/ExpensesTable";
import axios from '@/api/axios';

const ExpensePage = () => {
    const $filteredExpenses = useStore(filteredExpenses)
    const $isLoggedIn = useStore(isLoggedIn)

    useEffect(() => {
        if (!$isLoggedIn) location.replace('/login')
        const getCategories = async () => {
            const res = await axios.get('/category/')
            categories.set(res.data.categories)
        }
        getCategories()

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
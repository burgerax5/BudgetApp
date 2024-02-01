import { useStore } from '@nanostores/react'
import { filteredExpenses } from '@/store/userStore'
import ExpenseFilters from "@/components/expensefilters/ExpenseFilters";
import ExpensesTable from "@/components/ExpensesTable";

const ExpensePage = () => {
    const $filteredExpenses = useStore(filteredExpenses)

    return (
        <>
            <ExpenseFilters />
            <ExpensesTable take={undefined} showCheckbox={true} filteredExpenses={$filteredExpenses} />
        </>
    )
}

export default ExpensePage
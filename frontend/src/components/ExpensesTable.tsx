import axios from '@/api/axios'
import React, { useState, useEffect } from 'react'

interface expenseDetails {
    name: string,
    currencyId: number,
    categoryId: number,
    amount: number,
    userId: number,
    id: number
}

function ExpensesTable() {
    const [expenses, setExpenses] = useState<expenseDetails[]>([])

    useEffect(() => {
        getExpenses()
    }, [])

    const getExpenses = async () => {
        const res = await axios.get('/expense/')
        if (!res.data)
            console.log('No expenses')
        else
            setExpenses(res.data)
    }

    return (
        <div>
            {expenses.map(expense => (
                <div>{expense.name}</div>
            ))}
        </div>
    )
}

export default ExpensesTable
import axios from '@/api/axios'
import { useState, useEffect } from 'react'

interface expenseDetails {
    name: string,
    currencyId: number,
    categoryId: number,
    amount: number,
    userId: number,
    id: number
}

interface resDetails {
    username: string,
    user_id: number,
    refreshToken: string
}

function ExpensesTable() {
    const [expenses, setExpenses] = useState<expenseDetails[]>([])
    const [token, setToken] = useState<string | null>(null)

    const getExpenses = async () => {
        const res = await axios.get('/expense/', { withCredentials: true })
        if (!res.data)
            console.log('No expenses')
        else
            setExpenses(res.data.expenses)
    }

    return (
        <div>
            {expenses.map(expense => (
                <div key={expense.id}>{expense.name}</div>
            ))}
            {token}
        </div>
    )
}

export default ExpensesTable
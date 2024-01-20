import axios from '@/api/axios'
import { useState, useEffect } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface expenseDetails {
    name: string,
    categoryId: number,
    amount: number,
    day: number,
    month: number,
    year: number
}

interface resDetails {
    username: string,
    user_id: number,
    refreshToken: string
}

function ExpensesTable() {
    const [expenses, setExpenses] = useState<expenseDetails[]>([])
    enum Category {
        "Food & Drink" = 1,
        Entertainment,
        Transportation,
        Health,
        Education,
        Housing,
        Utilities,
        Insurance,
        "Debt Repayment",
        Clothing,
        Miscellaneous
    }

    useEffect(() => {
        getExpenses()
    }, [])

    const getExpenses = async () => {
        const res = await axios.get('/expense/', { withCredentials: true })
        if (!res.data)
            console.log('No expenses')
        else
            setExpenses(res.data.expenses)
    }

    const getDate = (expense: expenseDetails) => {
        const date = new Date(expense.year, expense.month - 1, expense.day)
        return `${date.getDate()} ${date?.toLocaleDateString('default', { month: 'short' })} ${date.getFullYear()}`
    }

    return (
        // <div>
        //     {expenses.map(expense => (
        //         <div key={expense.id}>{expense.name}</div>
        //     ))}
        //     {token}
        // </div>
        <Table>
            <TableCaption>A list of your recent spendings</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Expense</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {expenses.map(expense => (
                    <TableRow>
                        <TableCell className="font-medium">{expense.name}</TableCell>
                        <TableCell>{Category[expense.categoryId]}</TableCell>
                        <TableCell>{getDate(expense)}</TableCell>
                        <TableCell className="text-right">${expense.amount}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default ExpensesTable
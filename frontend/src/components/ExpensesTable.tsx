import axios from '@/api/axios'
import { useState, useEffect } from 'react'
import { useStore } from '@nanostores/react'
import { expenses } from '@/store/userStore'
import {
    Table,
    TableBody,
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

interface Props {
    take: number | undefined
}

const ExpensesTable: React.FC<Props> = ({ take }) => {
    const $expenses = useStore(expenses)

    useEffect(() => {
        getExpenses()
    }, [])

    console.log($expenses)

    const getExpenses = async () => {
        const res = await axios.get(`/expense/${take ? `?take=${take}` : ``}`, { withCredentials: true })
        if (res.data) expenses.set(res.data.expenses)
    }

    const getDate = (expense: expenseDetails) => {
        const date = new Date(expense.year, expense.month - 1, expense.day)
        return `${date.getDate()} ${date?.toLocaleDateString('default', { month: 'short' })} ${date.getFullYear()}`
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Expense</TableHead>
                    <TableHead className="w-[150px]">Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {$expenses.map(expense => (
                    <TableRow key={crypto.randomUUID()}>
                        <TableCell className="font-medium">{expense.name}</TableCell>
                        <TableCell>{Category[expense.categoryId]}</TableCell>
                        <TableCell>{getDate(expense)}</TableCell>
                        <TableCell className="text-right">${expense.amount.toLocaleString('default', {
                            minimumFractionDigits: 2
                        })}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default ExpensesTable
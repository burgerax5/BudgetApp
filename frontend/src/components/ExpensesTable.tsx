import axios from '@/api/axios'
import { useState, useEffect } from 'react'
import { useStore } from '@nanostores/react'
import { expenses, filteredExpenses } from '@/store/userStore'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from './ui/checkbox'

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

interface Expense {
    name: string,
    categoryId: number,
    amount: number,
    day: number,
    month: number,
    year: number
}

interface Props {
    take: number | undefined,
    showCheckbox: boolean,
    filteredExpenses?: Expense[]
}

const ExpensesTable: React.FC<Props> = ({ take, showCheckbox, filteredExpenses }) => {
    const $expenses = useStore(expenses)

    useEffect(() => {
        getExpenses()
    }, [])

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
                    {showCheckbox && <TableHead></TableHead>}
                    <TableHead
                        className="cursor-pointer">
                        <div className="flex gap-3">
                            Expense
                        </div>
                    </TableHead>
                    <TableHead
                        className="w-[150px] cursor-pointer">
                        Category
                    </TableHead>
                    <TableHead
                        className="cursor-pointer">
                        Date
                    </TableHead>
                    <TableHead
                        className="text-right cursor-pointer">
                        Amount
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredExpenses && filteredExpenses.map(expense => (
                    <TableRow key={crypto.randomUUID()}>
                        {showCheckbox && <TableCell><Checkbox /></TableCell>}
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
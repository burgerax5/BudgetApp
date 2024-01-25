import React, { useState, useEffect } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { useStore } from '@nanostores/react'
import { expenses, selectedDate } from '@/store/userStore'
import axios from '@/api/axios'

interface expenseDetails {
    name: string,
    categoryId: number,
    amount: number,
    day: number,
    month: number,
    year: number
}

const SpendingCard = () => {
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

    const $expenses = useStore(expenses)

    useEffect(() => {
        getExpenses()
    }, [])

    const getDate = (expense: expenseDetails) => {
        const date = new Date(expense.year, expense.month - 1, expense.day)
        return `${date.getDate()} ${date?.toLocaleDateString('default', { month: 'short' })} ${date.getFullYear()}`
    }

    const getExpenses = async () => {
        const res = await axios.get('/expense/', { withCredentials: true })
        if (res.data) expenses.set(res.data.expenses)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Spendings</CardTitle>
                <CardDescription>Your recent expenses</CardDescription>
            </CardHeader>
            <CardContent>
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
                        {$expenses.slice(0, 5).map((expense: expenseDetails) => (
                            <TableRow>
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
            </CardContent>
        </Card>
    )
}

export default SpendingCard
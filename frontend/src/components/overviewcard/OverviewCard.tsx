import React, { useState, useEffect } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useStore } from '@nanostores/react'
import { selectedDate } from '@/store/userStore'
import BarChart from './BarChart'
import axios from '@/api/axios'

interface Dataset {
    label: string,
    data: number[],
    backgroundColor: string
}

interface Expense {
    id: number,
    userId: number,
    categoryId: number,
    currencyId: number,
    name: string,
    amount: number
}

interface ExpenseData {
    labels: number[],
    datasets: Dataset[],
}

enum Month {
    January = 1,
    February,
    March,
    April,
    May,
    June,
    July,
    August,
    September,
    October,
    November,
    December
}

const OverviewCard = () => {
    const $selectedDate = useStore(selectedDate)
    const [labels, setLabels] = useState<number[]>([])
    const [data, setData] = useState<number[]>([])
    const [expenseData, setExpenseData] = useState<ExpenseData>({
        labels: labels,
        datasets: [{
            label: "Amount spent",
            data: data,
            backgroundColor: "hsl(222.2, 47.4%, 11.2%)"
        }]
    })

    const daysInMonth = (year: number, month: number) => {
        const lastDayOfMonth = new Date(year, month, 0)
        return lastDayOfMonth.getDate()
    }

    useEffect(() => {
        const getExpenses = async () => {
            const month = $selectedDate.date.getMonth() + 1
            const year = $selectedDate.date.getFullYear()
            const numberOfDays = daysInMonth(year, month)
            let days: number[] = []

            for (let i = 1; i <= ($selectedDate.yearOnly ? 12 : numberOfDays); i++)
                days.push(i)

            const url = $selectedDate.yearOnly ? `/expense/?year=${year}` : `/expense/?month=${month}&year=${year}`

            await axios.get(url, { withCredentials: true })
                .then(res => {
                    const expenses: Expense[] = res.data.expenses
                    setLabels(days)
                    setData(expenses.map(expense => expense.amount))
                })
                .catch(err => {
                    console.error('Error occurred while getting expenses for the month:', err)
                })
        }

        getExpenses()
    }, [$selectedDate])

    useEffect(() => {
        setExpenseData({
            labels: labels,
            datasets: [{
                label: "Amount spent",
                data: data
            }]
        })

    }, [labels, data])

    console.log(expenseData)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Your spendings this year</CardDescription>
            </CardHeader>
            <CardContent>
                <BarChart expenseData={expenseData} />
            </CardContent>
        </Card>
    )
}

export default OverviewCard
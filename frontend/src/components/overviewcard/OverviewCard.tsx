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
    amount: number,
    day: number,
    month: number,
    year: number
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
            backgroundColor: "hsl(221.2 83.2% 53.3%)"
        }]
    })

    const daysInMonth = (year: number, month: number) => {
        const lastDayOfMonth = new Date(year, month, 0)
        return lastDayOfMonth.getDate()
    }

    const aggregateExpenses = (expenses: Expense[], daysOrMonths: number) => {
        let spentInPeriod: number[] = []
        for (let i = 0; i < daysOrMonths; i++)
            spentInPeriod.push(0)

        expenses.map(exp => {
            if (!$selectedDate.yearOnly) {
                spentInPeriod[exp.day - 1] += exp.amount
            } else {
                spentInPeriod[exp.month - 1] += exp.amount
            }
        })

        return spentInPeriod
    }

    useEffect(() => {
        const getExpenses = async () => {
            const month = $selectedDate.date.getMonth() + 1
            const year = $selectedDate.date.getFullYear()
            const numberOfDays = $selectedDate.yearOnly ? 12 : daysInMonth(year, month)
            let days: number[] = []

            for (let i = 1; i <= numberOfDays; i++)
                days.push(i)

            const url = $selectedDate.yearOnly ? `/expense/?year=${year}` : `/expense/?month=${month}&year=${year}`

            await axios.get(url, { withCredentials: true })
                .then(res => {
                    const expenses: Expense[] = res.data.expenses
                    setLabels(days)

                    const data = aggregateExpenses(expenses, numberOfDays)
                    setData(data)
                })
                .catch(err => {
                    console.error('Error occurred while getting expenses for the month:', err)
                })
        }

        getExpenses()
    }, [$selectedDate])

    useEffect(() => {
        setExpenseData(prevData => ({
            labels: labels,
            datasets: [{
                ...prevData.datasets[0],
                label: "Amount spent",
                data: data
            }]
        }))

    }, [labels, data])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Your spendings this {$selectedDate.yearOnly ? "year" : "month"}</CardDescription>
            </CardHeader>
            <CardContent>
                <BarChart expenseData={expenseData} />
            </CardContent>
        </Card>
    )
}

export default OverviewCard
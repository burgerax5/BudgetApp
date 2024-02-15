import { useState, useEffect } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useStore } from '@nanostores/react'
import { categories, selectedDate } from '@/store/userStore'
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
    labels: string[],
    datasets: Dataset[],
}

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const OverviewCard = () => {

    const $selectedDate = useStore(selectedDate)
    const [labels, setLabels] = useState<string[]>([])
    const [data, setData] = useState<Dataset[]>([])
    const $categories = useStore(categories)
    const [expenseData, setExpenseData] = useState<ExpenseData>({
        labels: labels,
        datasets: data
    })

    useEffect(() => {
        const getCategories = async () => {
            if ($categories.length === 0) {
                await axios.get('/category')
                    .then(res => {
                        if (res.data.categories)
                            categories.set(res.data.categories)
                    })
            }
        }

        getCategories()
    }, [])

    const daysInMonth = (year: number, month: number) => {
        const lastDayOfMonth = new Date(year, month, 0)
        return lastDayOfMonth.getDate()
    }

    const aggregateExpenses = (expenses: Expense[], daysOrMonths: number, categoryId: number) => {
        let spentInPeriod: number[] = []
        for (let i = 0; i < daysOrMonths; i++)
            spentInPeriod.push(0)

        expenses.map(exp => {
            if (!$selectedDate.yearOnly && exp.categoryId === categoryId) {
                spentInPeriod[exp.day - 1] += exp.amount
            } else if ($selectedDate.yearOnly && exp.categoryId === categoryId) {
                spentInPeriod[exp.month - 1] += exp.amount
            }
        })

        return spentInPeriod
    }

    const getExpenses = async () => {
        const month = $selectedDate.date.getMonth() + 1
        const year = $selectedDate.date.getFullYear()
        const numberOfDays = $selectedDate.yearOnly ? 12 : daysInMonth(year, month)
        let days: string[] = []

        for (let i = 1; i <= numberOfDays; i++) {
            if ($selectedDate.yearOnly && months[i]) {
                days.push(months[i - 1].slice(0, 3))
            } else {
                days.push(i + '')
            }
        }
        setLabels(days)

        const url = $selectedDate.yearOnly ? `/expense/?year=${year}` : `/expense/?month=${month}&year=${year}`

        await axios.get(url, { withCredentials: true })
            .then(res => {
                if (res.data.expenses) {
                    const expenses: Expense[] = res.data.expenses

                    let $data: Dataset[] = []
                    $categories.map(cat => {
                        $data.push({
                            label: cat.name,
                            data: aggregateExpenses(expenses, numberOfDays, cat.id),
                            backgroundColor: cat.colour
                        })
                    })
                    setData($data)
                }
            })
            .catch(err => {
                console.error('Error occurred while getting expenses for the month:', err)
            })
    }

    useEffect(() => {
        getExpenses()
    }, [$selectedDate, $categories])

    useEffect(() => {
        setExpenseData(() => ({
            labels: labels,
            datasets: data
        }))
    }, [labels, data])

    const title = $selectedDate.yearOnly ?
        $selectedDate.date.getFullYear().toString() :
        months[$selectedDate.date.getMonth()].slice(0, 3) + ' ' + $selectedDate.date.getFullYear()

    return (
        <Card className="max-w-96 w-full sm:max-w-full sm:min-w-full mx-auto">
            <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Your spendings this {$selectedDate.yearOnly ? "year" : "month"}</CardDescription>
            </CardHeader>
            <CardContent className="relative">
                <BarChart expenseData={expenseData} title={title} />
            </CardContent>
        </Card>
    )
}

export default OverviewCard
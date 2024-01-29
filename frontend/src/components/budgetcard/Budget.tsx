import React, { useState, useEffect } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import axios from '@/api/axios'
import BudgetButton from '@/components/budgetcard/BudgetButton'
import { useStore } from '@nanostores/react'
import { selectedDate, budgetByDate } from '@/store/userStore'
import BudgetCircularProgress from './BudgetCircularProgress'

interface Budget {
    id: number,
    amount: number,
    month: number,
    year: number
}

interface ExpenseResponse {
    expenses: Expense[]
}

interface Expense {
    id: number,
    categoryId: number,
    amount: number,
    name: string,
    day: number,
    month: number,
    year: number
}

function Budget() {
    const [budget, setBudget] = useState<Budget | null>(null)
    const [spent, setSpent] = useState<number>(0)
    const $selectedDate = useStore(selectedDate)

    useEffect(() => {
        const getBudget = async () => {
            const date = $selectedDate.date
            const month = date.getMonth() + 1
            const year = date.getFullYear()

            await axios.get(
                `/budget/?month=${month}&year=${year}`,
                { withCredentials: true }
            ).then(res => {
                if (res.data) {
                    res.data.budgets.map(b => {
                        if (b.month === month && b.year === year && !b.categoryId) {
                            setBudget(b)
                            budgetByDate.set(b)
                        }
                    })
                }
            }).catch(err => {
                console.error('Error fetching budget data:', err)
            })
        }

        const spentThisMonth = async () => {
            const date = $selectedDate.date
            await axios.get<ExpenseResponse>(
                `/expense/?month=${date.getMonth() + 1}&year=${date.getFullYear()}`,
                { withCredentials: true }
            ).then(res => {
                const expenses: Expense[] = res.data.expenses
                let sum = 0
                expenses.map(expense => sum += expense.amount)
                setSpent(sum)
            }).catch(err => {
                console.error('Error fetching expense data:', err)
            })
        }

        getBudget()
        spentThisMonth()
    }, [$selectedDate])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Budget</CardTitle>
                <CardDescription>{budget ? 'Your remaining budget this month' : 'You do not have a budget set for this month.'}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='rounded-full w-40 h-40 mx-auto relative'>
                    <BudgetCircularProgress budget={budget} spent={spent} />
                </div>
            </CardContent>
            <CardFooter className='justify-end'>
                <BudgetButton budget={budget} setBudget={setBudget} />
            </CardFooter>
        </Card>
    )
}

export default Budget
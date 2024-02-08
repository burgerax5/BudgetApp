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

            const url = $selectedDate.yearOnly ? `/budget/?year=${year}` : `/budget/?month=${month}&year=${year}`

            await axios.get(url, { withCredentials: true })
                .then(res => {
                    if (res.data.budgets.length) {
                        res.data.budgets.map(b => {
                            if ($selectedDate.yearOnly && !b.month && b.year === year && !b.categoryId) {
                                setBudget(b)
                                budgetByDate.set(b)
                                return
                            } else if (!$selectedDate.yearOnly && b.month === month && b.year === year && !b.categoryId) {
                                setBudget(b)
                                budgetByDate.set(b)
                                return
                            }
                        })
                    } else {
                        setBudget(null)
                        budgetByDate.set(null)
                    }
                }).catch(err => {
                    console.error('Error fetching budget data:', err)
                })
        }

        const spentThisPeriod = async () => {
            const date = $selectedDate.date

            const url = $selectedDate.yearOnly ?
                `/expense/?year=${date.getFullYear()}` : `/expense/?month=${date.getMonth() + 1}&year=${date.getFullYear()}`

            await axios.get<ExpenseResponse>(
                url, { withCredentials: true }
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
        spentThisPeriod()
    }, [$selectedDate])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Budget</CardTitle>
                <CardDescription>{budget ? `Your remaining budget this ${$selectedDate.yearOnly ? "year" : "month"}`
                    : `You do not have a budget set for this ${$selectedDate.yearOnly ? "year" : "month"}.`}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='rounded-full w-60 h-[240px] mx-auto relative'>
                    <BudgetCircularProgress budget={budget} spent={spent} period={`${$selectedDate.yearOnly ? "year" : "month"}`} />
                </div>
            </CardContent>
            <CardFooter className='justify-end'>
                <BudgetButton budget={budget} setBudget={setBudget} period={`${$selectedDate.yearOnly ? "year" : "month"}`} />
            </CardFooter>
        </Card>
    )
}

export default Budget
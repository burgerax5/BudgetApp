import React, { useState, useEffect } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { DialogButton } from '@/components/ExpenseDialog'
import axios from '@/api/axios'
import EditBudget from './EditBudget'
import { useStore } from '@nanostores/react'
import { selectedDate } from '@/store/userStore'

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
            const date = $selectedDate
            await axios.get(
                `/budget/?month=${date.getMonth() + 1}&year=${date.getFullYear()}`,
                { withCredentials: true }
            ).then(res => {
                if (res.data)
                    setBudget(res.data.budgets[0])
            }).catch(err => {
                console.error('Error fetching budget data:', err)
            })
        }

        const spentThisMonth = async () => {
            const date = $selectedDate
            await axios.get<ExpenseResponse>(
                `/expense/?month=${date.getMonth() + 1}&year=${date.getFullYear()}`,
                { withCredentials: true }
            ).then(res => {
                const expenses: Expense[] = res.data.expenses
                let sum = 0
                expenses.map(expense => {
                    sum += expense.amount
                })
                setSpent(sum)
            }).catch(err => {
                console.error('Error fetching expense data:', err)
            })
        }

        getBudget()
        spentThisMonth()
    }, [])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Budget</CardTitle>
                <CardDescription>Your remaining budget this month</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='rounded-full w-40 h-40 mx-auto relative'>
                    <div className={`rounded-full border-8 border-accent w-full h-full absolute flex items-center justify-center`}>
                        <div className='flex flex-col items-center justify-center'>
                            <div className='font-bold text-2xl'>$
                                {budget?.amount && (budget?.amount - spent).toLocaleString('default', {
                                    minimumFractionDigits: 2
                                })}
                            </div>
                            <div className='text-sm opacity-70'>out of ${budget?.amount.toLocaleString('default', {
                                minimumFractionDigits: 2
                            })}</div>
                        </div>
                    </div>
                    <div className='rounded-full border-8 border-primary w-full h-full absolute'></div>
                </div>
            </CardContent>
            <CardFooter className='justify-end'>
                <EditBudget budget={budget} setBudget={setBudget} />
            </CardFooter>
        </Card>
    )
}

export default Budget
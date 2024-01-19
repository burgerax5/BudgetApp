"use client"

import axios from "@/api/axios"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useState, useEffect } from "react"
import ProgressBar from "./ProgressBar"

interface Category {
    id: number,
    name: string,
    colour: string
}

interface Expense {
    id: number,
    userId: number,
    categoryId: number,
    currencyId: number,
    name: string,
    amount: number
}

interface expenseCategory {
    [key: string]: number
    // 'FoodDrink': number,
    // 'Entertianment': number,
    // "Transportation": number,
    // "Health": number,
    // "Education": number,
    // "Housing": number,
    // "Utilities": number,
    // "Insurance": number,
    // "DebtRepayment": number,
    // "Clothing": number,
    // "Miscellaneous": number,
}

function CategoriesCard() {
    let defaultThing: number[] = []
    for (let i = 0; i < 12; i++) {
        defaultThing.push(0)
    }

    const [categories, setCategories] = useState<Category[]>([])
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [expensesByCategory, setExpensesByCategory] = useState<expenseCategory>({
        'Food & Drink': 0,
        'Entertianment': 0,
        "Transportation": 0,
        "Health": 0,
        "Education": 0,
        "Housing": 0,
        "Utilities": 0,
        "Insurance": 0,
        "Debt Repayment": 0,
        "Clothing": 0,
        "Miscellaneous": 0,
    })
    const [budgetByCategory, setBudgetByCategory] = useState(defaultThing)



    useEffect(() => {
        const getCategories = async () => {
            const res = await axios.get('/category/')
            if (res.data)
                setCategories(res.data.categories)
        }

        const getExpenses = async () => {
            const res = await axios.get('/expense/', { withCredentials: true })
            if (res.data)
                setExpenses(res.data.expenses)
        }

        const getCategoryBudgets = async (categoryId: number) => {
            const month = new Date().getMonth() + 1
            const year = new Date().getFullYear()
            const res = await axios.get(`/budget/?month=${month}&year=${year}&categoryId=${categoryId}`, { withCredentials: true })
            if (res.data.budgets[0])
                setBudgetByCategory(b => {
                    return b.map((value, i) => ((i === categoryId) ? res.data.budgets[0].amount : 0))
                })
            console.log(res.data.budgets, categoryId)
        }

        getCategories()
        getExpenses()

        for (let i = 1; i < 13; i++)
            getCategoryBudgets(i)
    }, [])

    useEffect(() => {
        let newExpenseByCategory: Record<string, number> = expensesByCategory
        console.log(expenses)
        Object.entries(expensesByCategory).forEach(([key, index]: [string, number]) => {
            expenses.map(exp => {
                exp.categoryId === index ? newExpenseByCategory[key] + exp.amount : 0
            })
        })
    }, [expenses])

    console.log(budgetByCategory)

    return (
        <Card className='h-full'>
            <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Spendings on different categories</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid items-center gap-3">
                    {categories.map((category, i) => {
                        return <div key={category.id} className='text-sm'>
                            <div className='flex justify-between items-center'>
                                <div>{category.name}</div>
                                <div className='opacity-70'>{budgetByCategory[i]}</div>
                            </div>
                            <ProgressBar percentage={budgetByCategory[i] > 0 ? expensesByCategory[category.name] : 0} />
                        </div>
                    })}
                </div>
            </CardContent>
            {/* <CardFooter className='justify-end'>
                <DialogButton />
            </CardFooter> */}
        </Card>
    )
}

export default CategoriesCard
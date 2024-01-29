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
import { selectedDate } from "@/store/userStore"
import { useStore } from "@nanostores/react"
import { useState, useEffect } from "react"
import ProgressBar from "../ProgressBar"
import { CategoryBudgetButton } from "./CategoryBudgetButton"

interface Category {
    id: number,
    name: string
}

interface Expense {
    id: number,
    userId: number,
    categoryId: number,
    currencyId: number,
    name: string,
    amount: number
}

interface keyNumber {
    [key: string]: number
}

function CategoriesCard() {
    const defaultCategoryValue: keyNumber = {
        'Food & Drink': 0,
        'Entertainment': 0,
        "Transportation": 0,
        "Health": 0,
        "Education": 0,
        "Housing": 0,
        "Utilities": 0,
        "Insurance": 0,
        "Debt Repayment": 0,
        "Clothing": 0,
        "Miscellaneous": 0,
    }

    let defaultThing: number[] = []
    for (let i = 0; i < 12; i++) {
        defaultThing.push(0)
    }
    const $selectedDate = useStore(selectedDate)
    const [categories, setCategories] = useState<Category[]>([])
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [expensesByCategory, setExpensesByCategory] = useState<keyNumber>(defaultCategoryValue)
    const [budgetByCategory, setBudgetByCategory] = useState(defaultThing)

    const getCategoryNameFromId = (id: number) => {
        return categories.find(category => {
            if (category.id === id) return category
        })
    }

    useEffect(() => {
        const getCategories = async () => {
            const res = await axios.get('/category/')
            if (res.data)
                setCategories(res.data.categories)
        }

        const getExpenses = async () => {
            const res = await axios.get(`/expense/?month=${$selectedDate.date.getMonth() + 1}&year=${$selectedDate.date.getFullYear()}`, { withCredentials: true })
            if (res.data.expenses)
                setExpenses(res.data.expenses)
        }

        const getCategoryBudgets = async (categoryId: number) => {
            const month = new Date().getMonth() + 1
            const year = new Date().getFullYear()
            const res = await axios.get(`/budget/?month=${month}&year=${year}&categoryId=${categoryId}`, { withCredentials: true })

            if (!res.data.budgets[0]) return

            setBudgetByCategory(b => {
                return b.map((value, i) =>
                    (i === categoryId - 1) ? res.data.budgets[0].amount : value
                )
            })
        }

        getCategories()
        getExpenses()

        for (let i = 1; i < 13; i++)
            getCategoryBudgets(i)
    }, [$selectedDate])

    useEffect(() => {
        setExpensesByCategory(prevExpenseByCategory => {
            let defaultExpenses = defaultCategoryValue
            expenses.map(exp => {
                const category = getCategoryNameFromId(exp.categoryId)
                if (category)
                    defaultExpenses[category.name] += exp.amount
            })
            return defaultExpenses
        })
    }, [expenses])

    return (
        <Card className='h-full'>
            <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Spendings on different categories</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid items-center gap-3">
                    {categories.map((category, i) => {
                        const progress = budgetByCategory[i] ? (expensesByCategory[category.name] / budgetByCategory[i]) * 100 : 0

                        return <div key={category.id} className='text-sm'>
                            <div className='flex justify-between items-center'>
                                <div>{category.name}</div>
                                <div>
                                    ${expensesByCategory[category.name].toFixed(2)}
                                    {budgetByCategory[i] && <span className="opacity-70">
                                        {` out of $${(budgetByCategory[i]).toFixed(2)}`}
                                    </span>}
                                </div>
                            </div>
                            <ProgressBar percentage={progress >= 0 && progress <= 100 ? progress : 100} />
                        </div>
                    })}
                </div>
            </CardContent>
            <CardFooter className='justify-end'>
                <CategoryBudgetButton categories={categories} budgetByCategory={budgetByCategory} />
            </CardFooter>
        </Card>
    )
}

export default CategoriesCard
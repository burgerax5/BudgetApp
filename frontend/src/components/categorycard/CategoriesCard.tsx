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
import { selectedDate, expensesByCategory, defaultCategoryValue } from "@/store/userStore"
import { useStore } from "@nanostores/react"
import { useState, useEffect } from "react"
import { CategoryBudgetButton } from "./CategoryBudgetButton"

interface Category {
    id: number,
    name: string,
    colour: string
}

interface Budget {
    id: number,
    userId: number,
    categoryId: number | null,
    month: number | null,
    year: number,
    amount: number
}

interface Expense {
    id: number,
    userId: number,
    categoryId: number,
    currencyId: number,
    name: string,
    amount: number
}

function CategoriesCard() {
    let defaultBudgetsByCategory: number[] = []
    for (let i = 0; i < 12; i++) {
        defaultBudgetsByCategory.push(0)
    }
    const $selectedDate = useStore(selectedDate)
    const $expensesByCategory = useStore(expensesByCategory)
    const [categories, setCategories] = useState<Category[]>([])
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [budgetByCategory, setBudgetByCategory] = useState(defaultBudgetsByCategory)

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
            const url = $selectedDate.yearOnly ? `/expense/?year=${$selectedDate.date.getFullYear()}` :
                `/expense/?month=${$selectedDate.date.getMonth() + 1}&year=${$selectedDate.date.getFullYear()}`

            const res = await axios.get(url, { withCredentials: true })
            if (res.data.expenses)
                setExpenses(res.data.expenses)
        }

        const getCategoryBudgets = async (categoryId: number) => {
            const month = $selectedDate.date.getMonth() + 1
            const year = $selectedDate.date.getFullYear()
            const yearOnly = $selectedDate.yearOnly
            const url = $selectedDate.yearOnly ? `/budget/?year=${year}&categoryId=${categoryId}` :
                `/budget/?month=${month}&year=${year}&categoryId=${categoryId}`

            const res = await axios.get(url, { withCredentials: true })
            const budgets: Budget[] = res.data.budgets

            if (!budgets.length) return
            const budget = budgets.find(b => {
                if (yearOnly && b.year === year && !b.month) return b
                else if (!yearOnly && b.year === year && b.month === month) return b
            })

            setBudgetByCategory(b => {
                return b.map((value, i) =>
                    (i === categoryId - 1) ? budget?.amount : value
                )
            })
        }

        getCategories()
        getExpenses()

        for (let i = 1; i < 13; i++)
            getCategoryBudgets(i)
    }, [$selectedDate])

    useEffect(() => {
        let newExpensesByCategory = { ...defaultCategoryValue }
        expenses.map(exp => {
            const category = getCategoryNameFromId(exp.categoryId)
            if (category)
                newExpensesByCategory[category.name] += exp.amount
        })
        expensesByCategory.set(newExpensesByCategory)
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
                        let progress = budgetByCategory[i] ? ($expensesByCategory[category.name] / budgetByCategory[i]) * 100 :
                            $expensesByCategory[category.name] ? 100 : 0

                        return <div key={category.id} className='text-sm'>
                            <div className='flex justify-between items-center'>
                                <div>{category.name}</div>
                                <div>
                                    ${$expensesByCategory[category.name].toFixed(2)}
                                    {budgetByCategory[i] && <span className="opacity-70">
                                        {` out of $${(budgetByCategory[i]).toFixed(2)}`}
                                    </span>}
                                </div>
                            </div>
                            <div className="bg-accent rounded-full overflow-hidden">
                                <div
                                    className={`h-4 w-full flex-1 transition-all delay-200`}
                                    style={{ transform: `translateX(-${100 - (progress || 0)}%)`, backgroundColor: category.colour }}
                                ></div>
                            </div>
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
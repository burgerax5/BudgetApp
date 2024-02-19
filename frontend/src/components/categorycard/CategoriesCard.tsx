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
import { selectedDate, expensesByCategory, defaultCategoryValue, categories } from "@/store/userStore"
import { useStore } from "@nanostores/react"
import { useState, useEffect } from "react"
import { CategoryBudgetButton } from "./CategoryBudgetButton"

interface Budget {
    id: string,
    userId: string,
    categoryId: string | null,
    month: number | null,
    year: number,
    amount: number
}

interface Expense {
    id: string,
    userId: string,
    categoryId: string,
    name: string,
    amount: number
}

interface CategoryBudget {
    id: string,
    name: string,
    colour: string,
    amount: number
}

interface Category {
    id: string,
    name: string,
    colour: string
}

function CategoriesCard() {
    const $selectedDate = useStore(selectedDate)
    const $expensesByCategory = useStore(expensesByCategory)
    const $categories = useStore(categories)
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [budgetByCategory, setBudgetByCategory] = useState<CategoryBudget[]>([])

    const getCategoryNameFromId = (id: string) => {
        return $categories.find(category => {
            if (category.id === id) return category
        })
    }

    const getCategories = async () => {
        const data: Category[] = await (await axios.get('/category/')).data.categories
        if (data) {
            categories.set(data)

            let budgetByCategories: CategoryBudget[] = []
            data.map(cat => {
                budgetByCategories.push({
                    id: cat.id,
                    name: cat.name,
                    colour: cat.colour,
                    amount: 0
                })
            })

            setBudgetByCategory(budgetByCategories)
        }
    }

    const getExpenses = async () => {
        const url = $selectedDate.yearOnly ? `/expense/?year=${$selectedDate.date.getFullYear()}` :
            `/expense/?month=${$selectedDate.date.getMonth() + 1}&year=${$selectedDate.date.getFullYear()}`

        const res = await axios.get(url, { withCredentials: true })
        if (res.data.expenses)
            setExpenses(res.data.expenses)
    }

    const getCategoryBudgets = async (categoryId: string) => {
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

        setBudgetByCategory((prevBudgetByCat: CategoryBudget[]) => {
            const index = prevBudgetByCat.findIndex(cat => cat.id === categoryId)
            return prevBudgetByCat.slice(0, index).
                concat({ ...prevBudgetByCat[index], amount: budget?.amount ? budget?.amount : 0 })
                .concat(prevBudgetByCat.slice(index + 1))
        })
    }


    useEffect(() => {
        getCategories()
        getExpenses()
        $categories.map(cat => { getCategoryBudgets(cat.id) })
    }, [$selectedDate])

    useEffect(() => {
        $categories.map(cat => { getCategoryBudgets(cat.id) })
    }, [$categories])

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
                    {budgetByCategory.map((category) => {
                        let progress = category.amount ? ($expensesByCategory[category.name] / category.amount) * 100 :
                            $expensesByCategory[category.name] ? 100 : 0

                        return <div key={category.id} className='text-sm'>
                            <div className='flex justify-between items-center'>
                                <div>{category.name}</div>
                                <div>
                                    ${$expensesByCategory[category.name].toFixed(2)}
                                    {category.amount > 0 && <span className="opacity-70">
                                        {` out of $${(category.amount).toFixed(2)}`}
                                    </span>}
                                </div>
                            </div>
                            <div className="bg-accent rounded-full overflow-hidden">
                                <div
                                    className={`h-4 w-full flex-1 transition-all delay-200 rounded-full`}
                                    style={{ transform: `translateX(-${100 - (progress || 0)}%)`, backgroundColor: category.colour }}
                                ></div>
                            </div>
                        </div>
                    })}
                </div>
            </CardContent>
            <CardFooter className='justify-end'>
                <CategoryBudgetButton categories={$categories} budgetByCategory={budgetByCategory} />
            </CardFooter>
        </Card>
    )
}

export default CategoriesCard
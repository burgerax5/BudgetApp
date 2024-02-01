import { useState, useEffect } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useStore } from '@nanostores/react'
import { expenseFilters, filteredExpenses, expenses } from '@/store/userStore'
import { SlidersHorizontal } from 'lucide-react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import ExpenseCategorySelect from './ExpenseCategorySelect'
import ExpenseDateRange from './ExpenseDateRange'
import ExpensePriceRange from './ExpensePriceRange'

interface CategoryIndex {
    'Food & Drink': number;
    Entertainment: number;
    Transportation: number;
    Health: number;
    Education: number;
    Housing: number;
    Utilities: number;
    Insurance: number;
    "Debt Repayment": number;
    Clothing: number;
    Miscellaneous: number;
}

const Categories: CategoryIndex = {
    'Food & Drink': 1,
    'Entertainment': 2,
    "Transportation": 3,
    "Health": 4,
    "Education": 5,
    "Housing": 6,
    "Utilities": 7,
    "Insurance": 8,
    "Debt Repayment": 9,
    "Clothing": 10,
    "Miscellaneous": 11,
}

const ExpenseFilters = () => {
    const $expenseFilters = useStore(expenseFilters)
    const [search, setSearch] = useState<string>($expenseFilters.search)
    const $filteredExpenses = useStore(filteredExpenses)
    const $expenses = useStore(expenses)
    const [maxPrice, setMaxPrice] = useState<number>(0)

    useEffect(() => {
        expenseFilters.set({ ...$expenseFilters, search })
    }, [search])

    useEffect(() => {
        let highest = 0
        $expenses.map(exp => {
            if (exp.amount > highest) highest = exp.amount
        })

        setMaxPrice(highest)
    }, [])

    useEffect(() => {
        expenseFilters.set({ ...$expenseFilters, maxPrice })
    }, [maxPrice])

    const applyFilters = () => {
        let newFilteredExpenses = $expenses
        const { search, category, dateRange, maxPrice } = $expenseFilters

        $expenses.map(exp => {
            // Apply search filter
            newFilteredExpenses = newFilteredExpenses.filter(exp => exp.name.toLowerCase().includes(search.toLowerCase()))

            // // Apply category filter
            newFilteredExpenses = newFilteredExpenses.filter(exp => (category && exp.categoryId === Categories[category as keyof CategoryIndex]))

            // // Apply price filter
            newFilteredExpenses = newFilteredExpenses.filter(exp => (maxPrice && exp.amount <= maxPrice))
        })

        console.log($expenseFilters)
        console.log(newFilteredExpenses)

        filteredExpenses.set(newFilteredExpenses)
    }

    useEffect(() => {
        console.log($filteredExpenses)
    }, [$filteredExpenses, expenses])

    return (
        <div>
            <div className="flex w-full mb-3.5 gap-3">
                <Input className="w-full sm:w-72" placeholder="Search expense..." onChange={(e) => {
                    setSearch(e.target.value)
                }} />

                <Popover>
                    <PopoverTrigger className="bg-primary px-2 rounded"><SlidersHorizontal className="h-4 text-slate-300" /></PopoverTrigger>
                    <PopoverContent>
                        <div className="p-3.5 flex flex-col gap-3">
                            <h2 className="font-bold text-lg">Filters</h2>
                            <ExpenseCategorySelect />
                            <ExpenseDateRange />
                            <ExpensePriceRange maxPrice={maxPrice} />
                        </div>
                    </PopoverContent>
                </Popover>

                <Button onClick={applyFilters}>Search</Button>
            </div>
        </div>
    )
}

export default ExpenseFilters
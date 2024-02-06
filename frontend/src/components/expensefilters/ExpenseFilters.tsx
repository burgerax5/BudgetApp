import { useState, useEffect } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useStore } from '@nanostores/react'
import { expenseFilters, filteredExpenses, expenses } from '@/store/userStore'
import { SlidersHorizontal, Plus, Search } from 'lucide-react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import ExpenseCategorySelect from './ExpenseCategorySelect'
import ExpenseDateRange from './ExpenseDateRange'
import ExpensePriceRange from './ExpensePriceRange'
import axios from '@/api/axios';
import ExpenseChip from './ExpenseChip'
import { DialogButton } from '../ExpenseDialog'

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
    const [submitted, setSubmitted] = useState(false)

    const [maxPrice, setMaxPrice] = useState<number>(0)

    useEffect(() => {
        const getExpenses = async () => {
            await axios.get('/expense', { withCredentials: true })
                .then(res => {
                    if (res.data.expenses && !$expenses.length)
                        expenses.set(res.data.expenses)
                })
        }
        getExpenses()

        let highest = 0
        $expenses.map(exp => {
            if (exp.amount > highest) highest = exp.amount
        })

        setMaxPrice(highest)
    }, [])

    useEffect(() => {
        filteredExpenses.set($expenses)
    }, [$expenses])

    useEffect(() => {
        expenseFilters.set({ ...$expenseFilters, maxPrice })
    }, [maxPrice])

    useEffect(() => {
        expenseFilters.set({ ...$expenseFilters, search })
    }, [search])

    const applyFilters = () => {
        let newFilteredExpenses = $expenses.slice()
        const { search, category, dateRange, maxPrice } = $expenseFilters

        $expenses.map(exp => {
            // Apply search filter
            newFilteredExpenses = newFilteredExpenses.filter(exp => exp.name.toLowerCase().includes(search.toLowerCase()))

            // // Apply category filter
            if (category)
                newFilteredExpenses = newFilteredExpenses.filter(exp => (exp.categoryId === Categories[category as keyof CategoryIndex]))

            // // Apply price filter
            if (maxPrice)
                newFilteredExpenses = newFilteredExpenses.filter(exp => (exp.amount <= maxPrice))
        })

        setSubmitted(true)
        filteredExpenses.set(newFilteredExpenses)
    }

    useEffect(() => {
        console.log($filteredExpenses)
    }, [$filteredExpenses, expenses])

    return (
        <div>
            <div className="flex flex-col w-full mb-3.5 gap-3 sm:flex-row">
                <div className="flex gap-3">
                    <Input className="w-full sm:w-72" placeholder="Search expense..." onChange={(e) => {
                        setSearch(e.target.value)
                    }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter")
                                applyFilters()
                        }}
                    />
                    <Popover>
                        <PopoverTrigger className="bg-primary px-2 rounded">
                            <div className="text-background">
                                <SlidersHorizontal className="h-4" />
                            </div>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="p-3.5 flex flex-col gap-3">
                                <h2 className="font-bold text-lg">Filters</h2>
                                <ExpenseCategorySelect />
                                <ExpenseDateRange />
                                <ExpensePriceRange maxPrice={maxPrice} />
                                <div className="flex gap-3">
                                    {$expenseFilters.category &&
                                        <ExpenseChip name={"category"} value={$expenseFilters.category} />}
                                </div>
                                <Button onClick={applyFilters}>Apply</Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex gap-3">
                    <Button onClick={applyFilters}><Search className="h-4 flex item-center" /> Search</Button>
                    <DialogButton />
                </div>
            </div>
        </div>
    )
}

export default ExpenseFilters
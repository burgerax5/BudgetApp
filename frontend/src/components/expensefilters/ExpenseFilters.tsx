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
import ExpenseDatePicker from './ExpenseDatePicker'
import ExpensePriceRange from './ExpensePriceRange'
import axios from '@/api/axios';
import ExpenseChip from './ExpenseChip'
import { DialogButton } from '../ExpenseDialog'

interface Expense {
    id: string,
    name: string,
    categoryId: string,
    amount: number,
    day: number,
    month: number,
    year: number
}

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

const months = [
    'January', 'February', 'March',
    'April', 'May', 'June',
    'July', 'August', 'September',
    'October', 'November', 'December'
];

const ExpenseFilters = () => {
    const $expenseFilters = useStore(expenseFilters)
    const [search, setSearch] = useState<string>($expenseFilters.search)
    const $expenses = useStore(expenses)

    const [maxPrice, setMaxPrice] = useState<number>(0)

    const getCategoryName = async (id: string): Promise<string | null> => {
        const res = await axios.get('/category')
        if (res.data.categories)
            for (let i = 0; i < res.data.categories.length; i++)
                if (res.data.categories[i].id === id)
                    return res.data.categories[i].name
        return null
    }

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
    }, [$expenses])

    useEffect(() => {
        filteredExpenses.set($expenses)
    }, [$expenses])

    useEffect(() => {
        expenseFilters.set({ ...$expenseFilters, maxPrice })
    }, [maxPrice])

    useEffect(() => {
        expenseFilters.set({ ...$expenseFilters, search })
    }, [search])

    const applyFilters = async () => {
        let newFilteredExpenses = $expenses.slice()
        const { search, categoryName, categoryId, date, maxPrice } = $expenseFilters

        $expenses.map(async () => {
            // Apply search filter
            newFilteredExpenses = newFilteredExpenses.filter(exp => exp.name.toLowerCase().includes(search.toLowerCase()))

            // Apply category filter
            if (categoryName && categoryId) {
                newFilteredExpenses = newFilteredExpenses.filter(exp => exp.categoryId === categoryId)
            }

            // Apply year filter
            if (date.year && !date.month && date.checked)
                newFilteredExpenses = newFilteredExpenses.filter(exp => (exp.year === date.year))

            if (date.year && date.month && date.checked)
                newFilteredExpenses = newFilteredExpenses.filter(exp => (exp.year === date.year && exp.month === date.month))

            // Apply price filter
            if (maxPrice)
                newFilteredExpenses = newFilteredExpenses.filter(exp => (exp.amount <= maxPrice))
        })

        newFilteredExpenses = newFilteredExpenses.flat()

        filteredExpenses.set(newFilteredExpenses)
    }

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
                        <PopoverContent className="w-72 sm:w-96">
                            <div className="p-3.5 flex flex-col gap-3">
                                <h2 className="font-bold text-lg">Filters</h2>
                                <ExpenseCategorySelect />
                                <ExpenseDatePicker />
                                <ExpensePriceRange maxPrice={maxPrice} />
                                <div className="flex gap-3">
                                    {($expenseFilters.categoryName !== null && $expenseFilters.categoryId) &&
                                        <ExpenseChip name={"category"} value={$expenseFilters.categoryName} />}
                                    {($expenseFilters.date.checked) &&
                                        <ExpenseChip
                                            name={"date"}
                                            value={
                                                $expenseFilters.date.month ?
                                                    `${months[$expenseFilters.date.month - 1]} ${$expenseFilters.date.year}` :
                                                    `${$expenseFilters.date.year}`
                                            } />}
                                </div>
                                <Button onClick={applyFilters}>Apply</Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex gap-3">
                    <Button onClick={applyFilters}><Search className="h-4 flex item-center" />Search</Button>
                    <DialogButton />
                </div>
            </div>
        </div>
    )
}

export default ExpenseFilters
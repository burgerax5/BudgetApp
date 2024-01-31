import { useState, useEffect } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useStore } from '@nanostores/react'
import { expenseFilters } from '@/store/userStore'
import { SlidersHorizontal } from 'lucide-react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import ExpenseCategorySelect from './ExpenseCategorySelect'
import ExpenseDateRange from './ExpenseDateRange'
import ExpensePriceRange from './ExpensePriceRange'

const ExpenseFilters = () => {
    const [search, setSearch] = useState<string>("")
    const $expenseFilters = useStore(expenseFilters)

    useEffect(() => {
        expenseFilters.set({ ...$expenseFilters, search })
    }, [search])

    console.log($expenseFilters)

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
                            {/* <ExpenseDateRange /> */}
                            <ExpensePriceRange />
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}

export default ExpenseFilters
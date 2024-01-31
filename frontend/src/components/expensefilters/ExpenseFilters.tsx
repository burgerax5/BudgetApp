import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useStore } from '@nanostores/react'
import { SlidersHorizontal } from 'lucide-react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import ExpenseCategorySelect from './ExpenseCategorySelect'


const ExpenseFilters = () => {

    return (
        <div>
            <div className="flex w-full mb-3.5 gap-3">
                <Input className="w-full sm:w-72" placeholder="Search expense..." />
                <Popover>
                    <PopoverTrigger className="bg-primary px-2 rounded"><SlidersHorizontal className="h-4" /></PopoverTrigger>
                    <PopoverContent>
                        <div className="p-3.5">
                            <h2 className="font-bold text-lg">Filters</h2>
                            <ExpenseCategorySelect />
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            {/* <div className="flex gap-3 overflow-scroll">

            </div> */}
        </div>
    )
}

export default ExpenseFilters
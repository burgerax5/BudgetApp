import React from 'react'
import { Button } from '../ui/button'
import { X } from 'lucide-react'
import { useStore } from '@nanostores/react'
import { expenseFilters } from '@/store/userStore'

interface Props {
    name: string,
    value: unknown,
}

const ExpenseChip: React.FC<Props> = ({ name, value }) => {
    const $expenseFilters = useStore(expenseFilters)

    const removeFilter = () => {
        switch (name) {
            case "category":
                expenseFilters.set({ ...$expenseFilters, category: null })
                break
            case "month":
                expenseFilters.set({
                    ...$expenseFilters, date: {
                        month: null,
                        year: $expenseFilters.date.year
                    }
                })
                break
            case "year":
                expenseFilters.set({
                    ...$expenseFilters, date: {
                        month: $expenseFilters.date.month,
                        year: null
                    }
                })
                break
        }
    }

    return (
        <Button variant="outline" className="flex gap-2" onClick={removeFilter}>
            <div className="flex items-center gap-2">
                {value}
                <X size={16} />
            </div>
        </Button>
    )
}

export default ExpenseChip
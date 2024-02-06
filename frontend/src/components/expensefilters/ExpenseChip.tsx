import React from 'react'
import { Button } from '../ui/button'
import { X } from 'lucide-react'
import { useStore } from '@nanostores/react'
import { expenseFilters } from '@/store/userStore'

interface Props {
    name: string,
    value: unknown,
    maxPrice?: number
}

const ExpenseChip: React.FC<Props> = ({ name, value, maxPrice }) => {
    const $expenseFilters = useStore(expenseFilters)

    const removeFilter = () => {
        switch (name) {
            case "category":
                expenseFilters.set({ ...$expenseFilters, category: null })
                break
            // case "maxPrice":
            //     expenseFilters.set({ ...$expenseFilters, maxPrice: null })
            //     break
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
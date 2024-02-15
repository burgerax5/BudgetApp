import React from 'react'
import { Button } from '../ui/button'
import { X } from 'lucide-react'
import { useStore } from '@nanostores/react'
import { expenseFilters } from '@/store/userStore'

interface Props {
    name: string,
    value: React.ReactNode,
}

const ExpenseChip: React.FC<Props> = ({ name, value }) => {
    const $expenseFilters = useStore(expenseFilters)

    const removeFilter = () => {
        switch (name) {
            case "category":
                expenseFilters.set({ ...$expenseFilters, category: null })
                break
            case "date":
                expenseFilters.set({
                    ...$expenseFilters, date: {
                        ...$expenseFilters.date,
                        month: null,
                        checked: false
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
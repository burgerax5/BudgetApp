import React from 'react'
import { Trash } from 'lucide-react'
import { Button } from '../ui/button'

const ExpenseToolbar = () => {
    return (
        <div className="p-2 rounded-md border border border-accent mb-2">
            <Button
                variant="ghost"
            >
                <Trash className="w-4 h-4" />
            </Button>
        </div>
    )
}

export default ExpenseToolbar
import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import DeleteButton from './DeleteButton'
import EditButton from './EditButton'

interface Expense {
    id: number,
    name: string,
    categoryId: number,
    amount: number,
    day: number,
    month: number,
    year: number
}

interface Props {
    expense: Expense
}

const ExpenseContextMenu: React.FC<Props> = ({ expense }) => {
    return (
        <Popover>
            <PopoverTrigger>...</PopoverTrigger>
            <PopoverContent className="w-[160px]">
                <div className="font-bold mb text truncate">
                    {expense.name}
                </div>
                <hr></hr>
                <EditButton expense={expense} />
                <DeleteButton expense={expense} />
            </PopoverContent>
        </Popover>
    )
}

export default ExpenseContextMenu
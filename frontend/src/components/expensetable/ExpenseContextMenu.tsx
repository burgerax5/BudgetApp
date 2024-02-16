import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import DeleteButton from './DeleteButton'
import EditButton from './EditButton'

interface Expense {
    id: string,
    name: string,
    categoryId: string,
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
            <PopoverContent className="w-[160px] h-[120px] relative">
                <div className="absolute w-full left-0 top-0">
                    <div className="font-bold text truncate px-2 my-2">
                        {expense.name}
                    </div>
                    <hr></hr>
                    <div className="flex flex-col justify-between p-2 gap-2">
                        <EditButton expense={expense} />
                        <DeleteButton expense={expense} />
                    </div>
                </div>
            </PopoverContent>
        </Popover >
    )
}

export default ExpenseContextMenu
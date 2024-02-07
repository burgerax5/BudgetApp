import React from 'react'
import { Trash, Upload } from 'lucide-react'
import { Button } from '../ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import axios from '@/api/axios'
import Tool from './toolbar/Tool'

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
    selectedExpenses: Expense[],
    setSelectedExpenses: React.Dispatch<React.SetStateAction<Expense[]>>,
    show: boolean
}

const ExpenseToolbar: React.FC<Props> = ({ selectedExpenses, setSelectedExpenses, show }) => {
    const deleteExpense = async () => {
        selectedExpenses.map(async (expense) => {
            axios.delete(`/expense/delete/${expense.id}`, { withCredentials: true })
                .then(res => {
                    if (res.data.message === "Successfully deleted") {
                        setSelectedExpenses([])
                    }
                })
        })

        location.reload()
    }

    const deleteButton = () => {
        return <Dialog>
            <DialogTrigger>
                <Trash className="w-5 h-5" />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure you want to delete this expense?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the expense from your account.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button onClick={deleteExpense}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    }

    const uploadButton = () => {
        return <Dialog>
            <DialogTrigger>
                <Upload className="w-5 h-5" />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Import expenses from spreadsheet</DialogTitle>
                    <DialogDescription>
                        Requires the data to be in the specified format:
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button>
                        Upload
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    }

    return (
        <>
            {show && <div className="p-2 rounded-md border border border-accent mb-2 flex gap-3 item-center">
                {selectedExpenses.length > 0 &&
                    <Tool text="Delete Expense(s)">
                        {deleteButton()}
                    </Tool>
                }
                <Tool text="Upload CSV">
                    {uploadButton()}
                </Tool>
            </div>}
        </>
    )
}

export default ExpenseToolbar
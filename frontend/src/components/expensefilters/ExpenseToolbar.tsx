import React from 'react'
import { Trash } from 'lucide-react'
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
    setSelectedExpenses: React.Dispatch<React.SetStateAction<Expense[]>>
}

const ExpenseToolbar: React.FC<Props> = ({ selectedExpenses, setSelectedExpenses }) => {
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

    const toolbar = () => {
        if (selectedExpenses.length) {
            return <div className="p-2 rounded-md border border border-accent mb-2">
                <Dialog>
                    <DialogTrigger><Trash className="w-4 h-4" /></DialogTrigger>
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
            </div>
        } else {
            return <></>
        }
    }

    return (
        <>
            {toolbar()}
        </>
    )
}

export default ExpenseToolbar
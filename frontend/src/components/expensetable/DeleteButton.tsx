import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash } from 'lucide-react'
import axios from '@/api/axios'

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


const DeleteButton: React.FC<Props> = ({ expense }) => {
    const handleClick = async () => {
        await axios.delete(`/expense/delete/${expense.id}`, { withCredentials: true })
            .then(res => {
                if (res.data.message === 'Successfully deleted')
                    location.reload()
            })
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild className="hover:opacity-70">
                <div className="flex justify-between cursor-pointer">
                    Delete
                    <Trash className="h-4 w-4" />
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this expense?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the expense from your account.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClick}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteButton
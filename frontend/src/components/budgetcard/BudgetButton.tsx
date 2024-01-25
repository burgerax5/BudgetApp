import { useState, useEffect } from 'react'
import { useStore } from '@nanostores/react'
import { selectedDate } from '@/store/userStore'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from '@/api/axios'

interface Budget {
    id: number,
    amount: number,
    month: number,
    year: number
}

interface EditBudgetProps {
    budget: Budget | null,
    setBudget: React.Dispatch<React.SetStateAction<Budget | null>>
}

const BudgetButton: React.FC<EditBudgetProps> = ({ budget, setBudget }) => {
    const $selectedDate = useStore(selectedDate)
    const [newBudget, setNewBudget] = useState<number>(0)

    useEffect(() => {
        console.log($selectedDate)
    }, [$selectedDate])

    useEffect(() => {
        setNewBudget(budget?.amount || 0)
    }, [budget])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewBudget(parseInt(e.target.value))
    }

    const addBudget = async () => {
        await axios.post(
            `/budget/add/`, {
            amount: newBudget,
            month: $selectedDate.getMonth() + 1,
            year: $selectedDate.getFullYear()
        }, { withCredentials: true }
        ).then(res => {
            if (res.data.message === 'Successfully added budget.')
                location.replace('/')
        }).catch(err => {
            console.error('Failed to add budget:', err)
        })
    }

    const editBudget = async () => {
        await axios.put(
            `/budget/edit/${budget?.id}`, { ...budget, amount: newBudget }, { withCredentials: true }
        ).then(res => {
            if (res.data.message === 'Successfully edited budget.')
                location.replace('/')
        }).catch(err => {
            console.error('Failed to edit budget:', err)
        })
    }

    const deleteBudget = async () => {
        await axios.delete(
            `/budget/delete/${budget?.id}`, { withCredentials: true }
        ).then(res => {
            if (res.data.message === 'Successfully deleted a budget.')
                location.replace('/')
        }).catch(err => {
            console.error('Failed to delete budget:', err)
        })
    }

    const handleOnSubmit = async () => {
        if (budget) await editBudget()
        else await addBudget()
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">{budget ? 'Edit Budget' : 'Add Budget'}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Budget</DialogTitle>
                    <DialogDescription>
                        Adjust your budget for the month.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Amount
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            className="col-span-3"
                            value={newBudget}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleOnSubmit} type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default BudgetButton
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
    id: string,
    amount: number,
    month: number,
    year: number,
    categoryId: string
}

interface EditBudgetProps {
    budget: Budget | null,
    period: string
}

const BudgetButton: React.FC<EditBudgetProps> = ({ budget, period }) => {
    const $selectedDate = useStore(selectedDate)
    const [newBudget, setNewBudget] = useState<number>(0)

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
            month: $selectedDate.yearOnly ? undefined : $selectedDate.date.getMonth() + 1,
            year: $selectedDate.date.getFullYear()
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
                        Adjust your budget for the {period}.
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
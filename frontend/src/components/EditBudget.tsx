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

const EditBudget: React.FC<EditBudgetProps> = ({ budget, setBudget }) => {
    const $selectedDate = useStore(selectedDate)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBudget(prevBudget => {
            if (prevBudget) return { ...prevBudget, amount: parseInt(e.target.value) }
            else return prevBudget
        })
    }

    const addBudget = async () => {
        await axios.put(
            `/budget/add/`, budget, { withCredentials: true }
        ).then(res => {
            if (res.data.message === 'Succesfully added budget')
                location.replace('/')
        }).catch(err => {
            console.error('Failed to add budget:', err)
        })
    }

    const editBudget = async () => {
        await axios.put(
            `/budget/edit/${budget?.id}`, budget, { withCredentials: true }
        ).then(res => {
            if (res.statusText === 'Succesfully edited budget.')
                location.replace('/')
        }).catch(err => {
            console.error('Failed to edit budget:', err)
        })
    }

    const handleOnSubmit = async () => {
        if (budget && budget.id) // 
            await editBudget()
        else
            await addBudget()
    }

    useEffect(() => {
        // const getBudgetForDate = async () => {
        //     await axios.get(
        //         `/budget/?month=${$selectedDate.getMonth() + 1}&year=${$selectedDate.getFullYear()}`,
        //         { withCredentials: true }
        //     ).then(res => {
        //         if (res.data) setBudget(res.data.budgets[0])
        //     }).catch(err => {
        //         console.error('Error fetching budget details:', err)
        //     })
        // }
    }, [])

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Edit Budget</Button>
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
                            value={budget ? budget.amount : 0}
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

export default EditBudget
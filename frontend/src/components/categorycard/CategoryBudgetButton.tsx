import { useState, useEffect } from 'react'
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
import { useStore } from '@nanostores/react'
import { selectedDate, budgetByDate } from '@/store/userStore'

interface Category {
    id: number,
    name: string
}

interface Props {
    categories: Category[]
}

export const CategoryBudgetButton: React.FC<Props> = ({ categories }) => {
    const $selectedDate = useStore(selectedDate)
    const $budgetByDate = useStore(budgetByDate)

    const handleOnSubmit = () => {

    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Manage</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Category Budgets</DialogTitle>
                    <DialogDescription>
                        {`Manage the budgets for ${$selectedDate.toLocaleDateString('default', { month: 'short' })} ${$selectedDate.getFullYear()}`}
                    </DialogDescription>
                </DialogHeader>
                <div className="mx-auto text-2xl font-bold">${$budgetByDate?.amount}</div>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        {categories.map(category => (
                            <>
                                <Label htmlFor="name" className="text-right">
                                    {category.name}
                                </Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    className="col-span-3"
                                // value={newBudget}
                                // onChange={handleInputChange}
                                />
                            </>
                        ))}
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleOnSubmit} type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

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
import axios from '@/api/axios'

interface Category {
    id: number,
    name: string
}

interface Props {
    categories: Category[],
    budgetByCategory: number[]
}

export const CategoryBudgetButton: React.FC<Props> = ({ categories, budgetByCategory }) => {
    const $selectedDate = useStore(selectedDate)
    const $budgetByDate = useStore(budgetByDate)
    const [newBudgetByCategory, setNewBudgetByCategory] = useState(budgetByCategory)
    const [error, setError] = useState<string | null>(null)
    const [remaining, setRemaining] = useState<number>($budgetByDate ?
        $budgetByDate.amount - budgetByCategory.reduce((prev, curr) => prev + curr)
        : 0)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setNewBudgetByCategory(prevBudgetByCategory => {
            const index = parseInt(id)
            return prevBudgetByCategory.slice(0, index).concat(parseInt(value)).concat(prevBudgetByCategory.slice(index + 1))
        })
    }

    useEffect(() => {
        if (remaining < 0) setError("Exceeded this month's budget")
        else setError(null)
    }, [remaining])

    useEffect(() => {
        setRemaining($budgetByDate ? $budgetByDate.amount - newBudgetByCategory.reduce((prev, curr) => prev + curr) : 0)
    }, [newBudgetByCategory, $budgetByDate])

    const handleOnSubmit = () => {
        if (!error) console.log(newBudgetByCategory)
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
                <div className="mx-auto flex flex-col items-center">
                    <span className="text-2xl font-bold">${remaining}</span>
                    out of ${$budgetByDate?.amount}
                    {error && <span className="text-sm opacity-70 text-red-400">{error}</span>}
                </div>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        {categories.map((category, i) => (
                            <>
                                <Label htmlFor="name" className="text-right">
                                    {category.name}
                                </Label>
                                <Input
                                    id={i.toString()}
                                    type="number"
                                    className="col-span-3"
                                    value={newBudgetByCategory[i]}
                                    onChange={handleInputChange}
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

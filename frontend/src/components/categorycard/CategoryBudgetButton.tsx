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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Category {
    id: number,
    name: string
}

interface Budget {
    id: number,
    userId: number,
    categoryId: number,
    amount: number,
    month: number,
    year: number
}

interface Props {
    categories: Category[],
    budgetByCategory: number[],
}

export const CategoryBudgetButton: React.FC<Props> = ({ categories, budgetByCategory }) => {
    const $selectedDate = useStore(selectedDate)
    const $budgetByDate = useStore(budgetByDate)
    const [newBudgetByCategory, setNewBudgetByCategory] = useState(budgetByCategory)
    const [error, setError] = useState<string | null>(null)
    const [remaining, setRemaining] = useState<number>($budgetByDate ?
        $budgetByDate.amount - newBudgetByCategory.reduce((prev, curr) => prev + curr) : 0
    )
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target

        setNewBudgetByCategory(prevBudgetByCategory => {
            const index = parseInt(id)
            const amount = parseFloat(value) || 0
            return prevBudgetByCategory.slice(0, index).concat(amount).concat(prevBudgetByCategory.slice(index + 1))
        })
    }

    useEffect(() => {
        if (remaining < 0) setError("Exceeded this month's budget")
        else setError(null)
    }, [remaining])

    useEffect(() => {
        setNewBudgetByCategory(budgetByCategory)
    }, [budgetByCategory])

    useEffect(() => {
        setRemaining($budgetByDate ? $budgetByDate.amount - newBudgetByCategory.reduce((prev, curr) => prev + curr) : 0)
    }, [newBudgetByCategory, $budgetByDate])

    const getCategoryBudget = async (index: number): Promise<Budget | null> => {
        const res = await axios.get(
            `/budget/?month=${$selectedDate.getMonth() + 1}&year=${$selectedDate.getFullYear()}&categoryId=${index + 1}`,
            { withCredentials: true }
        )
        return res.data.budgets[0]
    }

    const editCategoryBudget = async (index: number) => {
        const budget = await getCategoryBudget(index)
        if (budget) {
            await axios.put(`/budget/edit/${budget.id}`, { ...budget, amount: newBudgetByCategory[index] }, { withCredentials: true })
                .catch(err => {
                    console.error('Failed to edit category budget:', err)
                })
        }
    }

    const addCategoryBudget = async (index: number) => {
        await axios.post('/budget/add/', {
            month: $selectedDate.getMonth() + 1,
            year: $selectedDate.getFullYear(),
            categoryId: index + 1,
            amount: newBudgetByCategory[index]
        }, { withCredentials: true })
            .catch(err => {
                console.error('Failed to add category expense:', err)
            })
    }

    const handleOnSubmit = () => {
        if (!error) {
            for (let i = 0; i < budgetByCategory.length; i++) {
                console.log(budgetByCategory[i], newBudgetByCategory[i])
                if (budgetByCategory[i] && newBudgetByCategory[i])
                    editCategoryBudget(i)
                else if (!budgetByCategory[i] && newBudgetByCategory[i])
                    addCategoryBudget(i)
            }

            location.replace('/')
        }
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
                        <Label className="text-right">
                            Category
                        </Label>
                        <Select onValueChange={(value) => {
                            setSelectedCategory(parseInt(value))
                        }}>
                            <SelectTrigger className="w-[180px] col-span-3">
                                <SelectValue placeholder={selectedCategory ? categories[selectedCategory].name : "Select Category"} />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category, i) => (
                                    <SelectItem key={`select-item-${i}`} value={i.toString()}>{category.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedCategory !== null &&
                            <>
                                <Label className="text-right">
                                    Amount
                                </Label>
                                <Input
                                    id={selectedCategory.toString()}
                                    type="number"
                                    className="col-span-3"
                                    value={newBudgetByCategory[selectedCategory].toString()}
                                    placeholder="0"
                                    onChange={handleInputChange}
                                />
                            </>}
                    </div>
                </div>
                <DialogFooter key={crypto.randomUUID()}>
                    <Button onClick={handleOnSubmit} type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

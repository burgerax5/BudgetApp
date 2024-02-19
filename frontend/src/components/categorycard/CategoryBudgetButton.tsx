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
    id: string,
    name: string
}

interface Budget {
    id: string,
    userId: number,
    categoryId: number,
    amount: number,
    month: number,
    year: number
}

interface CategoryBudget {
    id: string,
    name: string,
    colour: string,
    amount: number
}

interface Props {
    categories: Category[],
    budgetByCategory: CategoryBudget[],
}

export const CategoryBudgetButton: React.FC<Props> = ({ categories, budgetByCategory }) => {
    const getBudgetAmount = () => {
        return {
            'Food & Drink': budgetByCategory[0] ? budgetByCategory[0].amount.toString() : '0',
            'Entertainment': budgetByCategory[1] ? budgetByCategory[1].amount.toString() : '0',
            "Transportation": budgetByCategory[2] ? budgetByCategory[2].amount.toString() : '0',
            "Health": budgetByCategory[3] ? budgetByCategory[3].amount.toString() : '0',
            "Education": budgetByCategory[4] ? budgetByCategory[4].amount.toString() : '0',
            "Housing": budgetByCategory[5] ? budgetByCategory[5].amount.toString() : '0',
            "Utilities": budgetByCategory[6] ? budgetByCategory[6].amount.toString() : '0',
            "Insurance": budgetByCategory[7] ? budgetByCategory[7].amount.toString() : '0',
            "Debt Repayment": budgetByCategory[8] ? budgetByCategory[8].amount.toString() : '0',
            "Clothing": budgetByCategory[9] ? budgetByCategory[9].amount.toString() : '0',
            "Miscellaneous": budgetByCategory[10] ? budgetByCategory[10].amount.toString() : '0',
        }
    }

    const sumCategoryBudgets = () => {
        const entries = Object.entries(newBudgetByCategory)
        let sum = 0
        entries.map(category => { sum += parseFloat(category[1]) })
        return sum
    }

    const getCategoryIdByName = (name: string) => {
        return categories.find(cat => cat.name === name)?.id
    }

    const getCategoryBudgetByName = (name: string) => {
        const entries = Object.entries(newBudgetByCategory)
        const cat = entries.find(catBudget => catBudget[0] === name)
        return cat ? cat[1] : 0
    }

    const $selectedDate = useStore(selectedDate)
    const $budgetByDate = useStore(budgetByDate)
    const [newBudgetByCategory, setNewBudgetByCategory] = useState(getBudgetAmount())
    const [error, setError] = useState<string | null>(null)
    const [remaining, setRemaining] = useState<number>(sumCategoryBudgets())
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        console.log({ ...newBudgetByCategory, [id]: value })
        setNewBudgetByCategory(prevBudgetByCategory => {
            return { ...prevBudgetByCategory, [id]: parseFloat(value) }
        })
    }

    useEffect(() => {
        if (remaining < 0) setError("Exceeded this month's budget")
        else setError(null)
    }, [remaining])

    useEffect(() => {
        setNewBudgetByCategory(getBudgetAmount())
    }, [budgetByCategory])

    useEffect(() => {
        console.log(newBudgetByCategory)
    }, [newBudgetByCategory])

    useEffect(() => {
        setRemaining(() => {
            if ($budgetByDate && sumCategoryBudgets())
                return $budgetByDate.amount - sumCategoryBudgets()
            else if ($budgetByDate)
                return $budgetByDate.amount
            else
                return 0
        })
    }, [newBudgetByCategory, $budgetByDate])

    const getCategoryBudget = async (categoryId: string): Promise<Budget | null> => {

        const url = $selectedDate.yearOnly ?
            `/budget/?year=${$selectedDate.date.getFullYear()}&categoryId=${categoryId}` :
            `/budget/?month=${$selectedDate.date.getMonth() + 1}&year=${$selectedDate.date.getFullYear()}&categoryId=${categoryId}`

        const res = await axios.get(url, { withCredentials: true })

        if (!$selectedDate.yearOnly) return res.data.budgets[0]

        for (let i = 0; i < res.data.budgets.length; i++) {
            const budget = res.data.budgets[i]
            if (!budget.month &&
                budget.year === $selectedDate.date.getFullYear() &&
                selectedCategory !== null &&
                budget.categoryId === selectedCategory + 1) {
                return budget
            }
        } return null
    }

    const editCategoryBudget = async (categoryId: string) => {
        const budget = await getCategoryBudget(categoryId)
        if (budget) {
            const category = categories.find(cat => cat.id === categoryId)
            const index = categories.findIndex(cat => cat.id === categoryId)
            const entries = Object.entries(newBudgetByCategory)

            await axios.put(`/budget/edit/${budget.id}`, { ...budget, amount: category ? entries[index][1] : null }, { withCredentials: true })
                .catch(err => {
                    console.error('Failed to edit category budget:', err)
                })
        }
    }

    const addCategoryBudget = async (index: number) => {
        if (!selectedCategory) return

        const budgetData = {
            month: $selectedDate.yearOnly ? null : $selectedDate.date.getMonth() + 1,
            year: $selectedDate.date.getFullYear(),
            categoryId: getCategoryIdByName(selectedCategory),
            amount: getCategoryBudgetByName(selectedCategory)
        }

        await axios.post('/budget/add/', budgetData, { withCredentials: true })
            .catch(err => {
                console.error('Failed to add category expense:', err)
            })
    }

    const handleOnSubmit = () => {
        if (!error) {
            if (selectedCategory !== null) {
                const id = getCategoryIdByName(selectedCategory)
                const i = Object.keys(newBudgetByCategory).findIndex(catName => catName === selectedCategory)

                if (!id) return

                if (budgetByCategory[i] && id)
                    editCategoryBudget(id)
                else if (!budgetByCategory[i] && id)
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
                        {`Manage the budgets for ${$selectedDate.date.toLocaleDateString('default', { month: 'short' })} ${$selectedDate.date.getFullYear()}`}
                    </DialogDescription>
                </DialogHeader>
                <div className="mx-auto flex flex-col items-center">
                    <span className="text-2xl font-bold">${remaining}</span>
                    {$budgetByDate ? `out of ${$budgetByDate?.amount}` : ""}
                    {error && <span className="text-sm opacity-70 text-red-400">{error}</span>}
                </div>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">
                            Category
                        </Label>
                        <Select onValueChange={(value) => {
                            setSelectedCategory(value)
                        }}>
                            <SelectTrigger className="w-[180px] col-span-3">
                                <SelectValue placeholder={selectedCategory ? selectedCategory : "Select Category"} />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category, i) => (
                                    <SelectItem key={`select-item-${i}`} value={category.name}>{category.name}</SelectItem>
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
                                    value={getCategoryBudgetByName(selectedCategory) ? getCategoryBudgetByName(selectedCategory)?.toString() : 0}
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

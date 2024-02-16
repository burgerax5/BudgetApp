import React, { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, Pencil } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { useStore } from '@nanostores/react'
import { categories, expenses } from '@/store/userStore'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import axios from '@/api/axios'
import { Calendar } from '../ui/calendar'

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

interface Category {
    id: string,
    name: string,
    colour: string
}

const EditButton: React.FC<Props> = ({ expense }) => {
    const $categories = useStore(categories)
    const [date, setDate] = useState<Date | undefined>(new Date(expense.year, expense.month - 1, expense.day))
    const [formData, setFormData] = useState<Expense>(expense)
    const [error, setError] = useState<string | null>(null)

    const verifyFormData = (): boolean => {
        const { name, categoryId, amount, day, month, year } = formData
        const date = new Date(year, month, day)
        return !(!name || !categoryId || !amount || !date)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData(prevFormData => ({
            ...prevFormData,
            [id]: value
        }))

    }

    const getCategoryName = (id: string) => {
        return $categories.find(cat => cat.id === id)?.name
    }

    const editExpense = async () => {
        if (verifyFormData()) {
            const res = await axios.put(`/expense/edit/${expense.id}`, { expense: { ...formData, amount: formData.amount } }, { withCredentials: true })
            if (res.data.expense) {
                location.reload()
            }
        } else
            setError('Missing or invalid form data')
    }

    useEffect(() => {
        if (date)
            setFormData(prevFormData => ({
                ...prevFormData,
                day: date?.getDate(),
                month: date?.getMonth() + 1,
                year: date?.getFullYear()
            }))
    }, [date])

    return (
        <Dialog>
            <DialogTrigger asChild className="hover:opacity-70">
                <div className="flex justify-between cursor-pointer">
                    Edit
                    <Pencil className="h-4 w-4" />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Expense</DialogTitle>
                    <DialogDescription>
                        Provide information about the expense.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            onChange={handleInputChange}
                            value={formData.name}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Category
                        </Label>
                        <Select onValueChange={(value) => {
                            setFormData(prevFormData => (
                                { ...prevFormData, categoryId: value }
                            ))
                        }}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={getCategoryName(expense.id)} />
                            </SelectTrigger>
                            <SelectContent>
                                {$categories.map(category => {
                                    return <SelectItem key={category.id}
                                        value={`${category.id}`}
                                    >{category.name}</SelectItem>
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Price
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            onChange={handleInputChange}
                            value={formData.amount}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">
                            Date
                        </Label>
                        <div>
                            <Popover>
                                <PopoverTrigger>
                                    <Button variant="outline">
                                        <div className="ml-2">
                                            {date?.getDate()} {date?.toLocaleDateString('default', { month: 'short' })} {date?.getFullYear()}
                                        </div>
                                        <CalendarIcon className="ml-3.5" width="20" height="20" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    {error && <span className="text-sm opacity 0.7">{error}</span>}
                    <Button type="submit" onClick={editExpense}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditButton
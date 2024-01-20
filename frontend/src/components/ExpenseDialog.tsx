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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useState, useEffect } from "react"
import axios from "@/api/axios"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "./ui/calendar"
import { useToast } from "./ui/use-toast"

interface Category {
    id: number,
    name: string,
}

interface Expense {
    name: string,
    categoryId: number,
    amount: string,
    day: number,
    month: number,
    year: number
}

export function DialogButton() {
    const [categories, setCategories] = useState<Category[]>([])
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [formData, setFormData] = useState<Expense>({
        name: '',
        categoryId: 0,
        amount: '0',
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    })
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

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

    const addExpense = async () => {
        console.log('Form Data: ', formData)
        if (verifyFormData()) {
            const res = await axios.post('/expense/add', { expense: { ...formData, amount: parseFloat(formData.amount) } }, { withCredentials: true })
            if (res.data) {
                console.log('Added expense')
                toast({
                    title: "Successfully added expense",
                    description: `${formData.name} $${formData.amount}`
                })
            }
            else {
                console.log('Failed to add expense')
                toast({
                    title: "Failed to add expense",
                    description: `Bruh`
                })
            }
        } else
            setError('Missing or invalid form data')
    }

    useEffect(() => {
        const getCategories = async () => {
            const res = await axios.get('/category/')
            setCategories(res.data.categories)
        }
        getCategories()
    }, [])

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
            <DialogTrigger asChild>
                <Button variant="outline">Add Expense</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Expense</DialogTitle>
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
                                { ...prevFormData, categoryId: parseInt(value) }
                            ))
                        }}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(category => {
                                    return <SelectItem onClick={() => console.log('hi')}
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
                    <Button type="submit" onClick={addExpense}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
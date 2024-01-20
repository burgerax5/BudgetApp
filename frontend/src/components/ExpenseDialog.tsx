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
    price: number,
    day: number,
    month: number,
    year: number
}

export function DialogButton() {
    const [categories, setCategories] = useState<Category[]>([])
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [formData, setFormData] = useState<Expense>({
        name: '',
        categoryId: 1,
        price: 0,
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    })
    const { toast } = useToast()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData(prevFormData => ({
            ...prevFormData,
            [id]: value
        }))
    }

    const addExpense = async () => {
        console.log('Form Data: ', formData)
        const res = await axios.post('/expense/add', formData, { withCredentials: true })
        if (res.data)
            toast({
                title: "Successfully added expense",
                description: `${formData.name} $${formData.price}`
            })
        else
            toast({
                title: "Failed to add expense",
                description: `Bruh`
            })
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
                                { ...prevFormData, category: value }
                            ))
                        }}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Food & Drink" />
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
                            id="price"
                            type="number"
                            onChange={handleInputChange}
                            value={formData.price}
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
                    <Button type="submit" onClick={addExpense}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
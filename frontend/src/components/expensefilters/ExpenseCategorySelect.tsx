import { useState, useEffect } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from '../ui/label'
import axios from '@/api/axios'
import { useStore } from '@nanostores/react'
import { expenseFilters } from '@/store/userStore'

interface Category {
    name: string,
    id: number,
}

const ExpenseCategorySelect = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const $expenseFilters = useStore(expenseFilters)
    const [selectedCategory, setSelectedCategory] = useState<string>
        ($expenseFilters.category ? $expenseFilters.category : "Any category")

    useEffect(() => {
        const getCategories = async () => {
            const res = await axios.get('/category/')
            if (res.data)
                setCategories(res.data.categories)
        }

        getCategories()
    }, [])

    const getCategory = (name: string) => {
        categories.map(cat => {
            if (cat.name === name)
                expenseFilters.set({ ...$expenseFilters, category: cat.name })
        })
    }

    useEffect(() => {
        setSelectedCategory($expenseFilters.category ? $expenseFilters.category : "Any category")
    }, [$expenseFilters.category])

    return (
        <div>
            <Label className="col-span-1">Category</Label>
            <Select onValueChange={(value) => getCategory(value)}>
                <SelectTrigger className="w-[180px]" value={selectedCategory}>
                    {selectedCategory}
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {categories.map(cat => (
                            <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}

export default ExpenseCategorySelect
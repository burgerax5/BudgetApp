"use client"

import axios from "@/api/axios"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useState, useEffect } from "react"
import ProgressBar from "./ProgressBar"

interface Category {
    id: number,
    name: string,
    colour: string
}

interface Expense {
    id: number,
    userId: number,
    categoryId: number,
    currencyId: number,
    name: string,
    amount: number
}

function CategoriesCard() {
    const [categories, setCategories] = useState<Category[]>([])
    const [expenses, setExpenses] = useState<Expense[]>([])

    useEffect(() => {
        const getCategories = async () => {
            const res = await axios.get('/category/')
            if (res.data)
                setCategories(res.data.categories)
        }

        const getExpenses = async () => {
            const res = await axios.get('/expense/', { withCredentials: true })
            if (res.data)
                setExpenses(res.data.expenses)
        }

        getCategories()
        getExpenses()
    }, [])

    return (
        <Card className='h-full'>
            <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Spendings on different categories</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 items-center gap-3 text-right">
                    {categories.map(category => {
                        return <>
                            <div>{category.name}</div>
                            <ProgressBar percentage={0} />
                        </>
                    })}
                </div>
            </CardContent>
            {/* <CardFooter className='justify-end'>
                <DialogButton />
            </CardFooter> */}
        </Card>
    )
}

export default CategoriesCard
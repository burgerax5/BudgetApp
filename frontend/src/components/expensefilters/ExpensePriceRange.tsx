import React, { useState, useEffect } from 'react'
import { Slider } from "@/components/ui/slider"
import { Label } from '../ui/label'
import { useStore } from '@nanostores/react'
import { expenseFilters, expenses } from '@/store/userStore'

const ExpensePriceRange = () => {
    const [price, setPrice] = useState<number[]>([100])
    const [maxPrice, setMaxPrice] = useState<number>(0)
    const $expenseFilters = useStore(expenseFilters)
    const $expenses = useStore(expenses)

    useEffect(() => {
        let highest = 0
        $expenses.map(exp => {
            if (exp.amount > highest) highest = exp.amount
        })

        setMaxPrice(highest)
        console.log(highest)
    }, [])

    useEffect(() => {
        expenseFilters.set({ ...$expenseFilters, maxPrice: price[0] })
    }, [price])

    return (
        <>
            <Label>Max Price</Label>
            <Slider
                defaultValue={price}
                max={maxPrice}
                step={1}
                onValueChange={setPrice} />
            <span>${price}</span>
        </>
    )
}

export default ExpensePriceRange
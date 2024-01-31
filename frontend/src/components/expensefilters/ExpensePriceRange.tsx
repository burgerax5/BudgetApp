import React, { useState, useEffect } from 'react'
import { Slider } from "@/components/ui/slider"
import { Label } from '../ui/label'
import { useStore } from '@nanostores/react'
import { expenseFilters } from '@/store/userStore'

const ExpensePriceRange = () => {
    const [price, setPrice] = useState<number[]>([100])
    const $expenseFilters = useStore(expenseFilters)

    useEffect(() => {
        expenseFilters.set({ ...$expenseFilters, maxPrice: price[0] })
        console.log($expenseFilters)
    }, [price])

    return (
        <>
            <Label>Price</Label>
            <Slider
                defaultValue={price}
                max={100}
                step={1}
                onValueChange={setPrice} />
        </>
    )
}

export default ExpensePriceRange
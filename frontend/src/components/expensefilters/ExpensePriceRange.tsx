import React, { useState, useEffect } from 'react'
import { Slider } from "@/components/ui/slider"
import { Label } from '../ui/label'
import { useStore } from '@nanostores/react'
import { expenseFilters, expenses } from '@/store/userStore'
import { Input } from '../ui/input'

interface Props {
    maxPrice: number
}

const ExpensePriceRange: React.FC<Props> = ({ maxPrice }) => {
    const $expenseFilters = useStore(expenseFilters)
    const [price, setPrice] = useState<number[]>([$expenseFilters.maxPrice])

    useEffect(() => {
        expenseFilters.set({ ...$expenseFilters, maxPrice: price[0] })
    }, [price])

    return (
        <>
            <Label>Max Price</Label>
            <Slider
                value={price}
                max={maxPrice}
                step={1}
                onValueChange={setPrice} />
            <Input className="w-24" disabled value={`$${price[0]}`} />
        </>
    )
}

export default ExpensePriceRange
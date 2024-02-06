"use client"

import { useState, useEffect } from "react"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "../ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import ExpenseFilters from "./ExpenseFilters"
import { useStore } from "@nanostores/react"
import { expenseFilters } from "@/store/userStore"
import { Input } from "../ui/input"
import { Checkbox } from "../ui/checkbox"

export default function ExpenseDatePicker() {
    const $expenseFilters = useStore(expenseFilters)
    const months = [
        'January', 'February', 'March',
        'April', 'May', 'June',
        'July', 'August', 'September',
        'October', 'November', 'December'
    ]
    const [selectedDate, setSelectedDate] = useState<{
        month: number | null,
        year: number | null
    }>(
        {
            month: $expenseFilters.date.month,
            year: $expenseFilters.date.year ? $expenseFilters.date.year : new Date().getFullYear()
        }
    )

    const [checked, setChecked] = useState(selectedDate.year !== null)

    useEffect(() => {
        if (!checked)
            expenseFilters.set({
                ...$expenseFilters, date: {
                    month: null,
                    year: null
                }
            })
        else
            expenseFilters.set({ ...$expenseFilters, date: selectedDate })
    }, [checked])

    useEffect(() => {
        console.log($expenseFilters.date)
    }, [$expenseFilters])

    return (
        <>
            <Label>Date</Label>
            <div className="flex gap-3 item-center">
                <Checkbox className="my-auto"
                    checked={checked}
                    onCheckedChange={() => {
                        setChecked(prev => !prev)
                    }} />

                <Select
                    disabled={!checked}
                    onValueChange={(value) => {
                        console.log(parseInt(value) + 1)
                        expenseFilters.set({ ...$expenseFilters, date: { ...selectedDate, month: parseInt(value) + 1 } })
                    }}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={selectedDate.month ? selectedDate.month : "Any month"} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {months.map((month, i) => (
                                <SelectItem key={month} value={`${i}`}>{month}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Input className="w-[80px]" type="number"
                    disabled={!checked}
                    value={`${selectedDate.year}`}
                    onChange={(e) => {
                        const newYear = e.target.value
                        setSelectedDate((prevDate) => ({ ...prevDate, year: parseInt(newYear) }))
                    }} />
            </div>
        </>
    )
}
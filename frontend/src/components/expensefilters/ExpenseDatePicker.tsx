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

    return (
        <>
            <Label>Date</Label>
            <div className="flex gap-3 item-center">
                <Checkbox className="my-auto"
                    checked={$expenseFilters.date.checked}
                    onCheckedChange={() => {
                        expenseFilters.set({
                            ...$expenseFilters,
                            date: { ...$expenseFilters.date, checked: !$expenseFilters.date.checked }
                        })
                    }} />

                <Select
                    disabled={!$expenseFilters.date.checked}
                    onValueChange={(value) => {
                        console.log(parseInt(value) + 1)
                        expenseFilters.set({ ...$expenseFilters, date: { ...$expenseFilters.date, month: parseInt(value) + 1 } })
                    }}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={$expenseFilters.date.month ? $expenseFilters.date.month : "Any month"} />
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
                    disabled={!$expenseFilters.date.checked}
                    value={`${$expenseFilters.date.year}`}
                    onChange={(e) => {
                        const newYear = e.target.value
                        expenseFilters.set({
                            ...$expenseFilters,
                            date: {
                                ...$expenseFilters.date,
                                year: parseInt(newYear)
                            }
                        })
                        // setSelectedDate((prevDate) => ({ ...prevDate, year: parseInt(newYear) }))
                    }} />
            </div>
        </>
    )
}
import React, { useState, useEffect } from 'react'
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from '../ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useStore } from '@nanostores/react'
import { selectedDate } from '@/store/userStore'
import DatePickerForm from './DatePickerForm'

function DatePicker() {
    const $selectedDate = useStore(selectedDate)
    const monthShort: string = $selectedDate?.date.toLocaleDateString('default', { month: 'short' })

    return (
        <Popover>
            <PopoverTrigger>
                <Button variant="outline">
                    <CalendarIcon width="20" height="20" />
                    <div className="ml-2 flex gap-1">
                        {$selectedDate.yearOnly ? "All" : monthShort}
                        <div>{$selectedDate?.date.getFullYear()}</div>
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <DatePickerForm prevSelected={$selectedDate} />
            </PopoverContent>
        </Popover>
    )
}

export default DatePicker
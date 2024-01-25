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

    return (
        <Popover>
            <PopoverTrigger>
                <Button variant="outline">
                    <CalendarIcon width="20" height="20" />
                    <div className="ml-2">{$selectedDate?.toLocaleDateString('default', { month: 'short' })} {$selectedDate?.getFullYear()}</div>
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <DatePickerForm prevSelected={$selectedDate} />
            </PopoverContent>
        </Popover>
    )
}

export default DatePicker
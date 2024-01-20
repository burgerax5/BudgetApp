import React, { useState, useEffect } from 'react'
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from './ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

function Calendar() {
    const today: Date = new Date()
    const [date, setDate] = useState<Date | undefined>(new Date())

    return (
        <Popover>
            <PopoverTrigger>
                <Button variant="outline">
                    <CalendarIcon width="20" height="20" />
                    <div className="ml-2">{date?.toLocaleDateString('default', { month: 'short' })} {date?.getFullYear()}</div>
                </Button>
            </PopoverTrigger>
            <PopoverContent>Place content for the popover here.</PopoverContent>
        </Popover>
    )
}

export default Calendar
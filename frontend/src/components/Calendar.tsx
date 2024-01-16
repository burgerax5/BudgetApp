import React, { useState, useEffect } from 'react'
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from './ui/button'

interface SelectedDate {
    month: number,
    year: number
}

function Calendar() {
    const today: Date = new Date()
    const [selectedDate, setSelectedDate] = useState<SelectedDate>({
        month: today.getMonth() + 1,
        year: today.getFullYear()
    })

    const formatMonth = (month: number): string => {
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr',
            'May', 'Jun', 'Jul', 'Aug',
            'Sep', 'Oct', 'Nov', 'Dec',
        ];
        return months[month - 1];
    };

    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newMonth = parseInt(event.target.value, 10);
        setSelectedDate({ ...selectedDate, month: newMonth });
    };

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newYear = parseInt(event.target.value, 10);
        setSelectedDate({ ...selectedDate, year: newYear });
    };

    return (
        <Button variant="outline">
            <CalendarIcon width="20" height="20" />
            <div className="ml-2">{formatMonth(selectedDate.month)} {selectedDate.year}</div>
        </Button>

    )
}

export default Calendar
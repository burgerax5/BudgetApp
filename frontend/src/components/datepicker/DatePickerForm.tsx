import React, { useState, useEffect } from 'react'
import { Label } from '../ui/label'
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '../ui/button'
import { useStore } from '@nanostores/react'
import { selectedDate } from '@/store/userStore'

interface Props {
    prevSelected: Date
}

interface DateEntries {
    month: number | null,
    year: number
}

enum Month {
    Null,
    January,
    February,
    March,
    April,
    May,
    June,
    July,
    August,
    September,
    October,
    November,
    December
}

const DatePickerForm: React.FC<Props> = ({ prevSelected }) => {
    const monthsArray = Object.keys(Month).filter(key => !isNaN(Number(key)))
    const [date, setDate] = useState<DateEntries>({
        month: prevSelected.getMonth() + 1, year: prevSelected.getFullYear()
    })
    const $selectedDate = useStore(selectedDate)

    useEffect(() => {
        setDate(date)
    }, [prevSelected])

    useEffect(() => {
        console.log($selectedDate.getMonth() + 1, $selectedDate.getFullYear())
    }, [$selectedDate])

    const handleSubmit = () => {
        selectedDate.set(new Date(date.year, date.month ? date.month - 1 : $selectedDate.getMonth() - 1, 1))
    }

    return (
        <div className="flex flex-col items-start gap-3.5">
            <div>
                <Label className="text-right">
                    Month
                </Label>
                <Select onValueChange={(value) => {
                    const month = parseInt(value)
                    setDate(prevDate => ({ ...prevDate, month }))
                }}>
                    <SelectTrigger className="w-[252px]">
                        <SelectValue placeholder={Month[date?.month || 0]} />
                    </SelectTrigger>
                    <SelectContent>
                        {monthsArray.map((month, i) => (
                            <SelectItem value={`${i}`}>{Month[i]}</SelectItem>
                        )
                        )}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label className="text-right">
                    Year
                </Label>
                <Input
                    id="year"
                    type="number"
                    className="w-[252px]"
                    value={date.year}
                    placeholder={`${date.year}`}
                    onChange={(e) => {
                        const year = parseInt(e.target.value)
                        setDate(prevDate => ({ ...prevDate, year }))
                    }}
                />
            </div>
            <Button className="ml-auto" onClick={handleSubmit}>Submit</Button>
        </div>
    )
}

export default DatePickerForm
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
import { Checkbox } from "@/components/ui/checkbox"
import { useStore } from '@nanostores/react'
import { selectedDate } from '@/store/userStore'

interface Props {
    prevSelected: {
        date: Date,
        yearOnly: boolean
    }
}

interface DateEntries {
    month: number | null,
    year: number
}

enum Month {
    January = 1,
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
        month: prevSelected.date.getMonth() + 1, year: prevSelected.date.getFullYear()
    })
    const [yearOnly, setYearOnly] = useState<boolean>(prevSelected.yearOnly)
    const $selectedDate = useStore(selectedDate)

    useEffect(() => {
        setDate(date)
    }, [prevSelected])

    const handleSubmit = () => {
        selectedDate.set({
            date: new Date(date.year, date.month ? date.month - 1 : $selectedDate?.date.getMonth() - 1, 1),
            yearOnly
        })
    }

    return (
        <div className="flex flex-col items-start gap-3.5">
            <div>
                <Label className="text-right">
                    Month
                </Label>
                <Select
                    disabled={yearOnly}
                    onValueChange={(value) => {
                        const month = parseInt(value)
                        if (!month) setDate(prevDate => ({ ...prevDate, month: null }))
                        else setDate(prevDate => ({ ...prevDate, month }))
                    }}>
                    <SelectTrigger className="w-[252px]">
                        <SelectValue placeholder={Month[date?.month || 1]} />
                    </SelectTrigger>
                    <SelectContent>
                        {monthsArray.map((month, i) => {
                            if (i > 0) {
                                return <SelectItem value={`${i}`}>{Month[i]}</SelectItem>
                            }
                        }
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
            <div className="flex items-center gap-3.5">
                <Checkbox
                    id="yearOnly"
                    checked={yearOnly}
                    onCheckedChange={() => {
                        setYearOnly(prev => !prev)
                    }} />
                <label
                    htmlFor="yearOnly"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Budget for the whole year
                </label>
            </div>
            <Button className="ml-auto" onClick={handleSubmit}>Submit</Button>
        </div>
    )
}

export default DatePickerForm
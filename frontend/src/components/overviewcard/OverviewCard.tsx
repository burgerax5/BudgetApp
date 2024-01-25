import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useStore } from '@nanostores/react'
import { selectedDate } from '@/store/userStore'

const OverviewCard = () => {
    const $selectedDate = useStore(selectedDate)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Your spendings this year</CardDescription>
            </CardHeader>
            <CardContent>

            </CardContent>
        </Card>
    )
}

export default OverviewCard
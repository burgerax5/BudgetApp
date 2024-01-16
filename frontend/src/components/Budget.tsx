import React, { useState, useEffect } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

function Budget() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Budget</CardTitle>
                <CardDescription>Your monthly budget</CardDescription>
            </CardHeader>
            <CardContent>
                <p>BEEP BOOP</p>
            </CardContent>
            <CardFooter>
                <p>BOOP BEEP</p>
            </CardFooter>
        </Card>
    )
}

export default Budget
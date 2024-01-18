import React, { useState, useEffect } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { DialogButton } from './Dialog'

function Budget() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Budget</CardTitle>
                <CardDescription>Your monthly budget</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='rounded-full w-40 h-40 mx-auto relative'>
                    <div className='rounded-full border-8 border-accent w-full h-full absolute flex items-center justify-center'>
                        <div className='flex flex-col items-center justify-center'>
                            <div className='font-bold text-2xl'>$2500.00</div>
                            <div className='text-sm opacity-70'>out of $5000.00</div>
                        </div>
                    </div>
                    <div className='rounded-full border-8 border-primary w-full h-full absolute'></div>
                </div>
            </CardContent>
            <CardFooter className='justify-end'>
                <DialogButton />
            </CardFooter>
        </Card>
    )
}

export default Budget
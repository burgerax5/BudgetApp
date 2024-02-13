import { useState, useEffect } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const Stats = () => {
    return (
        <>
            <div className="w-full">
                <div className="max-w-[300px]">
                    <h1 className="text-2xl font-bold py-3">Stats</h1>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">Username</TableCell>
                                <TableCell>Stats</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Password</TableCell>
                                <TableCell>
                                    <a className="text-primary">Change Password</a>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    )
}

export default Stats
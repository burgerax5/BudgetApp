import axios from '@/api/axios'
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

const BasicInformation = () => {
    const [username, setUsername] = useState<string>("")

    const getUser = async () => {
        await axios.get('/auth/', { withCredentials: true }).then(res => {
            console.log(res.data)
            if (res.data)
                setUsername(res.data.username)
        })
    }

    useEffect(() => {
        getUser()
    }, [])

    useEffect(() => {
        console.log(username)
    }, [username])

    return (
        <div className="w-full">
            <div className="max-w-[300px]">
                <h1 className="text-2xl font-bold py-3">Profile</h1>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">Username</TableCell>
                            <TableCell>{username}</TableCell>
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
    )
}

export default BasicInformation
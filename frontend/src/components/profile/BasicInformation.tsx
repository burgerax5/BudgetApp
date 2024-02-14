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
import { Lock } from 'lucide-react'
import { Button } from '../ui/button'
import { useStore } from '@nanostores/react'
import { show2FAForm } from '@/store/userStore'

const BasicInformation = () => {
    const [username, setUsername] = useState<string>("")
    const [enabled2FA, setEnabled2FA] = useState<boolean>(false)
    const $show2FAForm = useStore(show2FAForm)

    const getUser = async () => {
        await axios.get('/auth/', { withCredentials: true }).then(res => {
            console.log(res.data)
            if (res.data) {
                setUsername(res.data.username)
                setEnabled2FA(res.data.enabled2FA)
            }
        })
    }

    useEffect(() => {
        getUser()
    }, [])

    useEffect(() => {
        console.log(username)
    }, [username])

    return (
        <div className="w-full h-full relative">
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
                        <TableRow>
                            <TableCell className="font-medium">2FA</TableCell>
                            <TableCell>
                                <a className="text-primary">
                                    {enabled2FA ?
                                        <div className="flex items-center gap-3">
                                            Enabled <Lock className="h-4 w-4" />
                                        </div>
                                        :
                                        <div>
                                            Not Enabled
                                        </div>}
                                </a>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                {!enabled2FA && <div className="w-full flex mt-3">
                    <Button className="ml-auto" onClick={() => show2FAForm.set(true)}>Enable 2FA</Button>
                </div>}
            </div>
        </div>
    )
}

export default BasicInformation
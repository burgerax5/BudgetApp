import { useState, useEffect } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { useStore } from '@nanostores/react'
import { isLoggedIn } from '@/store/userStore'
import { readCookie } from '@/util/cookies'
import axios from '@/api/axios'

const ForgotPassword = () => {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const $isLoggedIn = useStore(isLoggedIn)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>,
        input: "username" | "confirmPassword" | "password") => {
        switch (input) {
            case "username":
                setUsername(e.target.value)
                break
            case "password":
                setPassword(e.target.value)
                break
            case "confirmPassword":
                setConfirmPassword(e.target.value)
                break
            default:
                console.error('Handle input change')
        }
    }

    const handleSubmit = () => {
        const resetPassword = async () => {
            await axios.post('/auth/resetPassword', {
                username,
                password
            })
                .then(res => {
                    if (res.data.success) {
                        location.replace('/')
                    } else {
                        console.error('An error occurred while resetting password')
                    }
                })
        }

        const getUser = async () => {
            await axios.get(`/auth/users/${username}`)
                .then(res => {
                    if (res.data.user_exists && verifyPassword()) {
                        console.log("HI")
                        resetPassword()
                    }
                })
        }

        const verifyPassword = () => {
            return password === confirmPassword && password.length >= 6
        }

        getUser()
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Forgot Password</CardTitle>
                <CardDescription>Reset your password</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                {!$isLoggedIn && <>
                    <Label>Username</Label>
                    <Input value={username} onChange={(e) => handleInputChange(e, "username")} />
                </>}
                <Label>New Password</Label>
                <Input value={password} onChange={(e) => handleInputChange(e, "password")} />
                <Label>Confirm Password</Label>
                <Input value={confirmPassword} onChange={(e) => handleInputChange(e, "confirmPassword")} />
            </CardContent>
            <CardFooter>
                <Button className="ml-auto" onClick={handleSubmit}>Submit</Button>
            </CardFooter>
        </Card>
    )
}

export default ForgotPassword
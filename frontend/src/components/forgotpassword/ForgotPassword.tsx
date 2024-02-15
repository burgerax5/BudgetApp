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
import axios from '@/api/axios'
import { PasswordInput } from '../ui/password-input'
import { UsernameInput } from '../ui/username-input'
import Cookies from 'js-cookie'

interface RegistrationFormState {
    username: string
    password: string
    confirmPassword?: string
    otp?: string
    errors: {
        username: string
        password: string,
        confirmPassword?: string,
        otp?: string
    }
}

const ForgotPasswordPage = () => {
    const [formState, setFormState] = useState<RegistrationFormState>({
        username: Cookies.get('username') ? Cookies.get('username') as string : '',
        password: '',
        confirmPassword: '',
        otp: '',
        errors: {
            username: '',
            password: '',
            confirmPassword: '',
            otp: ''
        },
    })
    const [show2FA, setShow2FA] = useState(false)
    const [otp, setOTP] = useState("")
    const [errors, setErrors] = useState({
        username: "",
        confirmPassword: "",
        otp: ""
    })

    const $isLoggedIn = useStore(isLoggedIn)

    useEffect(() => {
        const getUsername = async () => {
            await axios.get('/auth/', { withCredentials: true })
                .then(res => {
                    console.log(res.data.username)
                    if (res.data.username)
                        setFormState({ ...formState, })
                })
        }

        getUsername()
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormState((prev) => ({
            ...prev,
            [name]: value,
            errors: {
                ...prev.errors,
                [name]: '',
            },
        }));
    };

    const resetPassword = async () => {
        await axios.post('/auth/resetPassword', {
            username: formState.username,
            password: formState.password
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
        console.log({
            username: formState.username,
            password: formState.password,
            confirmPassword: formState.confirmPassword
        })
        const username = formState.username
        if (username && username.length !== 0) {
            await axios.get(`/auth/users/${username}`)
                .then(res => {
                    console.log(res.data)
                    if (res.data.user_exists && verifyPassword() && !res.data.requires2FA) {
                        resetPassword()
                    } else if (res.data.user_exists && verifyPassword() && res.data.requires2FA) {
                        setShow2FA(true)
                    }
                })
        }
    }

    const verifyPassword = () => {
        return formState.password === formState.confirmPassword && formState.password.length >= 6
    }

    const handleSubmit = () => {
        getUser()
    }

    const handle2FASubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const verifyOTP = async (token: string) => {
            const res = await axios.post('/auth/verify-otp', { token }, { withCredentials: true })
            return res.data.valid
        }

        e.preventDefault()
        const valid = await verifyOTP(otp)

        if (valid)
            resetPassword()
        else
            setErrors(prev => ({ ...prev, otp: 'Invalid code' }))
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Forgot Password</CardTitle>
                    <CardDescription>Reset your password</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    {!$isLoggedIn && <>
                        <Label>Username</Label>
                        <UsernameInput
                            formState={formState}
                            setFormState={setFormState}
                            onChange={handleInputChange}
                            type="text"
                            name="username"
                            value={formState.username} />
                    </>}
                    <Label>New Password</Label>
                    <PasswordInput
                        formState={formState}
                        setFormState={setFormState}
                        name="password"
                        value={formState.password}
                        onChange={handleInputChange} />
                    <Label>Confirm Password</Label>
                    <PasswordInput
                        formState={formState}
                        setFormState={setFormState}
                        name="confirmPassword"
                        value={formState.confirmPassword}
                        onChange={handleInputChange} />
                </CardContent>
                <CardFooter>
                    <Button className="ml-auto" onClick={handleSubmit}>Submit</Button>
                </CardFooter>
            </Card>
            {show2FA &&
                <div className="h-full w-full absolute z-[99] top-0 flex items-center justify-center" role="overlay">
                    <Card className="z-[2]">
                        <CardHeader>
                            <CardTitle>Two-Factor Authentication</CardTitle>
                            <CardDescription>Enter the 6-digit code from Google Authenticator</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Input onChange={(e) => {
                                setOTP(e.target.value)
                            }} />
                            {errors.otp && <div className="text-sm text-destructive absolute mt-2">{otp}</div>}
                        </CardContent>
                        <CardFooter>
                            <Button className="ml-auto" onClick={handle2FASubmit}>Submit</Button>
                        </CardFooter>
                    </Card>
                    <div className="h-full w-full absolute bg-black opacity-40" onClick={() => setShow2FA(prev => !prev)}>

                    </div>
                </div>
            }
        </>
    )
}

export default ForgotPasswordPage
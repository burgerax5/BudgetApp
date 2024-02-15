import React, { useState, useEffect } from 'react'
import { Input } from './ui/input';
import { PasswordInput } from './ui/password-input';
import { Button } from './ui/button';
import axios from '@/api/axios';
import { useStore } from '@nanostores/react';
import { isLoggedIn } from '@/store/userStore';
import { UsernameInput } from './ui/username-input';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

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

const initialFormState: RegistrationFormState = {
    username: '',
    password: '',
    otp: '',
    errors: {
        username: '',
        password: '',
        otp: ''
    },
};

function LoginForm() {
    const [formState, setFormState] = useState<RegistrationFormState>(initialFormState)
    const [userExists, setUserExists] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [submitted, setSubmitted] = useState(false)
    const [show2FA, setShow2FA] = useState<boolean>(false)
    const $isLoggedIn = useStore(isLoggedIn)

    useEffect(() => {
        checkUserExists(formState.username)
    }, [formState])

    useEffect(() => {
        console.log($isLoggedIn)
    }, [$isLoggedIn])

    const validateForm = () => {
        const errors = {
            username: formState.username.trim() === '' ? 'Username is required' : '',
            password: formState.password.length < 6 ? 'Password is required' : '',
            otp: ''
        };

        setFormState((prev) => ({ ...prev, errors }));
        return Object.values(errors).every((error) => error === '');
    };

    const checkUserExists = async (username: string) => {
        try {
            const res = await axios.get(`/auth/users/${username}`)
            if (res.status !== 200)
                throw new Error(`Network response was not ok: ${res.status}`)

            const data = await res.data

            // Check if the user exists
            if (data.user_exists) {
                setError(null)
                setUserExists(true)
            } else {
                setUserExists(false)
            }
        } catch (err) {
            if (err instanceof Error)
                setError(err.message || 'An error occurred')
            console.log('There was a problem with the fetch operation:', err)
        }
    }

    const loginUser = async (userData: {
        username: string,
        password: string
    }) => {
        const { username, password } = userData
        if (userExists)
            try {
                const res = await axios.post('/auth/verify-credentials', { username, password })
                if (res.status === 400)
                    setError('Username or password is incorrect')
                else
                    await axios.post('/auth/login', { username, password }, { withCredentials: true })
                        .then(res => {
                            if (res.data.username) {
                                isLoggedIn.set(true)
                                location.replace('/')
                            }
                        })
                        .catch(err => {
                            console.error('Error occurred while logging in with 2FA:', err)
                        })
            } catch (err) {
                setError('Username or password is incorrect')
            }
        else
            setError('Username or password is incorrect')
    }

    const verifyCredentials = async (userData: {
        username: string,
        password: string
    }) => {
        const { username, password } = userData
        if (userExists)
            try {
                const res = await axios.post<{
                    success: boolean,
                    requires2FA: boolean,
                    username: string
                }>
                    ('/auth/verify-credentials', { username, password })
                return res
            } catch (err) {
                setError('Username or password is incorrect')
                return null
            }
        else {
            setError('Username or password is incorrect')
            return null
        }
    }

    const verifyOTP = async (token: string, username: string) => {
        const res = await axios.post('/auth/verify-otp-guest', { token, username })
        return res.data.valid
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(true)
        if (validateForm()) {
            const formData = new FormData(e.currentTarget)
            const userData = {
                username: formData.get('username') as string,
                password: formData.get('password') as string
            }

            await checkUserExists(userData.username)
            const res = await verifyCredentials(userData)

            console.log(res?.data.success)

            if (res && res.data.success && !res.data.requires2FA)
                await loginUser(userData)
            else if (res && res.data.success && res.data.requires2FA)
                setShow2FA(true)
            else {
                setError('Username or password is incorrect.')
            }
        }
    };

    const handle2FASubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()

        if (!formState?.otp) return

        const valid = await verifyOTP(formState.otp, formState.username)

        if (valid) {
            console.log("LOGGED IN!")
            await loginUser({
                username: formState.username,
                password: formState.password
            })
        }
        else {
            setFormState(prevState => ({
                ...prevState, errors: {
                    ...formState.errors,
                    otp: 'Invalid code'
                }
            }))
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    return (
        <>
            <form className="w-full flex flex-col gap-3 sm:min-w-64 !" onSubmit={handleSubmit}>
                {submitted && (!formState.username || !formState.password) &&
                    <span>Please fill in all fields</span>}
                <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="username">
                        Username:
                    </label>
                    <UsernameInput
                        formState={formState}
                        setFormState={setFormState}
                        onChange={handleChange}
                        type="text"
                        name="username"
                        value={formState.username} />
                    {formState.errors.username && <span className="text-sm text-destructive">{formState.errors.username}</span>}
                </div>
                <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="password">
                        Password:
                    </label>
                    <PasswordInput
                        formState={formState}
                        setFormState={setFormState}
                        name="password"
                        value={formState.password}
                        onChange={handleChange}
                    />
                    {formState.errors.password && <span className="text-sm">{formState.errors.password}</span>}
                </div>
                {submitted && error && <span className="text-sm text-destructive">{error}</span>}
                <Button
                    disabled={!formState.password.length || !formState.username.length}
                    type="submit"
                >Sign In</Button>
            </form>
            {show2FA &&
                <div className="h-full w-full absolute z-[99] top-0 flex items-center justify-center" role="overlay">
                    <Card className="z-[2]">
                        <CardHeader>
                            <CardTitle>Two-Factor Authentication</CardTitle>
                            <CardDescription>Enter the 6-digit code from Google Authenticator</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Input onChange={(e) => {
                                setFormState(prev => ({ ...prev, otp: e.target.value }))
                            }} />
                            {formState.errors.otp && <div className="text-sm text-destructive absolute mt-2">{formState.errors.otp}</div>}
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

export default LoginForm
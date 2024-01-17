import React, { useState, useEffect } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

interface RegistrationFormState {
    username: string;
    password: string;
    confirmPassword: string;
    errors: {
        username: string;
        password: string;
        confirmPassword: string;
    };
}

const initialFormState: RegistrationFormState = {
    username: '',
    password: '',
    confirmPassword: '',
    errors: {
        username: '',
        password: '',
        confirmPassword: '',
    },
};


function RegisterForm() {
    const [formState, setFormState] = useState<RegistrationFormState>(initialFormState)
    const [data, setData] = useState<{ user_exists: boolean } | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        checkUserExists(formState.username)
    }, [formState])

    const validateForm = () => {
        const errors = {
            username: formState.username.trim() === '' ? 'Username is required' : '',
            password: formState.password.length < 6 ? 'Password must be at least 6 characters' : '',
            confirmPassword:
                formState.password === formState.confirmPassword
                    ? ''
                    : 'Passwords do not match',
        };

        setFormState((prev) => ({ ...prev, errors }));
        return Object.values(errors).every((error) => error === '');
    };

    const checkUserExists = async (username: string) => {
        const backendUrl = 'http://localhost:8080/auth/users/'

        try {
            const res = await fetch(backendUrl + username)
            if (!res.ok)
                throw new Error(`Network response was not ok: ${res.status}`)

            const data = await res.json()

            // Check if the username is taken
            if (data.user_exists)
                setError('Username is already taken.')
            else {
                // Username is available
                setError(null)
                setData(data)
            }
        } catch (err) {
            if (err instanceof Error)
                setError(err.message || 'An error occurred')
            console.log('There was a problem with the fetch operation:', err)
        }
    }

    const registerUser = async (backendUrl: string, userData: {
        username: string,
        password: string
    }) => {
        if (!data?.user_exists)
            fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
                .then(res => {
                    if (res.status === 400)
                        throw new Error(`Username is already taken`)
                    return res
                })
                .then(data => {
                    console.log(data)
                    location.replace('/login')
                })
                .catch(err => {
                    console.log('There was a problem with the fetch operation:', err)
                })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm() && !error) {
            const backendUrl = 'http://localhost:8080/auth/register'
            const formData = new FormData(e.currentTarget)
            const userData = {
                username: formData.get('username') as string,
                password: formData.get('password') as string
            }

            await checkUserExists(userData.username)
            await registerUser(backendUrl, userData)
        } else {
            console.log('Form has errors. Cannot submit.');
        }
    };

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
        <form className="w-96 p-3 flex flex-col gap-3" onSubmit={handleSubmit}>
            <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="username">
                    Username:
                </label>
                <Input
                    type="text"
                    name="username"
                    value={formState.username}
                    onChange={handleChange}
                />
                {error && <span className="text-sm">{error}</span>}
                {formState.errors.username && <span className="text-sm">{formState.errors.username}</span>}
            </div>
            <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="password">
                    Password:
                </label>
                <Input
                    type="password"
                    name="password"
                    value={formState.password}
                    onChange={handleChange}
                />
                {formState.errors.password && <span className="text-sm">{formState.errors.password}</span>}
            </div>
            <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="confirmPassword">
                    Confirm Password:
                </label>
                <Input
                    type="password"
                    name="confirmPassword"
                    value={formState.confirmPassword}
                    onChange={handleChange}
                />
                {formState.errors.confirmPassword && (
                    <span className="text-sm">{formState.errors.confirmPassword}</span>
                )}
            </div>
            <Button type="submit">Register</Button>
        </form>
    )
}

export default RegisterForm
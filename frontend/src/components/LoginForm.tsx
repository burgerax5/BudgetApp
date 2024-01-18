import React, { useState, useEffect } from 'react'
import { Input } from './ui/input';
import { PasswordInput } from './ui/password-input';
import { Button } from './ui/button';
import axios from '@/api/axios';

interface RegistrationFormState {
    username: string;
    password: string;
    errors: {
        username: string;
        password: string;
    };
}

const initialFormState: RegistrationFormState = {
    username: '',
    password: '',
    errors: {
        username: '',
        password: '',
    },
};

function LoginForm() {
    const [formState, setFormState] = useState<RegistrationFormState>(initialFormState)
    const [userExists, setUserExists] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        checkUserExists(formState.username)
    }, [formState])

    const validateForm = () => {
        const errors = {
            username: formState.username.trim() === '' ? 'Username is required' : '',
            password: formState.password.length < 6 ? 'Password is required' : ''
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
                const res = await axios.post('/auth/login', { username, password }, { withCredentials: true })
                if (res.status === 400)
                    setError('Username or password is incorrect')
                if (res.data.username)
                    location.replace('/')
            } catch (err) {
                setError('Username or password is incorrect')
            }
        else
            setError('Username or password is incorrect')
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
            await loginUser(userData)
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
            {submitted && (!formState.username || !formState.password) &&
                <span>Please fill in all fields</span>}
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
                {formState.errors.username && <span className="text-sm">{formState.errors.username}</span>}
            </div>
            <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="password">
                    Password:
                </label>
                <PasswordInput
                    name="password"
                    value={formState.password}
                    onChange={handleChange}
                />
                {formState.errors.password && <span className="text-sm">{formState.errors.password}</span>}
            </div>
            {submitted && error && <span className="text-sm">{error}</span>}
            <Button type="submit">Sign In</Button>
        </form>
    )
}

export default LoginForm
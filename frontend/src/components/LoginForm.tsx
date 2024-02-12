import React, { useState, useEffect } from 'react'
import { Input } from './ui/input';
import { PasswordInput } from './ui/password-input';
import { Button } from './ui/button';
import axios from '@/api/axios';
import { useStore } from '@nanostores/react';
import { isLoggedIn } from '@/store/userStore';
import { UsernameInput } from './ui/username-input';

interface RegistrationFormState {
    email: string;
    password: string;
    errors: {
        email: string;
        password: string;
    };
}

const initialFormState: RegistrationFormState = {
    email: '',
    password: '',
    errors: {
        email: '',
        password: '',
    },
};

function LoginForm() {
    const [formState, setFormState] = useState<RegistrationFormState>(initialFormState)
    const [userExists, setUserExists] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [submitted, setSubmitted] = useState(false)
    const $isLoggedIn = useStore(isLoggedIn)

    useEffect(() => {
        checkUserExists(formState.email)
    }, [formState])

    const validateForm = () => {
        const errors = {
            email: formState.email.trim() === '' ? 'Email is required' : '',
            password: formState.password.length < 6 ? 'Password is required' : ''
        };

        setFormState((prev) => ({ ...prev, errors }));
        return Object.values(errors).every((error) => error === '');
    };

    const checkUserExists = async (email: string) => {
        try {
            const res = await axios.get(`/auth/users/${email}`)
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
        email: string,
        password: string
    }) => {
        const { email, password } = userData
        if (userExists)
            try {
                const res = await axios.post('/auth/login', { email, password }, { withCredentials: true })
                if (res.status === 400)
                    setError('Email or password is incorrect')
                if (res.data.email) {
                    isLoggedIn.set(true)
                    location.replace('/')
                }
            } catch (err) {
                setError('Email or password is incorrect')
            }
        else
            setError('Email or password is incorrect')
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(true)
        if (validateForm()) {
            const formData = new FormData(e.currentTarget)
            const userData = {
                email: formData.get('email') as string,
                password: formData.get('password') as string
            }

            await checkUserExists(userData.email)
            await loginUser(userData)
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
        <form className="w-full flex flex-col gap-3 sm:min-w-64 !" onSubmit={handleSubmit}>
            {submitted && (!formState.email || !formState.password) &&
                <span>Please fill in all fields</span>}
            <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="email">
                    Email:
                </label>
                <UsernameInput
                    formState={formState}
                    setFormState={setFormState}
                    onChange={handleChange}
                    type="email"
                    name="email"
                    value={formState.email} />
                {formState.errors.email && <span className="text-sm">{formState.errors.email}</span>}
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
            {submitted && error && <span className="text-sm">{error}</span>}
            <Button
                disabled={!formState.password.length || !formState.email.length}
                type="submit"
            >Sign In</Button>
        </form>
    )
}

export default LoginForm
import React, { useState } from 'react'
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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            // Perform registration logic here
            console.log('Registration successful!');
            // You can send a request to the server or handle registration logic accordingly
            const backendUrl = 'http://localhost:8080/auth/register'
            const formData = new FormData(e.currentTarget)
            const userData = {
                username: formData.get('username') as string,
                password: formData.get('password') as string
            }

            fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
                .then(res => {
                    if (!res.ok)
                        throw new Error(`Network response was not ok: ${res.status}`)
                    return res.json()
                })
                .then(data => {
                    console.log(data)
                })
                .catch(err => {
                    console.log('There was a problem with the fetch operation:', err)
                })
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
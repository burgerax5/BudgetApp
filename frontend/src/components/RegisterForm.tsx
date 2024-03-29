import { useState, useEffect } from 'react'
import { PasswordInput } from './ui/password-input';
import { Button } from './ui/button'
import { UsernameInput } from './ui/username-input';
import axios from '@/api/axios';


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
    const [submitted, setSubmitted] = useState(false)

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
            await axios.post(backendUrl, userData)
                .then(res => {
                    if (res.status === 400)
                        throw new Error('Username is already taken')
                    location.replace('/login')
                })
                .catch(err => {
                    console.error('An error occurred while registering user:', err)
                })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(true)
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
        <form className="w-full flex flex-col gap-3" onSubmit={handleSubmit}>
            {submitted && (!formState.username || !formState.password || !formState.confirmPassword) &&
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
                    value={formState.username}
                />
                {error && <span className="text-sm text-destructive">{error}</span>}
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
                {formState.errors.password && <span className="text-sm text-destructive">{formState.errors.password}</span>}
            </div>
            <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="confirmPassword">
                    Confirm Password:
                </label>
                <PasswordInput
                    formState={formState}
                    setFormState={setFormState}
                    formMode={"Register"}
                    name="confirmPassword"
                    value={formState.confirmPassword}
                    onChange={handleChange}
                />
                {formState.errors.confirmPassword && (
                    <span className="text-sm text-destructive">{formState.errors.confirmPassword}</span>
                )}
            </div>
            <Button type="submit">Register</Button>
        </form>
    )
}

export default RegisterForm
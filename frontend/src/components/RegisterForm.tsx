import { useState, useEffect } from 'react'
import { Input } from './ui/input'
import { PasswordInput } from './ui/password-input';
import { Button } from './ui/button'
import { UsernameInput } from './ui/username-input';

interface RegistrationFormState {
    email: string;
    password: string;
    confirmPassword: string;
    errors: {
        email: string;
        password: string;
        confirmPassword: string;
    };
}

const initialFormState: RegistrationFormState = {
    email: '',
    password: '',
    confirmPassword: '',
    errors: {
        email: '',
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
        checkUserExists(formState.email)
    }, [formState])

    const validateForm = () => {
        const errors = {
            email: formState.email.trim() === '' ? 'Username is required' : '',
            password: formState.password.length < 6 ? 'Password must be at least 6 characters' : '',
            confirmPassword:
                formState.password === formState.confirmPassword
                    ? ''
                    : 'Passwords do not match',
        };

        setFormState((prev) => ({ ...prev, errors }));
        return Object.values(errors).every((error) => error === '');
    };

    const checkUserExists = async (email: string) => {
        const backendUrl = 'http://localhost:8080/auth/users/'

        try {
            const res = await fetch(backendUrl + email)
            if (!res.ok)
                throw new Error(`Network response was not ok: ${res.status}`)

            const data = await res.json()

            // Check if the email is taken
            if (data.user_exists)
                setError('Username is already taken.')
            else {
                // Email is available
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
        email: string,
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
        setSubmitted(true)
        if (validateForm() && !error) {
            const backendUrl = 'http://localhost:8080/auth/register'
            const formData = new FormData(e.currentTarget)
            const userData = {
                email: formData.get('email') as string,
                password: formData.get('password') as string
            }

            await checkUserExists(userData.email)
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
            {submitted && (!formState.email || !formState.password || !formState.confirmPassword) &&
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
                    value={formState.email}
                />
                {error && <span className="text-sm">{error}</span>}
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
                    <span className="text-sm">{formState.errors.confirmPassword}</span>
                )}
            </div>
            <Button type="submit">Register</Button>
        </form>
    )
}

export default RegisterForm
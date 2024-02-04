"use client"

import { forwardRef, useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { XCircle } from "lucide-react"

interface RegistrationFormState {
    username: string,
    password: string,
    confirmPassword?: string,
    errors: {
        username: string,
        password: string,
        confirmPassword?: string
    },
}

interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    formState: RegistrationFormState,
    setFormState: React.Dispatch<React.SetStateAction<RegistrationFormState>>,
    formMode?: string
}

const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
    ({ className, formState, setFormState, formMode, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false)
        const disabled = props.value === "" || props.value === undefined || props.disabled

        return (
            <div className="relative">
                <Input
                    type={showPassword ? "text" : "password"}
                    className={cn("hide-password-toggle pr-10", className)}
                    ref={ref}
                    {...props}
                />
                {formMode && formState.confirmPassword && <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-7 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setFormState(prevState => ({ ...prevState, confirmPassword: '' }))
                    }
                >
                    <XCircle className="h-4 w-4 cursor-pointer text-muted-foreground  hover:text-foreground" />
                </Button>}
                {!formMode && formState.password && <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-7 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setFormState(prevState => ({ ...prevState, password: '' }))
                    }
                >
                    <XCircle className="h-4 w-4 cursor-pointer text-muted-foreground  hover:text-foreground" />
                </Button>}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={disabled}
                >
                    {showPassword && !disabled ? (
                        <EyeIcon
                            className="h-4 w-4  hover:text-foreground"
                            aria-hidden="true"
                        />
                    ) : (
                        <EyeOffIcon
                            className="h-4 w-4  hover:text-foreground"
                            aria-hidden="true"
                        />
                    )}
                    <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                    </span>
                </Button>

                {/* hides browsers password toggles */}
                <style>{`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}</style>
            </div>
        )
    },
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
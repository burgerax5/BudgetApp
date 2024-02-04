import * as React from "react"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import { XCircle } from "lucide-react"

interface RegistrationFormState {
    username: string,
    password: string,
    errors: {
        username: string,
        password: string,
    },
}

interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    formState: RegistrationFormState,
    setFormState: React.Dispatch<React.SetStateAction<RegistrationFormState>>
}

const UsernameInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, formState, setFormState, ...props }, ref) => {
        return (
            <div className="relative">
                <input
                    type={type}
                    className={cn(
                        "flex z-0 h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {formState.username && <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setFormState(prevState => ({ ...prevState, username: '' }))}
                >
                    <XCircle className="h-4 w-4 cursor-pointer text-muted-foreground  hover:text-foreground" />
                </Button>}
            </div>
        )
    }
)

export { UsernameInput }

import { atom } from "nanostores";

interface Budget {
    id: number,
    userId: number,
    categoryId: number,
    amount: number,
    month: number,
    year: number
}

interface Expense {
    id: number,
    name: string,
    categoryId: number,
    amount: number,
    day: number,
    month: number,
    year: number
}

interface ExpenseFilters {
    search: string,
    category: string | null,
    date: {
        month: number | null,
        year: number,
        checked: boolean
    },
    maxPrice: number,
    sorting: {
        // Either "desc" or "asc"
        expense: string,
        category: string,
        date: string,
        amount: string
    }
}

interface keyNumber {
    [key: string]: number
}

export const defaultCategoryValue: keyNumber = {
    'Food & Drink': 0,
    'Entertainment': 0,
    "Transportation": 0,
    "Health": 0,
    "Education": 0,
    "Housing": 0,
    "Utilities": 0,
    "Insurance": 0,
    "Debt Repayment": 0,
    "Clothing": 0,
    "Miscellaneous": 0,
}

export const isLoggedIn = atom(false)
export const selectedDate = atom({ date: new Date(), yearOnly: false })
export const budgetByDate = atom<Budget | null>(null)
export const expenses = atom<Expense[]>([])
export const filteredExpenses = atom<Expense[]>([])
export const expenseFilters = atom<ExpenseFilters>({
    search: "",
    category: null,
    date: {
        month: null,
        year: new Date().getFullYear(),
        checked: false
    },
    maxPrice: 0,
    sorting: {
        expense: "desc",
        category: "desc",
        date: "desc",
        amount: "desc"
    }
})
export const expensesByCategory = atom(defaultCategoryValue)
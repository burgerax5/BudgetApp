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
    name: string,
    categoryId: number,
    amount: number,
    day: number,
    month: number,
    year: number
}

interface SelectedDate {
    date: Date,
    yearOnly: boolean
}

interface ExpenseFilters {
    search: string,
    category: string | null,
    dateRange: {
        startDate: Date | null,
        endDate: Date | null
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

export const isLoggedIn = atom(false)
export const selectedDate = atom({ date: new Date(), yearOnly: false })
export const budgetByDate = atom<Budget | null>(null)
export const expenses = atom<Expense[]>([])
export const expenseFilters = atom<ExpenseFilters>({
    search: "",
    category: null,
    dateRange: {
        startDate: null,
        endDate: null
    },
    maxPrice: 0,
    sorting: {
        expense: "desc",
        category: "desc",
        date: "desc",
        amount: "desc"
    }
})
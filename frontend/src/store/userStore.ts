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

export const isLoggedIn = atom(false)
export const selectedDate = atom({ date: new Date(), yearOnly: false })
export const budgetByDate = atom<Budget | null>(null)
export const expenses = atom<Expense[]>([])
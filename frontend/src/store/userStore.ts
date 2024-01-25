import { atom } from "nanostores";

interface Budget {
    id: number,
    userId: number,
    categoryId: number,
    amount: number,
    month: number,
    year: number
}

export const isLoggedIn = atom(false)
export const selectedDate = atom(new Date())
export const budgetByDate = atom<Budget | null>(null)
export const expenses = atom([])
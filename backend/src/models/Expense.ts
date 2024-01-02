import { Currency } from "./Currency"

export interface Expense {
    expense_id: number,
    user_id: number,
    category_id: number | undefined,
    currency: Currency
    amount: number,
    name: string,
    date: Date
}
import { Category } from "./Category"
import { Currency } from "./Currency"

export interface Expense {
    expense_id: number,
    user_id: number,
    category: Category,
    currency: Currency
    amount: number,
    name: string,
    date: Date
}
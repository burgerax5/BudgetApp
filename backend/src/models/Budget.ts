import { User } from "./User"
import { Category } from "./Category"

export interface Budget {
    budget_id: number,
    user: User,
    category: Category | undefined,
    amount: number,
    budget_month: number | undefined,
    budget_year: number
}
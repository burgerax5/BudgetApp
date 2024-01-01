export interface Budget {
    budget_id: number,
    user_id: number,
    category_id: number | undefined,
    amount: number,
    budget_month: number | undefined,
    budget_year: number
}
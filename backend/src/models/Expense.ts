export interface Expense {
    expense_id: number,
    user_id: number,
    category_id: number | undefined,
    amount: number,
    name: string,
    date: Date
}
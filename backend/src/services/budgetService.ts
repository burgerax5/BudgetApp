import { Budget } from "../models/Budget"
import { User } from "../models/User"
import { Category } from "../models/Category"

export class BudgetServices {
    private budgets: Budget[]
    private next_budget_id

    constructor() {
        this.budgets = []
        this.next_budget_id = 0
    }

    addMonthlyBudget(user: User, budget_details: {
        category: Category | undefined,
        amount: number,
        budget_month: number | undefined,
        budget_year: number
    }) {
        const new_budget: Budget = {
            budget_id: this.next_budget_id++,
            user,
            category,
            amount,
            budget_month,
            budget_year
        }

        this.budgets.push(new_budget)
    }
}


// import { Category } from "../models/Category";

// export class CategoryServices {
//     private categories: Category[]

//     constructor() {
//         this.categories = [
//             {category_id: 0, name: "Food & Drink", colour: "#f5b642"},
//             {category_id: 1, name: "Entertainment", colour: "#f54e42"},
//             {category_id: 2, name: "Transportation", colour: "#dd42f5"},
//             {category_id: 3, name: "Health", colour: "#54f542"},
//             {category_id: 4, name: "Groceries", colour: "#ba4111"},
//             {category_id: 5, name: "Education", colour: "#11bab2"},
//             {category_id: 6, name: "Housing", colour: "#ba115a"}
//         ]
//     }

//     public getAllCategories(): Category[] {
//         return this.categories
//     }

//     public getCategoryByName(category_name: string): Category | undefined {
//         return this.categories.find(category => category.name === category_name)
//     }
// }
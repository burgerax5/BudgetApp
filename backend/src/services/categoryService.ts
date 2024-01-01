import { Category } from "../models/Category";

export class CategoryServices {
    private categories: Category[]

    constructor() {
        this.categories = [
            {category_id: 0, name: "Food & Drink", colour: "#f5b642"},
            {category_id: 1, name: "Entertainment", colour: "#f54e42"},
            {category_id: 2, name: "Transportation", colour: "#dd42f5"},
            {category_id: 3, name: "Health", colour: "#54f542"},
            {category_id: 4, name: "Groceries", colour: "#ba4111"},
            {category_id: 5, name: "Education", colour: "#11bab2"},
            {category_id: 6, name: "Housing", colour: "#ba115a"}
        ]
    }

    public getAllCategories(): Category[] {
        return this.categories
    }

    public getCategoryByName(category_name: string): Category | undefined {
        return this.categories.find(category => category.name === category_name)
    }
}
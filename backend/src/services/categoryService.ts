import { PrismaClient, Category as PrismaCategory } from '@prisma/client'

interface Category extends PrismaCategory { }

export class CategoryService {
    private prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
        this.populate_categories()
    }

    async populate_categories() {
        const categories = [
            { name: "Food & Drink", colour: "#f5b642" },
            { name: "Entertainment", colour: "#f54e42" },
            { name: "Transportation", colour: "#dd42f5" },
            { name: "Health", colour: "#54f542" },
            { name: "Groceries", colour: "#ba4111" },
            { name: "Education", colour: "#11bab2" },
            { name: "Housing", colour: "#ba115a" }
        ]

        if (!await this.prisma.category.count())
            await this.prisma.category.createMany({
                data: categories
            })
    }

    public async getAllCategories(): Promise<Category[]> {
        return await this.prisma.category.findMany()
    }

    public async getCategoryByName(category_name: string): Promise<Category | null> {
        return await this.prisma.category.findFirst({
            where: {
                name: category_name
            }
        })
    }
}
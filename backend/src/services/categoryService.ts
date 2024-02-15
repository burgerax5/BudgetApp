import { PrismaClient, Category as PrismaCategory } from '@prisma/client'
import { categories } from '../constants/categories'

interface Category extends PrismaCategory { }

export class CategoryService {
    private prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
        this.populate_categories()
    }

    async populate_categories() {
        for (const category of categories) {
            try {
                await this.prisma.category.upsert({
                    where: { name: category.name },
                    update: {},
                    create: category
                })
            } catch (err) {
                console.error(`Error while upserting category ${category.name}`)
            }
        }
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

    public async getCategoryById(category_id: string): Promise<Category | null> {
        return await this.prisma.category.findUnique({
            where: {
                id: category_id
            }
        })
    }
}
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

    public async getCategoryById(category_id: number): Promise<Category | null> {
        return await this.prisma.category.findUnique({
            where: {
                id: category_id
            }
        })
    }
}
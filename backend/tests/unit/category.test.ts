import { PrismaClient } from "@prisma/client";
import { CategoryService } from "../../src/services/categoryService";

describe('Test we initialize categories properly', () => {
    let prisma: PrismaClient
    let categoryService: CategoryService

    beforeAll(async () => {
        prisma = new PrismaClient()
        categoryService = new CategoryService(prisma)

        // Reset table and id after each test
        await prisma.category.deleteMany()
        await categoryService.populate_categories()
        await prisma.$executeRaw`SELECT setval('"Category_id_seq"', 1, false);`
    })

    it('should have 7 default categories', async () => {
        const allCategories = await categoryService.getAllCategories()
        const numCategories = allCategories.length
        expect(numCategories).toBe(7)
    })
})

describe('Test we can get the category object by the name', () => {
    let prisma: PrismaClient
    let categoryService: CategoryService

    beforeAll(async () => {
        prisma = new PrismaClient()
        categoryService = new CategoryService(prisma)

        // Reset table and id after each test
        await prisma.category.deleteMany()
        await categoryService.populate_categories()
        await prisma.$executeRaw`SELECT setval('"Category_id_seq"', 1, false);`
    })

    it('should return the category object of "Entertainment"', async () => {
        const entertainment = await categoryService.getCategoryByName('Entertainment')
        expect(entertainment).not.toBeNull()
        expect(entertainment?.name).toBe("Entertainment")
        expect(entertainment?.colour).toBe("#f54e42")
    })
})
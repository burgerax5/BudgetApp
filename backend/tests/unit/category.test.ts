import { PrismaClient } from "@prisma/client";
import { CategoryServices } from "../../src/services/categoryService";

describe('Test we initialize categories properly', () => {
    let prisma: PrismaClient
    let categoryServices: CategoryServices

    beforeAll(async () => {
        prisma = new PrismaClient()
        categoryServices = new CategoryServices(prisma)
    })

    it('should have 7 default categories', async () => {
        const allCategories = await categoryServices.getAllCategories()
        const numCategories = allCategories.length
        expect(numCategories).toBe(7)
    })
})

describe('Test we can get the category object by the name', () => {
    let prisma: PrismaClient
    let categoryServices: CategoryServices

    beforeAll(async () => {
        prisma = new PrismaClient()
        categoryServices = new CategoryServices(prisma)
    })

    it('should return the category object of "Entertainment"', async () => {
        const entertainment = await categoryServices.getCategoryByName('Entertainment')
        expect(entertainment).not.toBeNull()
        expect(entertainment?.name).toBe("Entertainment")
        expect(entertainment?.colour).toBe("#f54e42")
    })
})
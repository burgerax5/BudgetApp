import { PrismaClient } from "@prisma/client";
import { resetTables, cleanUp } from "../scripts/resetTables";
import { CategoryService } from "../../src/services/categoryService";
import { prisma } from "../../src/services/service_init";
import { categories } from "../../src/constants/categories";

describe('Test we can get the category object by the name and id', () => {
    let categoryService: CategoryService

    beforeAll(async () => {
        categoryService = new CategoryService(prisma)

        await resetTables(prisma)

        await prisma.category.createMany({
            data: categories
        })
    })

    // FLAKY
    it('should have 11 default categories', async () => {
        const allCategories = await categoryService.getAllCategories()
        const numCategories = allCategories.length
        expect(numCategories).toBe(11)
    })

    // FLAKY
    it('should return the category with the name "Entertainment"', async () => {
        const entertainment = await categoryService.getCategoryByName('Entertainment')
        expect(entertainment?.name).toBe("Entertainment")
    })

    it('should return the "Food & Drink" category since it has id of 1', async () => {
        const category = await categoryService.getCategoryById(1)
        expect(category?.name).toBe("Food & Drink")
    })

    afterAll(async () => cleanUp(prisma))
})
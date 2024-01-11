import { PrismaClient } from "@prisma/client";
import { resetTables, cleanUp } from "../scripts/resetTables";
import { CategoryService } from "../../src/services/categoryService";
import { prisma } from "../../src/services/service_init";

describe('Test we initialize categories properly', () => {
    let categoryService: CategoryService

    beforeEach(async () => {
        categoryService = new CategoryService(prisma)

        await resetTables(prisma)
        await categoryService.populate_categories()
    })

    it('should have 7 default categories', async () => {
        const allCategories = await categoryService.getAllCategories()
        const numCategories = allCategories.length
        expect(numCategories).toBe(7)
    })

    afterEach(async () => cleanUp(prisma))
})

describe('Test we can get the category object by the name and id', () => {
    let categoryService: CategoryService

    beforeEach(async () => {
        categoryService = new CategoryService(prisma)

        await resetTables(prisma)
        await categoryService.populate_categories()
    })

    it('should return the category object of "Entertainment"', async () => {
        const entertainment = await categoryService.getCategoryByName('Entertainment')
        expect(entertainment?.name).toBe("Entertainment")
        expect(entertainment?.colour).toBe("#f54e42")
    })

    it('should return the Food & Drink category', async () => {
        const category = await categoryService.getCategoryById(1)
        expect(category?.name).toBe("Food & Drink")
    })

    afterEach(async () => cleanUp(prisma))
})
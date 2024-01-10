import { PrismaClient } from "@prisma/client";
import { CurrencyService } from "../../src/services/currencyService";

describe('Test we initialize currencies properly', () => {
    let prisma: PrismaClient
    let categoryService: CurrencyService

    beforeAll(async () => {
        prisma = new PrismaClient()
        categoryService = new CurrencyService(prisma)

        // Reset table and id after each test
        await prisma.currency.deleteMany()
        await categoryService.getAllCurrencies()
        await categoryService.populate_currencies()
        await prisma.$executeRaw`SELECT setval('"Category_id_seq"', 1, false);`
    })

    it('should have 156 different currencies', async () => {
        const allCurrencies = await categoryService.getAllCurrencies()
        const numCurrencies = allCurrencies.length
        expect(numCurrencies).toBe(156)
    })
})

describe('Test we can get the category object by the name', () => {
    let prisma: PrismaClient
    let categoryService: CurrencyService

    beforeAll(async () => {
        prisma = new PrismaClient()
        categoryService = new CurrencyService(prisma)

        // Reset table and id after each test
        await prisma.currency.deleteMany()
        await categoryService.getAllCurrencies()
        await categoryService.populate_currencies()
        await prisma.$executeRaw`SELECT setval('"Category_id_seq"', 1, false);`
    })

    it('should return NZD', async () => {
        const currency = await categoryService.getCategoryByCode('NZD')
        expect(currency).not.toBeNull()
        expect(currency?.name).toBe("New Zealand dollar")
        expect(currency?.cc).toBe("NZD")
    })
})
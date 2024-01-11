import { PrismaClient } from "@prisma/client";
import { CurrencyService } from "../../src/services/currencyService";
import { resetTables, cleanUp } from '../scripts/resetTables'

describe('Test we initialize currencies properly', () => {
    let prisma: PrismaClient
    let currencyService: CurrencyService

    beforeAll(async () => {
        prisma = new PrismaClient()
        currencyService = new CurrencyService(prisma)

        // Reset table and id after each test
        await resetTables(prisma)
        await currencyService.populate_currencies()
    })

    it('should have 156 different currencies', async () => {
        const allCurrencies = await currencyService.getAllCurrencies()
        const numCurrencies = allCurrencies.length
        expect(numCurrencies).toBe(156)
    })

    afterAll(async () => cleanUp(prisma))
})

describe('Test we can get the currency by the name', () => {
    let prisma: PrismaClient
    let currencyService: CurrencyService

    beforeAll(async () => {
        prisma = new PrismaClient()
        currencyService = new CurrencyService(prisma)

        // Reset table and id after each test
        await resetTables(prisma)
        await currencyService.populate_currencies()
    })

    it('should return NZD', async () => {
        const currency = await currencyService.getCategoryByCode('NZD')
        expect(currency).not.toBeNull()
        expect(currency?.name).toBe("New Zealand dollar")
        expect(currency?.cc).toBe("NZD")
    })

    afterAll(async () => cleanUp(prisma))
})
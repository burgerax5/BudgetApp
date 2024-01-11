import { PrismaClient } from "@prisma/client";
import { CurrencyService } from "../../src/services/currencyService";
import { resetTables, cleanUp } from '../scripts/resetTables'
import { prisma } from "../../src/services/service_init";

describe('Test we initialize currencies properly', () => {
    let currencyService: CurrencyService

    beforeAll(async () => {
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

    afterEach(async () => cleanUp(prisma))
})

describe('Test we can get the currency by the code and id', () => {
    let currencyService: CurrencyService

    beforeAll(async () => {
        currencyService = new CurrencyService(prisma)

        // Reset table and id after each test
        await resetTables(prisma)
        await currencyService.populate_currencies()
    })

    it('should take in a currency code and return the currency', async () => {
        const currency = await currencyService.getCurrencyByCode('NZD')
        expect(currency).not.toBeNull()
        expect(currency?.name).toBe("New Zealand dollar")
        expect(currency?.cc).toBe("NZD")
    })

    it('should return the NZ currency with the id 106', async () => {
        const currency = await currencyService.getCurrencyById(106)
        expect(currency?.name).toBe("New Zealand dollar")
    })

    afterEach(async () => cleanUp(prisma))
})
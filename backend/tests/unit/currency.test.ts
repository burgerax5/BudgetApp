import { PrismaClient } from "@prisma/client";
import { CurrencyService } from "../../src/services/currencyService";
import { resetTables, cleanUp } from '../scripts/resetTables'
import { prisma } from "../../src/services/service_init";

import { currencies as Currencies } from '../../src/constants/currencies'

describe('Test initialization and querying of currencies', () => {
    let currencyService: CurrencyService

    beforeAll(async () => {
        currencyService = new CurrencyService(prisma)

        // Reset table and id after each test
        await prisma.$transaction([
            prisma.currency.deleteMany(),
            prisma.$executeRaw`SELECT setval('"Currency_id_seq"', 1, false)`,
            prisma.currency.createMany({
                data: Currencies,
                skipDuplicates: true
            }),
        ]);
    })

    // FLAKY
    it('should have 156 different currencies', async () => {
        const allCurrencies = await currencyService.getAllCurrencies()
        const numCurrencies = allCurrencies.length
        expect(numCurrencies).toBe(156)
    })

    // FLAKY
    it('should take in a currency code and return the currency', async () => {
        const currency = await currencyService.getCurrencyByCode('NZD')
        expect(currency).not.toBeNull()
        expect(currency?.name).toBe("New Zealand dollar")
        expect(currency?.cc).toBe("NZD")
    })

    // FLAKY
    it('should return the NZ currency with the id 106', async () => {
        const currency = await currencyService.getCurrencyById(106)
        expect(currency?.name).toBe("New Zealand dollar")
    })

    afterAll(async () => await cleanUp(prisma))
})
import { PrismaClient, Currency as PrismaCurrency } from '@prisma/client'
import { currencies as Currencies } from '../constants/currencies'

interface Currency extends PrismaCurrency { }

export class CurrencyService {
    private prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }

    async populate_currencies() {
        const currencies = Currencies

        if (await this.prisma.currency.count() === 0)
            await this.prisma.currency.createMany({
                data: currencies
            })
    }

    public async getAllCurrencies(): Promise<Currency[]> {
        return await this.prisma.currency.findMany()
    }

    public async getCategoryByCode(code: string): Promise<Currency | null> {
        return await this.prisma.currency.findUnique({
            where: {
                cc: code
            }
        })
    }
}
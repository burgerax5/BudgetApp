import { PrismaClient, Currency as PrismaCurrency } from '@prisma/client'
import { currencies as Currencies } from '../constants/currencies'
interface Currency extends PrismaCurrency { }

export class CurrencyService {
    private prisma: PrismaClient
    private isPopulating: boolean = false

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }

    async populate_currencies() {
        const currencies = Currencies;

        if (await this.prisma.currency.count() === 0 && currencies.length === 156)
            this.prisma.currency.createMany({
                data: currencies,
                skipDuplicates: true
            })
    }

    public async getAllCurrencies(): Promise<Currency[]> {
        return await this.prisma.currency.findMany()
    }

    public async getCurrencyByCode(code: string): Promise<Currency | null> {
        return await this.prisma.currency.findUnique({ where: { cc: code } })
    }

    public async getCurrencyById(id: number): Promise<Currency | null> {
        return await this.prisma.currency.findUnique({ where: { id } })
    }
}
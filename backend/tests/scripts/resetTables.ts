import { PrismaClient } from "@prisma/client";

export async function resetTables(prisma: PrismaClient) {
    // Reset table and id after each test
    await prisma.$transaction([
        prisma.expense.deleteMany(),
        prisma.budget.deleteMany(),
        prisma.user.deleteMany(),
        prisma.category.deleteMany(),
        prisma.currency.deleteMany(),
        prisma.$executeRaw`SELECT setval('"Expense_id_seq"', 1, false)`,
        prisma.$executeRaw`SELECT setval('"Budget_id_seq"', 1, false)`,
        prisma.$executeRaw`SELECT setval('"User_id_seq"', 1, false)`,
        prisma.$executeRaw`SELECT setval('"Category_id_seq"', 1, false)`,
        prisma.$executeRaw`SELECT setval('"Currency_id_seq"', 1, false)`
    ]);
}

export async function cleanUp(prisma: PrismaClient) {
    await resetTables(prisma)
    await prisma.$disconnect()
}
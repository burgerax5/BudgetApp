import { PrismaClient } from "@prisma/client";

export async function resetTables(prisma: PrismaClient) {
    try {
        // Reset table and id after each test
        await prisma.$transaction([
            prisma.expense.deleteMany(),
            prisma.budget.deleteMany(),
            prisma.user.deleteMany(),
            prisma.category.deleteMany(),
            prisma.$executeRaw`SELECT setval('"Expense_id_seq"', 1, false)`,
            prisma.$executeRaw`SELECT setval('"Budget_id_seq"', 1, false)`,
            prisma.$executeRaw`SELECT setval('"User_id_seq"', 1, false)`,
            prisma.$executeRaw`SELECT setval('"Category_id_seq"', 1, false)`,
        ]);
    } catch (error) {
        if (error instanceof Error && error.message.includes('deadlock detected')) {
            console.log("Retrying after a short delay...")
            await new Promise((resolve) => setTimeout(resolve, 1000))
            await resetTables(prisma) // Retry the operation
        } else {
            throw error
        }
    }
}

export async function cleanUp(prisma: PrismaClient) {
    await resetTables(prisma)
    await prisma.$disconnect()
}
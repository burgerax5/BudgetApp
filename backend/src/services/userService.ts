import bcrypt from 'bcrypt';
import { PrismaClient, User as PrismaUser } from '@prisma/client'

interface User extends PrismaUser { }

export class UserService {
    refreshTokens: string[]
    private prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
        this.refreshTokens = []
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: {
                email: email,
            }
        })
    }

    public async getUserById(user_id: number): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: {
                id: user_id,
            }
        })
    }

    public async registerUser(email: string, password: string): Promise<User> {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        return this.prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        })
    }

    public async getAllUsers(): Promise<User[]> {
        return this.prisma.user.findMany()
    }
}
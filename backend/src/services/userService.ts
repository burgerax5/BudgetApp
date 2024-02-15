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

    public async getUserByUsername(username: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: {
                username: username,
            }
        })
    }

    public async getUserById(user_id: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: {
                id: user_id,
            }
        })
    }

    public async registerUser(username: string, password: string): Promise<User> {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        return this.prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        })
    }

    public async resetPassword(username: string, newPassword: string): Promise<User | null> {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        return this.prisma.user.update({
            where: {
                username: username
            },
            data: {
                password: hashedPassword
            }
        })
    }

    public async getAllUsers(): Promise<User[]> {
        return this.prisma.user.findMany()
    }

    public async addSecret(username: string, secret: string): Promise<User> {
        return this.prisma.user.update({
            where: {
                username: username
            },
            data: {
                secret: secret
            }
        })
    }

    public async getSecret(username: string): Promise<string | null> {
        const user = await this.prisma.user.findUnique({
            where: {
                username: username
            },
            select: {
                secret: true
            }
        })

        return user ? user.secret : null
    }
}
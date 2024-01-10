import bcrypt from 'bcrypt';
import { User as PrismaUser } from '@prisma/client'

interface User extends PrismaUser { }
import { prisma } from './service_init';

export class UserService {
    refreshTokens: string[]

    constructor() {
        this.refreshTokens = []
    }

    public async getUserByUsername(username: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: {
                username: username,
            }
        })
    }

    public async getUserById(user_id: number): Promise<User | null> {
        return await prisma.user.findUnique({
            where: {
                id: user_id,
            }
        })
    }

    public async registerUser(username: string, password: string): Promise<User> {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        return prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        })
    }

    public async getAllUsers(): Promise<User[]> {
        return prisma.user.findMany()
    }
}
import bcrypt from 'bcrypt';
import { UserService } from '../../src/services/userService';
import { jestRegister } from '../scripts/registerUser';
import { PrismaClient } from '@prisma/client';
import { resetTables, cleanUp } from '../scripts/resetTables';
import { prisma } from '../../src/services/service_init';

jest.mock('bcrypt');

describe('Get user by username or id', () => {
    let userService: UserService

    beforeEach(async () => {
        userService = new UserService(prisma)

        await resetTables(prisma)
    })

    it('should return null since user tom does not exist', async () => {
        const user = await userService.getUserByUsername('tom')
        expect(user).toBeNull()
    })

    it('should register "alice" then search and return the user "alice"', async () => {
        await jestRegister('alice', 'password123', userService)

        const newUser = await userService.getUserByUsername('alice')
        expect(newUser).not.toBeNull()
        expect(newUser?.username).toBe('alice')
    })

    it('should return null since there is no user with id 1', async () => {
        const user = await userService.getUserById(1)
        expect(user).toBeNull()
    })

    it('should return "alice" when looking for user with id of 1', async () => {
        await jestRegister('alice', 'password123', userService)
        const user = await userService.getUserById(1)

        expect(user).not.toBeNull()
        expect(user?.username).toBe("alice")
    })

    afterEach(async () => await cleanUp(prisma))
})

describe('registerUser', () => {
    let userService: UserService

    beforeEach(async () => {
        userService = new UserService(prisma)

        await resetTables(prisma)
    })

    it('should register alice as a new user', async () => {
        await jestRegister('alice', 'password123', userService)

        const newUser = await userService.getUserByUsername('alice')
        expect(newUser?.id).toBe(1)
        expect(newUser?.username).toBe('alice')

        const allUsers = await userService.getAllUsers()
        expect(allUsers.length).toBe(1)

        expect(bcrypt.genSalt).toHaveBeenCalledWith(10)
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'mockedSalt')
    })

    afterEach(async () => await cleanUp(prisma))
})

describe('getAllUsers', () => {
    let userService: UserService

    beforeEach(async () => {
        userService = new UserService(prisma)

        await resetTables(prisma)
    })

    it('should return 0 users', async () => {
        const allUsers = await userService.getAllUsers()
        expect(allUsers.length).toBe(0)
    })

    it('should return alice and bob in the list of users', async () => {
        await jestRegister('alice', 'password123', userService)
        await jestRegister('bob', 'password123', userService)

        const allUsers = await userService.getAllUsers()
        expect(allUsers.length).toBe(2)

        expect(allUsers[0]?.username).toBe('alice')
        expect(allUsers[1]?.username).toBe('bob')
    })

    afterAll(async () => await cleanUp(prisma))
})
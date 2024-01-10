import bcrypt from 'bcrypt';
import { UserService } from '../../src/services/userService';
import { User } from '../../src/models/User';
import { jestRegister } from '../registerUser.js';

jest.mock('bcrypt');

describe('Get user by username or id', () => {
    let userService: UserService

    beforeEach(() => {
        userService = new UserService()
    })

    it('should return undefined since user bob does not exist', async () => {
        const user = await userService.getUserByUsername('bob')
        expect(user).toBeNull()
    })

    it('should register "alice" then search and return the user "alice"', async () => {
        await jestRegister('alice', 'password123', userService)

        const newUser = await userService.getUserByUsername('alice')
        expect(newUser).not.toBeNull()
        expect(newUser?.username).toBe('alice')
    })

    it('should return undefined since there is no user with id 0', async () => {
        const user = await userService.getUserById(0)
        expect(user).toBeNull()
    })

    it('should return "alice" when looking for user with id of 0', async () => {
        await jestRegister('alice', 'password123', userService)
        const user = await userService.getUserById(0)

        expect(user).not.toBeUndefined()
        expect(user?.username).toBe("alice")
    })
})

describe('registerUser', () => {
    let userService: UserService

    beforeEach(() => {
        userService = new UserService()
    })

    it('should register alice as a new user', async () => {
        await jestRegister('alice', 'password123', userService)

        const newUser = await userService.getUserByUsername('alice')
        expect(newUser).toEqual({ user_id: 0, username: 'alice', password: 'hashedPassword123' })

        const allUsers = await userService.getAllUsers()
        expect(allUsers.length).toBe(1)

        expect(bcrypt.genSalt).toHaveBeenCalledWith(10)
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'mockedSalt')
    })
})

describe('getAllUsers', async () => {
    let userService: UserService

    beforeEach(() => {
        userService = new UserService()
    })

    it('should return 0 users', async () => {
        const allUsers = await userService.getAllUsers()
        expect(allUsers.length).toBe(0)
    })

    it('should return bob as the user', async () => {
        await jestRegister('bob', 'password123', userService)
        const allUsers = await userService.getAllUsers()
        const user = allUsers[0]

        expect(user).toEqual({ user_id: 0, username: "bob", password: "hashedPassword123" })
    })
})
import bcrypt from 'bcrypt';
import { UserService } from '../../src/services/userService';
import { User } from '../../src/models/User';

jest.mock('bcrypt');

describe('Get user by username', () => {
    let userService: UserService

    beforeEach(() => {
        userService = new UserService()
    })

    it('it should return bob from the list of users', () => {
        const user = userService.getUserByUsername('bob')
        expect(user).toBe(userService.getAllUsers()[0])
    })
})

describe('registerUser', () => {
    let userService: UserService

    beforeEach(() => {
        userService = new UserService()
    })

    it('should register alice as a new user', async () => {
        const username = 'alice'
        const password = 'password123'

        // Mocking bcrypt.genSalt and bcrypt.hash
        jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('mockedSalt' as never);
        jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword123' as never);

        await userService.registerUser(username, password)
        const newUser = userService.getUserByUsername('alice')
        expect(userService.getAllUsers().length).toBe(2)
        expect(newUser).toEqual({ username, password: 'hashedPassword123' })
    })
})

describe('getAllUsers', () => {
    let userService: UserService

    beforeEach(() => {
        userService = new UserService()
    })

    it('should return 1 user', () => {
        expect(userService.getAllUsers().length).toBe(1)
    })

    it('should return bob as the user', () => {
        expect(userService.getAllUsers()[0]).toEqual({ username: "bob", password: "hashedBobPassword" })
    })
})
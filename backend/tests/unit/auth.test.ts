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

    it('should return undefined since user bob doesn\'t exist', () => {
        const user = userService.getUserByUsername('bob')
        expect(user).toBe(undefined)
    })

    it('should register "alice" then search and return the user "alice"', async () => {
        await jestRegister('alice', 'password123', userService)
 
        const newUser = userService.getUserByUsername('alice')
        expect(newUser).not.toBeUndefined()
        expect(newUser?.username).toBe('alice')
    })

    it('should return undefined since there is no user with id 0', () => {
        const user = userService.getUserById(0)
        expect(user).toBe(undefined)
    })

    it('should return "alice" when looking for user with id of 0', async () => {
        await jestRegister('alice', 'password123', userService)
        const user = userService.getUserById(0)

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
        
        const newUser = userService.getUserByUsername('alice')
        expect(userService.getAllUsers().length).toBe(1)
        expect(newUser).toEqual({ user_id: 0, username: 'alice', password: 'hashedPassword123' })

        expect(bcrypt.genSalt).toHaveBeenCalledWith(10)
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'mockedSalt')
    })
})

describe('getAllUsers', () => {
    let userService: UserService

    beforeEach(() => {
        userService = new UserService()
    })

    it('should return 0 users', () => {
        expect(userService.getAllUsers().length).toBe(0)
    })

    it('should return bob as the user', async () => {
        await jestRegister('bob', 'password123', userService)
        const user = userService.getAllUsers()[0]
        expect(user).toEqual({ user_id: 0, username: "bob", password: "hashedPassword123" })
    })
})
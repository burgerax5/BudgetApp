import { UserService } from "../../src/services/userService";
import bcrypt from 'bcrypt'

export async function jestRegister(username: string, password: string, userService: UserService): Promise<void> {
    // Mocking bcrypt.genSalt and bcrypt.hash
    jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('mockedSalt' as never);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword123' as never);
    await userService.registerUser(username, password)
}
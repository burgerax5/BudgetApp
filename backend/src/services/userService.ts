import bcrypt from 'bcrypt';

import { User } from '../models/User';

export class UserService {
    private static users: User[] = [{ username: 'bob', password: 'hashedBobPassword' }];

    public static getUserByUsername(username: string): User | undefined {
        return UserService.users.find(user => user.username === username);
    }

    public static async registerUser(username: string, password: string): Promise<void> {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        UserService.users.push({ username, password: hashedPassword });
    }
}
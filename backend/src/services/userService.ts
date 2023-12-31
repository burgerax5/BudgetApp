import bcrypt from 'bcrypt';

import { User } from '../models/User';

export class UserService {
    private users: User[];

    constructor() {
        this.users = []
    }

    public getUserByUsername(username: string): User | undefined {
        return this.users.find(user => user.username === username);
    }

    public async registerUser(username: string, password: string): Promise<void> {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        this.users.push({ username, password: hashedPassword });
    }

    public getAllUsers(): User[] {
        return this.users
    }
}
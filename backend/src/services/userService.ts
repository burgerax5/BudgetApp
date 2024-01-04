import bcrypt from 'bcrypt';

import { User } from '../models/User';

export class UserService {
    private users: User[];
    private next_user_id: number

    constructor() {
        this.users = []
        this.next_user_id = 0
    }

    public getUserByUsername(username: string): User | undefined {
        return this.users.find(user => user.username === username);
    }

    public getUserById(user_id: number): User | undefined {
        return this.users.find(user => user.user_id === user_id)
    }

    public async registerUser(username: string, password: string): Promise<void> {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        this.users.push({ user_id: this.next_user_id++ , username, password: hashedPassword });
    }

    public getAllUsers(): User[] {
        return this.users
    }
}
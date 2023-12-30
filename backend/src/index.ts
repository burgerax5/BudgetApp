import express, { Express, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const app: Express = express()
const PORT:number = 8080

app.use(express.json())
app.use((req, res, next) => {
    console.log('Request Body: ', req.body)
    next()
})

type User = {
    username: string,
    password: string
}

let users: User[] = [
    { username: "bob", password: "bob" }
]

app.get('/', (req: Request, res: Response) => {
	res.status(200).send({
		text: "hi",
		id: 1
	})
})

app.post('/login', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            res.status(400).send('Missing fields. Please enter both username and password.')
            return
        }

        let user = getUserByUsername(username)
        if (!user) {
            res.status(401).send(`User not found`)
            return
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.log('Error during compare')
                res.status(500).send('Internal Server Error')
                return
            } 

            if (result) {
                res.send('Login Successful')
            } else {
                res.status(401).send('Invalid password')
            }
        })

        // const accessToken = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET)

    } catch (error) {
        console.error('Error during login')
        res.status(500).send('Internal Server Error')
    }
})

app.post('/register', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            res.status(400).send(`Missing fields. Please make sure you have entered all the necessary details. ${username} ${password}`)
            return
        }

        // Check if user already exists
        const userExists = users.some(user => user.username === username)
        if (userExists) {
            res.status(400).send(`The user ${username} already exists.`)
            return
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create user
        users.push({ username, password: hashedPassword })

        res.send(`Registered the user ${username} with the password ${hashedPassword}`)
    } catch (error) {
        console.error('Error during registration')
        res.status(500).send('Internal Server Error')
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

function getUserByUsername(username: string): User | undefined {
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) {
            return users[i]
        }
    } return undefined
}
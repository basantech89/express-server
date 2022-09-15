import dotenv from 'dotenv'
import { Client } from 'pg'

dotenv.config()

const dbClient = new Client(process.env.DB_URL)

export default dbClient

import { MongoClient } from "mongodb";
import {config} from 'dotenv'
config()

const client =  new MongoClient(process.env.MONGO) 
await client.connect()
export const db = client.db("agentsCollection")
import fs from 'fs'
import {User} from './models/user'
import mongoose from "mongoose"
import { resolve } from 'path'
import { rejects } from 'assert'


const connString = 'mongodb+srv://Olaf-Iskra-pab:Olaf-Iskra-pab@noteapi.srls2.mongodb.net/test'
mongoose.connect(connString)

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    notes: [],
    tags: []
})
const userCollection = mongoose.model('Users', userSchema)


interface DataStorage {
    readStorage() : Promise<String>  
    updateStorage(data: User[]) : Promise<void>
}

export class DatabaseStorage implements DataStorage {
    
    async readStorage(): Promise<String>{
        let data = await userCollection.find()
        return JSON.stringify(data)
    }
    async updateStorage(data: User[]): Promise<void> {
        await userCollection.deleteMany()
        await userCollection.insertMany(data)
    }
}

export class FileSystemStorage implements DataStorage {
    async readStorage(): Promise<string> {
        return await fs.promises.readFile('./data/users.json', 'utf-8');
    }
    async updateStorage(data : User[]): Promise<void> {
        try {
            await fs.promises.writeFile('./data/users.json', JSON.stringify(data, null, 2));
        } catch (err) {
            console.log(err)
        }
    }

}


import fs from 'fs'
import {User} from './models/user'
import mongoose from "mongoose"


const connString = 'mongodb+srv://Olaf-Iskra-pab:Olaf-Iskra-pab@noteapi.srls2.mongodb.net/test'


interface DataStorage {
    readStorage() : Promise<String>  
    updateStorage(data: User[]) : Promise<void>
}

class DatabaseStorage implements DataStorage {

    private db: mongoose.Connection
    
    constructor(db: mongoose.Connection){
        this.db = db
    }
    
    async readStorage(): Promise<String> {
        return new Promise(() => this.db.collection('users'))
    }
    async updateStorage(): Promise<void> {
        throw new Error("Method not implemented.")
    }

}

class FileSystemStorage implements DataStorage {
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

module.exports = FileSystemStorage, DatabaseStorage
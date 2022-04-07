import fs from 'fs'
import {User} from './models/user'
import {Note} from './models/note'
import {Tag} from './models/tag'

async function readStorage(path: string): Promise<string> {
    return await fs.promises.readFile(path, 'utf-8');
}

async function updateUserStorage(data : User[]): Promise<void> {
    try {
        await fs.promises.writeFile('./data/users.json', JSON.stringify(data, null, 2));
    } catch (err) {
        console.log(err)
    }
}


export {readStorage, updateUserStorage}


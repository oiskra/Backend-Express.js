import {Note} from './note'
import {Tag} from './tag'

export class User {
    login: string
    password: string
    notes: Note[]
    tags: Tag[]

    constructor(login: string, password: string, notes?: Note[], tags?: Tag[]) {
        this.login = login
        this.password = password
        this.notes = notes ?? []
        this.tags = tags ?? []
    }
}
import {Tag} from './tag'

export class Note {
    title : string
    content : string
    createDate? : string
    tags? : Tag[] 
    id? : number

    constructor(title: string, content: string, createDate?: string, tags?: Tag[]) {
        this.title = title
        this.content = content
        this.createDate = createDate ?? new Date().toISOString()
        this.tags = tags              
    }
}
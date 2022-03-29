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
        this.tags = tags        

        if(typeof createDate === 'undefined') {
            this.createDate = new Date().toISOString()
        }     
        else { 
            this.createDate = createDate
        }
           
    }
}
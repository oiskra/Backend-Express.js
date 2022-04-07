import {Tag} from './tag'

export class Note {
    title : string
    content : string
    visible : boolean
    createDate? : string
    tags? : Tag[] 
    id? : number

    constructor(title: string, content: string, visible: boolean = false, createDate?: string, tags?: Tag[]) {
        this.title = title
        this.content = content
        this.visible = visible
        this.createDate = createDate ?? new Date().toISOString()
        this.tags = tags              
    }
}
export class Note {
    title : string
    content : string
    createDate? : string
    tags? : string[] 
    id? : number

    constructor({ title, content, createDate, tags }: { title: string; content: string; createDate?: string; tags?: string[] }) {
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
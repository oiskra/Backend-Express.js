
export class Tag {
    id? : number
    name : string

    constructor(name: string) {       
        this.name = name
        this.id = Date.now()
    }

 }
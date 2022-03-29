import express from 'express'
import {Request, Response} from 'express'
import {Note} from './note'
import {Tag} from './tag'
import fs from 'fs'
 
async function readTagStorage(): Promise<string> {
    return await fs.promises.readFile('data/tags.json', 'utf-8');
}

async function readNoteStorage(): Promise<string> {
    return await fs.promises.readFile('data/notes.json', 'utf-8');
}

async function updateNoteStorage(data : Note[]): Promise<void> {
    try {
        await fs.promises.writeFile('./data/notes.json', JSON.stringify(data, null, 2))
    } catch (err) {
        console.log(err)
    }
}

async function updateTagStorage(data : Tag[]): Promise<void> {
    try {
        await fs.promises.writeFile('./data/tags.json', JSON.stringify(data, null, 2));
    } catch (err) {
        console.log(err)
    }
}

const app = express()
let notes : Note[] = []
let tags : Tag[] = []

app.use(express.json())

app.get('/notes', function (req: Request, res: Response) {
    readNoteStorage()
        .then(result => res.status(200).send(result))
        .catch(() => res.sendStatus(400))  
})

app.get('/note/:id', function (req: Request, res: Response) {   
    let noteId : number = +req.params.id
    readNoteStorage()
        .then(result => {
            notes = JSON.parse(result)
            let note : Note | undefined = notes.find(note => note.id === noteId)
            if(note !== undefined)
                res.status(200).send(note)
            else res.sendStatus(400)
        })
        .catch(() => res.sendStatus(400))        
})

app.post('/note', function (req: Request, res: Response) {
    try{
        let note : Note = new Note(req.body.title, req.body.content, req.body.createDate, req.body.tags)
        let tagArr : Tag[] = req.body.tags 
        note.id = Date.now()

        tagArr.forEach(tag => {
            if(!tags.some(el => tag.name === el.name)){
                let newTag = new Tag(tag.name.toLowerCase())
                tags.push(newTag)
            } else console.log('failed to add tag')
        }) 
        notes.push(note)              
 
        updateTagStorage(tags)
        updateNoteStorage(notes)      
        
        res.status(201).send(note.id.toString())
    }
    catch(err) {
        console.error(err);
        res.sendStatus(400)
    }
})

app.put('/note/:id', function (req : Request, res : Response) {
    let noteId : number = +req.params.id
    readNoteStorage()
        .then(result => {
            notes = JSON.parse(result)
            let noteIndex : number = notes.findIndex(note => note.id === noteId)
            if(noteIndex !== -1) {
                notes[noteIndex].content = req.body.content ?? notes[noteIndex].content
                notes[noteIndex].title = req.body.title ?? notes[noteIndex].title
                notes[noteIndex].createDate = req.body.createDate ?? notes[noteIndex].createDate
                notes[noteIndex].tags = req.body.tags ?? notes[noteIndex].tags 
                updateNoteStorage(notes)      
                res.sendStatus(204)
            } else {
                res.sendStatus(404)
            }    
        })
        .catch(() => res.sendStatus(404))
    
})

app.delete('/note/:id', function (req : Request, res : Response) {
    let noteId : number = +req.params.id
    readNoteStorage().then(result => notes = JSON.parse(result))
    if(notes.some(n => n.id === noteId)){
        let index : number = notes.findIndex(n => {n.id === noteId})
        notes.splice(index, 1)
        updateNoteStorage(notes)
        res.sendStatus(204)
    }
    else res.sendStatus(400)
})

app.get('/tags', function (req: Request, res: Response) {
    readTagStorage()
        .then(result => res.status(200).send(result))
        .catch(() => res.sendStatus(400))   
})

app.get('/tag/:id', (req: Request, res: Response) => {
    let tagId : number = +req.params.id
    
    readTagStorage()
    .then(result => {
        tags = JSON.parse(result)
        let tag : Tag | undefined = tags.find(tag => tag.id === tagId)
        if(tag !== undefined)
            res.status(200).send(tag)
        else res.sendStatus(400)
    })
    .catch(() => res.sendStatus(400))
})

app.post('/tag', (req: Request, res: Response) => {
    try{
        let tag : Tag = new Tag(req.body.name.toLowerCase())
        tags.push(tag)               
        updateTagStorage(tags)        
        res.status(201).send(tag.id!.toString())
    }
    catch(err) {
        console.error(err);
        res.sendStatus(400)
    }
})

app.put('/tag/:id', (req: Request, res: Response) => {
    let tagId : number = +req.params.id
    readTagStorage()
        .then(result => {
            tags = JSON.parse(result)
            let tagIndex : number = tags.findIndex(tag => tag.id === tagId)

            if(tagIndex !== -1) {               
                tags[tagIndex].name = req.body.name ?? tags[tagIndex].name
                tags[tagIndex].id = req.body.id ?? tags[tagIndex].id     
                updateTagStorage(tags)
                res.sendStatus(204)
            } else {
                res.sendStatus(404)
            }    
        })
        .catch(() => res.sendStatus(404))
})

app.delete('/tag/:id', (req: Request, res: Response) => {
    let tagId : number = +req.params.id
    readTagStorage().then(result => tags = JSON.parse(result))
    if(tags.some(t => t.id === tagId)){
        let index : number = tags.findIndex(n => {n.id === tagId})
        tags.splice(index, 1)
        updateTagStorage(tags)
        res.sendStatus(204)
    }
    else res.sendStatus(400)
})

app.listen(3001, () => console.log('server is running...'))
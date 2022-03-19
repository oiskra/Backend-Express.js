import express from 'express'
import {Request, Response} from 'express'
import { title } from 'process';
import { json } from 'stream/consumers';
import {Note} from './note'

const app = express()
const notes : Note[] = []

app.use(express.json())

app.get('/', function (req: Request, res: Response) {
    res.send("Hello world")
})

app.get('/note/:id', function (req: Request, res: Response) {   
    let noteId : number = +req.params.id
    let note : Note | undefined = notes.find(note => note.id === noteId)
    if(note !== undefined)
        res.status(200).send(note)
    else res.sendStatus(400)
})

app.post('/note', function (req: Request, res: Response) {
    console.log(req.body) 
    // e.x. req.body.title
    try{
        let object = req.body
        let note : Note = new Note({ title: object.title, content: object.content, createDate: object.createDate, tags: object.tags })
        note.id = Date.now()
        notes.push(note) 
        res.status(201).send(`${note.id.toString()}`)
    }
    catch (err) {
        res.sendStatus(400)
    }
})

app.put('/note/:id', function (req : Request, res : Response) {
    let noteId : number = +req.params.id
    let note : Note | undefined = notes.find(note => note.id === noteId)
    if(note !== undefined) {
        note.content = req.body.content !== undefined ? req.body.content : note.content
        note.title = req.body.title !== undefined ? req.body.title : note.title
        note.createDate = req.body.createDate !== undefined ? req.body.createDate : note.createDate
        note.tags = req.body.tags !== undefined ? req.body.tags : note.tags       
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }   
})

app.delete('/note/:id', function (req : Request, res : Response) {
    let noteId : number = +req.params.id
    if(notes.some(n => n.id === noteId)){
        let index : number = notes.findIndex(n => {n.id === noteId})
        notes.splice(index, 1)
        res.sendStatus(204)
    }
    else res.sendStatus(400)
})

app.listen(3001)
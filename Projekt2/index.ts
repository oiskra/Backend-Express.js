import express from 'express'
import {Request, Response, NextFunction} from 'express'
import {Note} from './models/note'
import {Tag} from './models/tag'
import {User} from './models/user'
import jwt from 'jsonwebtoken'
import {FileSystemStorage, DatabaseStorage} from './dataStorage'

const app = express()
let loggedUser : User
let notes: Note[] = []
let tags: Tag[] = []
let users: User[] = []
let storageOption: FileSystemStorage | DatabaseStorage 
let adminRole: boolean = false
let config = require('./myConfig.json')
const defineDataStorage = () => {
    config = JSON.stringify(config)
    if(config.includes('true')) 
        storageOption = new DatabaseStorage()
    else 
        storageOption = new FileSystemStorage()   
} 

const auth = (req : Request, res : Response, next : NextFunction) => {
    const token : string = req.headers.authorization?.split(' ')[1] ?? ''
    if(!token) return res.sendStatus(401)

    jwt.verify(token, 'secret', (err, data) => {
        if(err) {
            res.sendStatus(401)
            console.log(err)
            console.log(token)
        }
        
        const user: User = JSON.parse(JSON.stringify(data))
        console.log(user)
        storageOption.readStorage()
        .then(data => {
            users = JSON.parse(data.toString())          
            if(users.some(u => u.login == user.login && u.password == user.password)) {
                adminRole = user.login == 'admin'
                loggedUser = users.find(u => u.login == user.login && u.password == user.password) ?? user
                notes = loggedUser.notes
                tags = loggedUser.tags
                next()
            }
            else res.sendStatus(401)
        })
    })     
}

app.use(express.json())
defineDataStorage()

app.post('/login', (req : Request, res : Response) => { 
    if(req.body.login && req.body.password) {
        storageOption.readStorage().then((data) => {
            const tempArr : User[] = JSON.parse(data.toString())
            let someUser : boolean = tempArr.some(u => u.login == req.body.login && u.password == req.body.password) 
            if(someUser) res.sendStatus(401)
            else {
                const user = new User(req.body.login, req.body.password, req.body.notes, req.body.tags)
                const token = jwt.sign(JSON.stringify(user), 'secret')
                users.push(user)
                storageOption.updateStorage(users)
                res.status(200).send(token)
            }
        })        
    } else res.sendStatus(401)
})

app.get('/users', auth, (req : Request, res : Response) => {
    if(adminRole) res.send(users)
    else res.send(loggedUser)
})

app.put('/user/:username', auth, (req : Request, res : Response) => {
    if(adminRole){
        let userToUpdateIndex = users.findIndex(u => u.login === req.params.username)
        if(userToUpdateIndex == -1) res.sendStatus(400)
        users[userToUpdateIndex].login = req.body.login ?? users[userToUpdateIndex].login
        users[userToUpdateIndex].password = req.body.password ?? users[userToUpdateIndex].password
        users[userToUpdateIndex].notes = req.body.notes ?? users[userToUpdateIndex].notes
        users[userToUpdateIndex].tags = req.body.tags ?? users[userToUpdateIndex].tags
        storageOption.updateStorage(users)
        res.sendStatus(201)
    } 
    else {
        loggedUser.login = req.body.login ?? loggedUser.login
        loggedUser.password = req.body.password ?? loggedUser.password
        loggedUser.notes = req.body.notes ?? loggedUser.notes
        loggedUser.tags = req.body.tags ?? loggedUser.tags
        users.splice(users.findIndex(user => user.login === loggedUser.login), 1, loggedUser)
        storageOption.updateStorage(users)
        res.sendStatus(201)
    }
})

app.delete('/user/:username', auth, (req : Request, res : Response) => {
    if(adminRole == false) res.sendStatus(401)
    else {
        let userToDelete : number = users.findIndex(u => u.login == req.params.username) 
        if(userToDelete == -1) res.sendStatus(400)
        else{
            users.splice(userToDelete, 1)
            storageOption.updateStorage(users)
            res.sendStatus(201)
        }
    }

})

app.get('/notes', auth, (req: Request, res: Response) => {
    let index : number = users.findIndex(x => x.login == loggedUser.login)
    if(index !== -1) res.status(200).send(users[index].notes)
    else res.sendStatus(400)
})

app.get('/note/:id', auth, (req: Request, res: Response) => {   
    let noteId : number = +req.params.id
    let note : Note | undefined = notes.find(note => note.id === noteId)
    if(note !== undefined)
        res.status(200).send(note)
    else res.sendStatus(400)
       
})

app.get('/notes/user/:userName', auth, (req: Request, res: Response) => {
    const userName : string = req.params.userName
    const index : number = users.findIndex(x => x.login == userName)
    const filteredNotes : Note[] = users[index].notes.filter(x => x.visible == true) 
    if(index !== -1) res.status(200).send(filteredNotes)
    else res.sendStatus(400)
})

app.post('/note', auth, (req: Request, res: Response) => {
    try{
        let note : Note = new Note(req.body.title, req.body.content, req.body.visible, req.body.createDate, req.body.tags)
        let tagArr : Tag[] = req.body.tags ?? []
        note.id = Date.now()

        tagArr.forEach(tag => {
            if(!tags.some(el => tag.name.toLowerCase() === el.name)){
                let newTag = new Tag(tag.name.toLowerCase())
                tags.push(newTag)
            } else console.log('failed to add tag')
        }) 
        notes.push(note)              
        
        loggedUser.notes = notes
        loggedUser.tags = tags
        users.splice(users.findIndex(user => user.login === loggedUser.login), 1, loggedUser)
        storageOption.updateStorage(users)      
        
        res.status(201).send(note.id.toString())
    }
    catch(err) {
        console.error(err);
        res.sendStatus(400)
    }
})

app.put('/note/:id', auth, (req : Request, res : Response) => {
    let noteId : number = +req.params.id
    let noteIndex : number = loggedUser.notes.findIndex(note => note.id === noteId)
    if(noteIndex !== -1) {
        notes[noteIndex].content = req.body.content ?? notes[noteIndex].content
        notes[noteIndex].title = req.body.title ?? notes[noteIndex].title
        notes[noteIndex].createDate = req.body.createDate ?? notes[noteIndex].createDate
        notes[noteIndex].tags = req.body.tags ?? notes[noteIndex].tags 
        loggedUser.notes = notes 
        users.splice(users.findIndex(u => u.login == loggedUser.login), 1, loggedUser)
        storageOption.updateStorage(users)     
        res.sendStatus(204)
    } else res.sendStatus(404)      
})

app.delete('/note/:id', auth, (req : Request, res : Response) => {
    let noteId : number = +req.params.id
    if(notes.some(n => n.id === noteId)){
        let index : number = notes.findIndex(n => {n.id === noteId})
        notes.splice(index, 1)
        loggedUser.notes = notes
        storageOption.updateStorage(users)
        res.sendStatus(204)
    }
    else res.sendStatus(400)
})

app.get('/tags', auth, (req: Request, res: Response) => {
    let index : number = users.findIndex(x => x.login == loggedUser.login)
    if(index !== -1) res.status(200).send(users[index].tags)
    else res.sendStatus(400)  
})

app.get('/tag/:id', auth, (req: Request, res: Response) => {
    let tagId : number = +req.params.id
    let tag : Tag | undefined = tags.find(tag => tag.id === tagId)
    if(tag) res.status(200).send(tag)
    else res.sendStatus(400)
})

app.post('/tag', auth, (req: Request, res: Response) => {
    try{
        let tag : Tag = new Tag(req.body.name.toLowerCase())
        tags.push(tag)
        loggedUser.tags = tags  
        users.splice(users.findIndex(user => user.login === loggedUser.login), 1, loggedUser)

        storageOption.updateStorage(users)        
        res.status(201).send(tag.id!.toString())
    }
    catch(err) {
        console.error(err);
        res.sendStatus(400)
    }
})

app.put('/tag/:id', auth, (req: Request, res: Response) => {
    let tagId : number = +req.params.id
    let tagIndex : number = tags.findIndex(tag => tag.id === tagId)
    if(tagIndex !== -1) { 
        tags[tagIndex].name = req.body.name ?? tags[tagIndex].name
        tags[tagIndex].id = req.body.id ?? tags[tagIndex].id 
        loggedUser.tags = tags
        users.splice(users.findIndex(user => user.login === loggedUser.login), 1, loggedUser)

        storageOption.updateStorage(users)
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }    
})

app.delete('/tag/:id', auth, (req: Request, res: Response) => {
    let tagId : number = +req.params.id
    if(tags.some(t => t.id === tagId)){
        let index : number = tags.findIndex(n => {n.id === tagId})
        tags.splice(index, 1)       
        loggedUser.tags = tags
        storageOption.updateStorage(users)
        res.sendStatus(204)
    }
    else res.sendStatus(400)
})

app.listen(3001, () => console.log('server is running...'))
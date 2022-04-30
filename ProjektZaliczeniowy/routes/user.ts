import express from 'express' 
import {Request, Response} from 'express'


const userRouter = express.Router() 

userRouter.get('/', (req: Request, res: Response) => {
    res.send()
})

userRouter.get('/:username', (req: Request, res: Response) => {
    res.send()
})

userRouter.get('/cars', (req: Request, res: Response) => {
    res.send()
})

userRouter.get('/races', (req: Request, res: Response) => {
    res.send()
})

userRouter.put('/', (req: Request, res: Response) => {
    res.send()
})

userRouter.delete('/:id', (req: Request, res: Response) => {
    //admin
    res.send()
})

userRouter.get('/all', (req: Request, res: Response) => {
    //admin
    res.send()
})

userRouter.put('/:id', (req: Request, res: Response) => {
    //admin
    res.send()
})

export default userRouter
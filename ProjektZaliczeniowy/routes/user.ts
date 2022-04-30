import express from 'express' 
import {Request, Response} from 'express'
import userModel from '../models/userModel'
import carModel from '../models/carModel'
import raceModel from '../models/raceModel'


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
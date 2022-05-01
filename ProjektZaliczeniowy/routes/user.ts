import express from 'express' 
import {Request, Response} from 'express'
import userModel from '../models/userModel'
import carModel from '../models/carModel'
import raceModel from '../models/raceModel'
import authMW from '../middleware/auth'
import adminRoleMW from '../middleware/adminRole'


const userRouter = express.Router() 

userRouter.get('/', authMW, (req: Request, res: Response) => {
    res.send()
})

userRouter.get('/:username', authMW, (req: Request, res: Response) => {
    res.send()
})

userRouter.get('/cars', authMW, (req: Request, res: Response) => {
    res.send()
})

userRouter.get('/races', authMW, (req: Request, res: Response) => {
    res.send()
})

userRouter.put('/', authMW, (req: Request, res: Response) => {
    res.send()
})

userRouter.delete('/:id', authMW, adminRoleMW, (req: Request, res: Response) => {
    //admin
    res.send()
})

userRouter.get('/all', authMW, adminRoleMW, (req: Request, res: Response) => {
    //admin
    res.send()
})

userRouter.put('/:id', authMW, adminRoleMW, (req: Request, res: Response) => {
    //admin
    res.send()
})

export default userRouter
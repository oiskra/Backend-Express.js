import express from 'express' 
import {Request, Response} from 'express'
import userModel from '../models/userModel'
import carModel from '../models/carModel'
import raceModel from '../models/raceModel'
import authMW from '../middleware/auth'
import adminRoleMW from '../middleware/adminRole'
import console from 'console'


const userRouter = express.Router() 

userRouter.get('/', authMW, async (req: Request, res: Response) => {
    const user = await userModel
        .findOne({_id: res.locals.userId})
    res.send(user)
})

userRouter.get('/cars', authMW, async (req: Request, res: Response) => {
    const userCars = await userModel
        .findOne({_id: res.locals.userId})
        .select('cars')
    res.send(userCars)
})

userRouter.get('/races', authMW, async (req: Request, res: Response) => {
    const userRaces = await userModel
    .findOne({_id: res.locals.userId})
    .select('races')
    res.send(userRaces)
})

userRouter.get('/all', authMW, adminRoleMW, async (req: Request, res: Response) => {
    const users = await userModel
        .find()
    console.log(users)
    res.send(users)
})

userRouter.get('/:username', authMW, async (req: Request, res: Response) => {
    if(req.params.username == 'admin') return res.sendStatus(401)
    const user = await userModel
        .findOne({_id: res.locals.userId})    
        .select('username cars races')
    res.send(user)
})

userRouter.put('/', authMW, async (req: Request, res: Response) => {
    const userToUpdate = await userModel
        .updateOne({_id: res.locals.userId}, req.body)
    res.send('Changes applied, please log in again')
})

userRouter.put('/:id', authMW, adminRoleMW, async (req: Request, res: Response) => {
    const id = req.params.id
    const admin = await userModel
        .findOne({username: 'admin'})
    if(req.params.id == admin._id) return res.sendStatus(400)
    
    const userToUpdate = await userModel.updateOne({_id : id}, req.body)
    res.send('User updated successfully')
})

userRouter.delete('/:id', authMW, adminRoleMW, async (req: Request, res: Response) => {
    const admin = await userModel
        .findOne({username: 'admin'})
    if(req.params.id == admin._id) return res.sendStatus(400)
    
    await userModel
        .deleteOne({_id: req.params.id})
    res.send(`Deleted user with id ${req.params.id} `)
})


export default userRouter
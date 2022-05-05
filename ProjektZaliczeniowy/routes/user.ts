import express from 'express' 
import {Request, Response} from 'express'
import userModel from '../models/userModel'
import authMW from '../middleware/auth'
import adminRoleMW from '../middleware/adminRole'

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
        .populate('cars')
    res.send(userCars)
})

userRouter.get('/races', authMW, async (req: Request, res: Response) => {
    const userRaces = await userModel
        .findOne({_id: res.locals.userId})
        .select('races')
        .populate({
            path: 'races', 
            populate: {
                path: 'carOne carTwo',
                select: 'brand model statistics'
            }})
        
    res.send(userRaces)
})

userRouter.get('/all', authMW, adminRoleMW, async (req: Request, res: Response) => {
    const users = await userModel
        .find()
        .select('-password')
    res.send(users)
})

userRouter.get('/:username', authMW, async (req: Request, res: Response) => {
    if(req.params.username == 'admin') return res.sendStatus(401)
    const user = await userModel
        .findOne({_id: res.locals.userId})    
        .select('username cars races')
        .populate({
            path: 'races', 
            populate: {
                path: 'carOne carTwo',
                select: 'brand model'
            }})
        .populate('cars')
    
    res.send(user)
})

userRouter.put('/', authMW, async (req: Request, res: Response) => {
    if(req.body._id) 
        return res.status(400).send('You can\'t update id')
    
    const userToUpdate = await userModel
        .updateOne({_id: res.locals.userId}, req.body)
    
    if(!userToUpdate.acknowledged)
        return res.status(400).send('Wrong update values')
    res.send('Changes applied')
})

userRouter.put('/:id', authMW, adminRoleMW, async (req: Request, res: Response) => {
    if(req.body._id) 
        return res.status(400).send('You can\'t update id')

    const id = req.params.id
    const admin = await userModel.findOne({username: 'admin'})
    if(req.params.id == admin._id) return res.status(400).send('You can\'t update admin')
    
    const userToUpdate = await userModel.updateOne({_id : id}, req.body)

    if(!userToUpdate.acknowledged)
        return res.status(400).send('Wrong update values')
    res.send('User updated successfully')
})

userRouter.delete('/:id', authMW, adminRoleMW, async (req: Request, res: Response) => {
    const admin = await userModel
        .findOne({username: 'admin'})
    if(req.params.id == admin._id) 
        return res.status(400).send('You can\'t delete admin account')
    
    const del = await userModel.deleteOne({_id: req.params.id})

    if(!del.acknowledged)
        return res.status(400).send('User cannot be deleted')
    
    res.send(`Deleted user with id ${req.params.id} `)
})


export default userRouter
import express from 'express'
import {Request, Response} from 'express'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel'
import authMW from '../middleware/auth'



const accRouter = express.Router()

accRouter.post('/register', async (req: Request, res: Response) => {
    //api gets username,login,password
    const {username, login, password} = req.body
    if(!username || !login || !password) res.status(400).send('Fill the gaps')
    //creates token
    try {
        const newUser = new userModel(JSON.parse(req.body))
        await newUser.save()
        res.status(201).send('User registered successfully')
    } catch {
        res.status(400).send('Try again')
    }
})

accRouter.post('/login', async (req: Request, res: Response) => {
    //gets login 
    const {login, password} = req.body
    if(!login || !password) res.status(400).send('Please try again')

    const token: string = jwt.sign(JSON.stringify(req.body),'secret')
    const user = await userModel.find({login: login})
    if(!user) res.status(404).send('User not found, please register first')

    res.cookie('token', token).status(200).send('User logged in successfully')
})

accRouter.post('/logout', authMW, (req: Request, res: Response) => {
    res.clearCookie('token').send('User logged out successfully')
})

export default accRouter
import express from 'express'
import {Request, Response} from 'express'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel'
import authMW from '../middleware/auth'


const accRouter = express.Router()

accRouter.post('/register', async (req: Request, res: Response) => {
    const {username, login, password} = req.body
    const userCheck = await userModel.exists({login: login})
    if(userCheck) return res.status(400).send('User already exists, try to log in')
    if(!username || !login || !password) res.status(400).send('Fill the gaps')
    try {
        const newUser = new userModel({
            username: username,
            login: login,
            password: password
        })
        
        await newUser.save()
        res.status(201).send('User registered successfully')
    } catch {
        res.status(500).send('Try again')
    }
})

accRouter.post('/login', async (req: Request, res: Response) => {
    const loggedCheck = req.headers.cookie
    if(loggedCheck) return res.status(400).send('User already logged in')
    const {login, password} = req.body
    if(!login || !password) res.status(400).send('Please try again')

    const token: string = jwt.sign(JSON.stringify(req.body),'secret')
    const user = await userModel.findOne({login: login})
    if(!user) return res.status(404).send('User not found, please register first')

    res.cookie('token', token).status(200).send('User logged in successfully')
})

accRouter.post('/logout', authMW, (req: Request, res: Response) => {
    res.cookie('token', '', {maxAge: 1, httpOnly: false}).send('User logged out successfully')
})

export default accRouter
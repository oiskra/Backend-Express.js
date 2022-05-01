import express from 'express'
import {Request, Response} from 'express'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel'
import auth from '../middleware/auth'

const accRouter = express.Router()

accRouter.post('/register', (req: Request, res: Response) => {
    //api gets usermae,login,password
    const {username, login, password} = req.body
    if(!username || !login || !password) res.status(400).send('Fill the gaps')
    //creates token
    const newUser = new userModel(JSON.parse(req.body))
    newUser.save()
    res.status(201).send('User created')
})

accRouter.post('/login', async (req: Request, res: Response) => {
    //gets login 
    const {login, password} = req.body
    if(!login || !password) res.status(400).send('Please log in')

    const token: string = jwt.sign(JSON.stringify(req.body),'secret')
    //assigns token
    req.headers['Authorization'] = 'Bearer ' + token    
    res.status(200).send('User logged in successfully')
})

accRouter.post('/logout', auth, (req: Request, res: Response) => {
    res.removeHeader('Authorization')
    res.send('User logged out successfully').status(200)
})

export default accRouter
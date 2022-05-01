import {Request, Response, NextFunction} from 'express'
import userModel from '../models/userModel'
import jwt from 'jsonwebtoken'

const authMW = async (req: Request, res: Response, next: NextFunction) => {
    const token : string = req.headers.authorization?.split(' ')[1] ?? ''
    if(!token) res.sendStatus(401)
    
    let tokenUser
    jwt.verify(token, 'secret', (err, data) => {
        if(err) res.sendStatus(401)        
        tokenUser = JSON.parse(JSON.stringify(data))
    })

    const dbUser = await userModel.find({login: tokenUser.login})
    if(!dbUser) res.sendStatus(401)

    next()
}

export default authMW





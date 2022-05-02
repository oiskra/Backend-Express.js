import {Request, Response, NextFunction} from 'express'
import userModel from '../models/userModel'
import jwt from 'jsonwebtoken'

const authMW = (req: Request, res: Response, next: NextFunction) => {
    const token : string = req.cookies.token
    if(!token) res.sendStatus(401)
    
    jwt.verify(token, 'secret', async (err, data) => {
        if(err) res.sendStatus(401)        
        const tokenUser = JSON.parse(JSON.stringify(data))
        const dbUser = await userModel.find({login: tokenUser.login})
        if(!dbUser) res.sendStatus(401)
    
        next()
    })
}

export default authMW





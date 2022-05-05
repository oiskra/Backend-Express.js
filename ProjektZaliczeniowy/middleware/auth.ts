import {Request, Response, NextFunction} from 'express'
import userModel from '../models/userModel'
import jwt from 'jsonwebtoken'

const authMW = (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined = req.headers.cookie?.split('=')[1]
    if(!token) return res.sendStatus(401)
    
    jwt.verify(token, 'secret', async (err, data) => {
        if(err) res.sendStatus(401)        
        const tokenUser = JSON.parse(JSON.stringify(data))
        let dbUser = await userModel.findOne({login: tokenUser.login})
        if(!dbUser) return res.sendStatus(403)

        res.locals.userId = dbUser._id
        console.log('auth completed')
        next()
    })
}

export default authMW





import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

const adminRoleMW = (req: Request, res: Response, next: NextFunction) => {
    const token : string = req.headers.authorization?.split(' ')[1] ?? ''
    jwt.verify(token, 'secret', (err, data) => {
        
        const user = JSON.parse(JSON.stringify(data))
        if(user.login != 'admin') return res.sendStatus(403)

        next()
    })
    
} 

export default adminRoleMW
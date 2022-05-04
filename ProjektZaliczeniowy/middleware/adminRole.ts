import {Request, Response, NextFunction} from 'express'
import mongoose from 'mongoose'
import userModel from '../models/userModel'

const adminRoleMW = async (req: Request, res: Response, next: NextFunction) => {
    const admin = await userModel.findOne({login: 'admin'})
    if(res.locals.userId.equals(admin._id)) next()
    else {
        res.sendStatus(403)
    }
} 

export default adminRoleMW
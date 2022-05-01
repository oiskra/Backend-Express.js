import express from 'express'
import {Request, Response} from 'express'
import carModel from '../models/carModel'
import userModel from '../models/userModel'
import authMW from '../middleware/auth'
import adminRoleMW from '../middleware/adminRole'

const marketRouter = express.Router()

marketRouter.get('/', authMW, (req: Request, res: Response) => {})

marketRouter.post('/:id', authMW, (req: Request, res: Response) => {})

marketRouter.delete('/:id', authMW, (req: Request, res: Response) => {})

marketRouter.post('/', authMW, adminRoleMW, (req: Request, res: Response) => {}) //admin

marketRouter.put('/:id', authMW, adminRoleMW, (req: Request, res: Response) => {}) //admin

export default marketRouter
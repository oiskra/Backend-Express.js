import express from 'express'
import {Request, Response} from 'express'
import raceModel from '../models/raceModel'
import authMW from '../middleware/auth'
import adminRoleMW from '../middleware/adminRole'

const raceRouter = express.Router()

raceRouter.post('/:username', authMW, (req: Request, res: Response) => {})

raceRouter.get('/:id', authMW, (req: Request, res: Response) => {})

raceRouter.get('/all', authMW, adminRoleMW, (req: Request, res: Response) => {}) //admin

export default raceRouter
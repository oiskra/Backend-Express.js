import express from 'express'
import {Request, Response} from 'express'

const raceRouter = express.Router()

raceRouter.post('/:username', (req: Request, res: Response) => {})

raceRouter.get('/:id', (req: Request, res: Response) => {})

raceRouter.get('/all', (req: Request, res: Response) => {}) //admin

export default raceRouter
import express from 'express'
import {Request, Response} from 'express'
import carModel from '../models/carModel'
import userModel from '../models/userModel'

const marketRouter = express.Router()

marketRouter.get('/', (req: Request, res: Response) => {})

marketRouter.post('/:id', (req: Request, res: Response) => {})

marketRouter.delete('/:id', (req: Request, res: Response) => {})

marketRouter.post('/', (req: Request, res: Response) => {}) //admin

marketRouter.put('/:id', (req: Request, res: Response) => {}) //admin

export default marketRouter
import express from 'express'
import {Request, Response} from 'express'

const accRouter = express.Router()

accRouter.post('/register', (req: Request, res: Response) => {})

accRouter.post('/login', (req: Request, res: Response) => {})

accRouter.post('/logout', (req: Request, res: Response) => {})

export default accRouter
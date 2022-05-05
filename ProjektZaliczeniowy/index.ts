import express from 'express'
import {Request, Response, NextFunction} from 'express'
import accRouter from './routes/account'
import userRouter from './routes/user'
import raceRouter from './routes/race'
import marketRouter from './routes/market'
import {connectDb} from './db'
import {createAdmin} from './models/userModel'


const port = 3000 
const app = express()

app.use(express.json())

app.use((req: Request, res: Response, next: NextFunction) => {
    connectDb()
        .catch(() => {
            return res.status(500).send('Failed to connect to database')
        }) 
    createAdmin()
    next()
})
app.use('/user', userRouter)
app.use('/account', accRouter)
app.use('/race', raceRouter)
app.use('/market', marketRouter)


app.listen(port, () => console.log(`Server is running on ${port}...`))


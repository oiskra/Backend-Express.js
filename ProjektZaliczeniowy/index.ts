import express from 'express'
import accRouter from './routes/account'
import userRouter from './routes/user'
import raceRouter from './routes/race'
import marketRouter from './routes/market'
import carModel from './models/carModel'
import {connectDb} from './db'


connectDb() 
const port = 3000 
const app = express()

app.use(express.json())

app.use('/account', accRouter)
app.use('/user', userRouter)
app.use('/race', raceRouter)
app.use('/market', marketRouter)

const test = new carModel({
    brand: 'car',
    model: 'car',
    statistics: {
        speed: 1,
        acceleration: 1,
        grip: 1,
        braking: 1
    },
    tier: 4
})

test.save()

console.log(carModel.findOne())


app.listen(port, () => console.log(`Server is running on ${port}...`))
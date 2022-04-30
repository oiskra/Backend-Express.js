import express from 'express'
import accRouter from './routes/account'
import userRouter from './routes/user'
import raceRouter from './routes/race'
import marketRouter from './routes/market'

const app = express()
const port = 3000 

app.use(express.json())

app.use('/account', accRouter)
app.use('/user', userRouter)
app.use('/race', raceRouter)
app.use('/market', marketRouter)

app.listen(port, () => console.log(`Server is running on ${port}`))
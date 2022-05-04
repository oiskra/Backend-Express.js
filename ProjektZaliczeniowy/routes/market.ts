import express from 'express'
import {Request, Response} from 'express'
import carModel from '../models/carModel'
import userModel from '../models/userModel'
import authMW from '../middleware/auth'
import adminRoleMW from '../middleware/adminRole'
import mongoose from 'mongoose'

const marketRouter = express.Router()

marketRouter.post('/', authMW, adminRoleMW, async (req: Request, res: Response) => {
    const {brand , model, statistics, tier} = req.body
    if(!brand || !model || !statistics || !tier){
        return res.sendStatus(400)
    }

    const newCar = new carModel({
        brand: brand,
        model: model,
        statistics: statistics,
        tier: tier
    })

    await newCar
        .save()
        .then(() => res.status(201).send('New Car added to Market'))
        .catch(() => res.sendStatus(400))
}) 

marketRouter.post('/sell/:id', authMW, async (req: Request, res: Response) => {
    const userWithCar = await userModel
        .findOne({ cars: [req.params.id]})
    
    console.log(userWithCar)
   
    if(!userWithCar) return res.sendStatus(404)
    
        


    //if(userWithCar._id != res.locals.userId) console.log('nie ten users')

})

marketRouter.get('/', authMW, async (req: Request, res: Response) => {
    const market = await carModel.find()
    res.send(market)
})

marketRouter.put('/:id', authMW, adminRoleMW, (req: Request, res: Response) => {}) 

marketRouter.delete('/buy/:id', authMW, async (req: Request, res: Response) => {
    const buyer = await userModel.findById(res.locals.userId)
    const marketBuy = await carModel.findById(req.params.id)
    const buyersMoney: number = buyer.money
    const carPrice: number = marketBuy.price

    if(!marketBuy) return res.sendStatus(404)
    if(buyersMoney >= carPrice) {
        await userModel.updateOne({_id: res.locals.userId}, {
            $push: {
                cars: req.params.id
            },
            money: buyersMoney - carPrice
        })
    } else {
        res.status(400).send(`You can\'t afford this car. You\'re lacking $${(buyersMoney-carPrice)*(-1)}`)
    }

})

marketRouter.delete('/:id', authMW, adminRoleMW, async (req: Request, res: Response) => {
    await carModel.deleteOne({_id: req.params.id})
    res.send('deleted')
})

export default marketRouter
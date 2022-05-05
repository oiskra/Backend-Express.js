import express from 'express'
import {Request, Response} from 'express'
import {carsModel, marketModel} from '../models/carModel'
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

    const newCar = {
        _id:  new mongoose.Types.ObjectId(),
        brand: brand,
        model: model,
        statistics: statistics,
        tier: tier
    } 

    const newCarInCars = new carsModel(newCar)
    const newCarInMarket = new marketModel(newCar)

    try {
        await newCarInCars.save()
        await newCarInMarket.save()
        res.status(201).send('New Car added to Market and Cars')       
    } catch {
        res.send('Failed to add new Car')  
    }
}) 

marketRouter.post('/sell/:id', authMW, async (req: Request, res: Response) => {
    const carID = req.params.id
    const userWithCar = await userModel.findOne({cars: carID}) 
    const seller = await userModel.findOne({_id: res.locals.userId}).populate('cars')
    console.log(seller)
    console.log(carID)
    
    if(!seller.equals(userWithCar))  
        return res.status(400).send('You don\'t own the car you want to sell')
    
    const carsArray = seller.cars.toObject()
    const carToSellObject = carsArray.find((c: any) => c._id == carID) 
    const carPrice = carToSellObject.price
    const carToSell = new marketModel({
        _id: carToSellObject._id,
        brand: carToSellObject.brand,
        model: carToSellObject.model,
        statistics: carToSellObject.statistics,
        tier: carToSellObject.tier
    })
    
    await carToSell
        .save()
        .then(() => console.log('Car sold to market'))
        .catch((err: Error) => {
           res.sendStatus(400)
           console.log(err.message)
        })
    
    seller.money += carPrice
    seller.cars.pull(carID)
    await seller 
        .save()  
        .then(() => console.log('Car deleted from user, money added'))
        .catch(() => res.sendStatus(400))
    
    res.send('you own the car you want to sell')
})

marketRouter.get('/', authMW, async (req: Request, res: Response) => {
    const market = await marketModel.find()
    res.send(market)
})

marketRouter.put('/:id', authMW, adminRoleMW, async (req: Request, res: Response) => {
    const update = req.body
    await carsModel.updateOne({_id: req.params.id}, update)    
    await marketModel.updateOne({_id: req.params.id}, update)    
}) 

marketRouter.delete('/buy/:id', authMW, async (req: Request, res: Response) => {
    const buyer = await userModel.findById(res.locals.userId)
    const marketBuy = await marketModel.findById(req.params.id)
    const buyersMoney: number = buyer.money
    const carPrice: number = marketBuy.price

    if(!marketBuy) return res.sendStatus(404)
    if(buyersMoney >= carPrice) {
        await userModel.updateOne({_id: res.locals.userId}, {
            $push: {
                cars: marketBuy._id
            },
            money: buyersMoney - carPrice
        })

        await marketModel.deleteOne({_id: req.params.id})
        res.send('You bought a car')
    } else {
        res.status(400).send(`You can\'t afford this car. You\'re lacking $${(buyersMoney-carPrice)*(-1)}`)
    }

})

marketRouter.delete('/:id', authMW, adminRoleMW, async (req: Request, res: Response) => {
    await marketModel.deleteOne({_id: req.params.id})
    await carsModel.deleteOne({_id: req.params.id})
    res.send('deleted')
})

export default marketRouter
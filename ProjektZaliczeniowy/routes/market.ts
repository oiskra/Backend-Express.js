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
        return res.status(400).send('Invalid input')
    }

    const newCar = {
        _id:  new mongoose.Types.ObjectId(),
        brand: brand,
        model: model,
        statistics: statistics,
        tier: tier
    } 

    try {
        const newCarInCars = new carsModel(newCar)
        const newCarInMarket = new marketModel(newCar)

        await newCarInCars.save()
        await newCarInMarket.save()
        res.status(201).send('New Car added to Market and Cars')       
    } 
    catch {
        res.status(500).send('Failed to add new Car')  
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
            console.log(err.message)
            return res.status(500).send('Failed to sell the car, try again later')
        })
    
    seller.money += carPrice
    seller.cars.pull(carID)
    await seller 
        .save()  
        .then(() => console.log('Car deleted from user, money added'))
        .catch(() => res.status(500).send('Failed to add car to market, try again later'))
    
    res.send('Car sold to market')
})

marketRouter.get('/', authMW, async (req: Request, res: Response) => {
    try {
        const market = await marketModel.find()
        res.send(market)
    } catch {
        res.status(500).send('Market exploded')
    }
})

marketRouter.put('/:id', authMW, adminRoleMW, async (req: Request, res: Response) => {
    const update = req.body
    if(req.body._id) return res.status(400).send('You cannot update id!')

    try {
        await carsModel.updateOne({_id: req.params.id}, update)    
        await marketModel.updateOne({_id: req.params.id}, update)    
        res.send(`Car with id ${req.params.id}, updated successfully`)
    } catch {
        res.status(500).send('Failed to update car with id ${req.params.id}')
    }
}) 

marketRouter.delete('/buy/:id', authMW, async (req: Request, res: Response) => {
    const buyer = await userModel.findById(res.locals.userId)
    const marketBuy = await marketModel.findById(req.params.id)
    
    if(!marketBuy) return res.status(404).send('There is no such car in the market')
    
    const buyersMoney: number = buyer.money
    const carPrice: number = marketBuy.price

    try {
        if(buyersMoney >= carPrice) {
            await userModel.updateOne({_id: res.locals.userId}, {
                $push: {
                    cars: marketBuy._id
                },
                money: buyersMoney - carPrice
            })

            await marketModel.deleteOne({_id: req.params.id})
            res.send(`You bought a ${marketBuy.brand} ${marketBuy.model}`)
        } else {
            res.status(400).send(`You can\'t afford this car. You\'re lacking $${(buyersMoney-carPrice)*(-1)}`)
        }
    } catch {
        res.sendStatus(500)
    }
})

marketRouter.delete('/:id', authMW, adminRoleMW, async (req: Request, res: Response) => {
    try {
        await marketModel.deleteOne({_id: req.params.id})
        await carsModel.deleteOne({_id: req.params.id})
        res.send('Car with id ' + req.params.id + ' was deleted successfully')
    } catch {
        res.status(404).send('Failed to delete car')
    }
})

export default marketRouter
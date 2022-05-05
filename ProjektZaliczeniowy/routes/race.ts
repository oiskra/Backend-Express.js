import express from "express";
import { Request, Response } from "express";
import raceModel from "../models/raceModel";
import userModel from "../models/userModel";
import authMW from "../middleware/auth";
import adminRoleMW from "../middleware/adminRole";
import mongoose from 'mongoose'

const raceRouter = express.Router();

raceRouter.get("/all", authMW, async (req: Request, res: Response) => {
    const race = await userModel
        .where({_id: res.locals.userId})
        .select('races')
        .populate({
            path: 'races', 
            populate: {
                path: 'carOne carTwo',
                select: 'brand model statistics'
            }
        })
    res.send(race)    
})

raceRouter.get("/adminAll", authMW, adminRoleMW, async (req: Request, res: Response) => {
    const races = await raceModel.find()
        .populate('carOne carTwo', {
            brand: 1, 
            model: 1, 
            statistics: 1
        })

    if(!races) return res.status(500).send('Failed to load races')
    
    res.send(races) 
})

raceRouter.post("/:username", authMW, async (req: Request, res: Response) => {
    const playerOne = await userModel.findById(res.locals.userId).populate('cars')
    const playerTwo = await userModel.findOne({username: req.params.username}).populate('cars')
    const {brand, model} = req.body

    if (!playerTwo) return res.status(404).send("User not found")
    
    const playerTwoCarArray = playerTwo.cars.toObject()
    if(playerTwoCarArray.length == 0) 
        return res.status(400).send('Challenge failed, user don\'t own any cars')
    
    const playerOneCar = playerOne.cars.toObject().find((c:any) => c.brand == brand && c.model == model)
    if(!playerOneCar) 
        return res.status(404).send('You don\'t own the car you want to drive, choose another one')
    
    const playerTwoCar = playerTwoCarArray.find(() => {
        const rnd: number = Math.floor(Math.random() * playerTwo.cars.length)
        return playerTwo.cars[rnd]
    })

    console.log(playerOneCar)
    console.log(playerTwoCar)
    
    let statsOne: number = 0
    for (const value of Object.values(playerOneCar.statistics.toObject())) {
        if(typeof value == 'number')
            statsOne += Number(value) 
    }

    let statsTwo: number = 0
    for (const value of Object.values(playerTwoCar.statistics.toObject())) {
        if(typeof value == 'number')
            statsTwo += Number(value)        
    }

    const draw: boolean = statsOne == statsTwo
    let raceOutcome: string
    if(!draw) 
        raceOutcome = statsOne > statsTwo ? playerOne.username : playerTwo.username
    else 
        raceOutcome = 'draw'   

    try {
        const newRace = new raceModel({
            _id: new mongoose.Types.ObjectId(),
            playerOne: playerOne.username,
            carOne: playerOneCar._id,
            playerTwo: playerTwo.username,
            carTwo: playerTwoCar._id,
            winner: raceOutcome
        })
    
        playerOne.races.push(newRace._id)
        playerTwo.races.push(newRace._id)
        switch (raceOutcome) {
            case playerOne.username: 
                playerOne.money += 500
                break
            case playerTwo.username: 
                playerTwo.money += 500
                break
            case 'draw': 
                playerOne.money += 250
                playerTwo.money += 250
                break            
        }
        await newRace.save()  
        await playerOne.save()
        await playerTwo.save()

        if(draw) return res.send('Race ended in a draw')
        res.send(raceOutcome.toUpperCase() + ' won the race!')
    } catch (error) {
        res.sendStatus(500)
    }
})

raceRouter.put("/:id", authMW, adminRoleMW, async (req: Request, res: Response) => {
    const update = req.body
    const race = await raceModel.updateOne({_id: req.params.id}, update)
    
    if(!race.acknowledged)
        return res.status(400).send('Wrong update values')    

    res.send('Race with id ' + req.params.id + ' updated successfully')    
})

raceRouter.delete("/:id", authMW, adminRoleMW, async (req: Request, res: Response) => {
    const del = await raceModel.findByIdAndDelete(req.params.id)

    if(!del.acknowledged)
        return res.status(400).send('Wrong update values')  

    res.send('Race with id ' + req.params.id + ' deleted successfully')       
})

export default raceRouter;

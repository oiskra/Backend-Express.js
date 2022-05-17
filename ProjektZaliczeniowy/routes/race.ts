import express from "express";
import { Request, Response } from "express";
import raceModel from "../models/raceModel";
import userModel from "../models/userModel";
import { calculateRaceWinner } from '../helperFunctions'
import authMW from "../middleware/auth";
import adminRoleMW from "../middleware/adminRole";
import mongoose from 'mongoose'

const raceRouter = express.Router();

raceRouter.get("/all", authMW, async (req: Request, res: Response) => {
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

    const raceOutcome: string = calculateRaceWinner(playerOneCar, playerOne.username, playerTwoCar, playerTwo.username)

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
                playerTwo.money += 100
                break
            case playerTwo.username: 
                playerTwo.money += 500
                playerOne.money += 100
                break
            case 'draw': 
                playerOne.money += 300
                playerTwo.money += 300
                break            
        }
        await newRace.save()  
        await playerOne.save()
        await playerTwo.save()

        if(raceOutcome == 'draw') return res.send('Race ended in a draw')
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
        return res.status(400).send('Wrong delete id')  

    res.send('Race with id ' + req.params.id + ' deleted successfully')       
})

export default raceRouter;

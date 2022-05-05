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
        .populate('raceModel')
    res.status(200).send(race)    
})

raceRouter.get("/adminAll", authMW, adminRoleMW, async (req: Request, res: Response) => {
    const races = await raceModel.find()
        .populate('playerOne playerTwo', {username: 1, cars:1, races:1})
        .populate('carOne carTwo', {brand: 1, model:1, statistics:1})
    console.log(races)
    res.status(200).send(races) 
})

raceRouter.get("/:id", authMW, async (req: Request, res: Response) => {
    const race = await raceModel.findById(+req.params.id)
    res.status(200).send(race)    
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
            playerOne: playerOne._id,
            carOne: playerOneCar._id,
            playerTwo: playerTwo._id,
            carTwo: playerTwoCar._id,
            winner: raceOutcome
        })
    
        playerOne.races.push(newRace._id)
        playerTwo.races.push(newRace._id)
        //wygrana za wyścig
        await newRace.save()  
        await playerOne.save()
        await playerTwo.save()

        if(draw) return res.send('Race ended in a draw')
        res.send(raceOutcome.toUpperCase() + ' won the race!')
    } catch (error) {
        res.sendStatus(500)
    }
})

export default raceRouter;

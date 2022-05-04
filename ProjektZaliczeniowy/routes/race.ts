import express from "express";
import { Request, Response } from "express";
import raceModel from "../models/raceModel";
import userModel from "../models/userModel";
import authMW from "../middleware/auth";
import adminRoleMW from "../middleware/adminRole";

const raceRouter = express.Router();

raceRouter.post("/:username", authMW, async (req: Request, res: Response) => {
    const playerOne = await userModel.findOne({ _id: res.locals.userId })
    const playerTwo = await userModel.findOne({ username: req.params.username })

    if (!playerTwo) res.status(404).send("User not found")
    
    //const carOne = userModel.findOne()
    const carTwo = playerTwo.cars.find(() => {
        const rnd: number = Math.floor(Math.random() * playerTwo.cars.length)
        return playerTwo.cars[rnd]
    })
    
    let statsOne = 0
    //Object.values(carOne.statistics).forEach( (value: any) => statsOne += value)
    let statsTwo = 0
    Object.values(carTwo.statistics).forEach( (value: any) => statsTwo += value)

    //const raceWinner= statsOne > statsTwo ? playerOne : playerTwo

    const newRace = new raceModel({

    })

})

raceRouter.get("/:id", authMW, async (req: Request, res: Response) => {
    const race = await raceModel.findById(+req.params.id)
    res.status(200).send(race)    
})

raceRouter.get("/all", authMW, async (req: Request, res: Response) => {
    const race = await userModel.where({_id: res.locals.userId}).select('races').populate('raceModel')
    res.status(200).send(race)    
})

raceRouter.get("/adminAll", authMW, adminRoleMW, async (req: Request, res: Response) => {
    const races = await raceModel.find()
    console.log(races)
    res.status(200).send(races) 
})//admin

export default raceRouter;

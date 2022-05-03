import express from "express";
import mongoose from "mongoose";
import { Request, Response } from "express";
import raceModel from "../models/raceModel";
import userModel from "../models/userModel";
import authMW from "../middleware/auth";
import adminRoleMW from "../middleware/adminRole";

const raceRouter = express.Router();

raceRouter.post("/:username", authMW, async (req: Request, res: Response) => {
    const playerOne = await userModel.findOne({ username: res.locals.username }).lean()
    const playerTwo = await userModel.findOne({ username: req.params.username }).lean()

    if (!playerTwo) res.status(404).send("User not found")

    const carOne = userModel.findOne()
    const carTwo = playerTwo.cars.find((c) => {
    const rnd: number = Math.floor(Math.random() * playerTwo.cars.length)
    return playerTwo.cars[rnd]
    })

    let statsOne: number
    for (const [key, value] of Object.entries(carOne.statistics)) {
        statsOne += value
    }

    let statsTwo: number
    for (const [key, value] of Object.entries(carTwo.statistics)) {
        statsTwo += value
    }

    const raceWinner= statsOne > statsTwo ? playerOne : playerTwo

    const race = new raceModel({
        playerOne: playerOne,
        carOne: carOne,
        playerTwo: playerTwo,
        carTwo: carTwo,
        winner: raceWinner,
    })
    await race.save()
})

raceRouter.get("/:id", authMW, async (req: Request, res: Response) => {
    const race = await raceModel.findOneById(+req.params.id)
    res.status(200).send(race)    
})

raceRouter.get("/all", authMW, adminRoleMW, async (req: Request, res: Response) => {
    const races = await raceModel.find()
    res.status(200).send(races) 
})//admin

export default raceRouter;

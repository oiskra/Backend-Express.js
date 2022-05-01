import mongoose from "mongoose";
import carSchema from "./carModel"
import raceSchema from "./raceModel"

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true,
        unique: true
    },
    login: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cars: [carSchema],
    races: [raceSchema],
    money:{
        type: Number,  
        default : 1000,
        min: 1000,
        max: 1000
    } 
}, {
    timestamps: true
})

export const userModel = mongoose.model("users", userSchema)
export default userModel
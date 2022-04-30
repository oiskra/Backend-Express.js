import mongoose from "mongoose";
import carSchema from "./carModel"

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true,
        unique: true
    },
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cars: [carSchema],
    races: [carSchema],
    money: Number
}, {
    timestamps: true
})

export const userModel = mongoose.model("users", userSchema)
export default userModel
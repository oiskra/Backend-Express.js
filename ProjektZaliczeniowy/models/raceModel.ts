import mongoose from 'mongoose';
import carModel from './carModel'
import userModel from './userModel'


const raceSchema = new mongoose.Schema({
    playerOne: { 
        type: userModel,
        required: true
    },
    carOne: {
        type: carModel,
        required: true
    },
    playerTwo: { 
        type: userModel,
        required: true
    },
    carTwo: {
        type: carModel,
        required: true
    },
    winner: {
        type: userModel,
        required: true
    }
})

const raceModel = mongoose.model('races', raceSchema)
export default raceModel
import mongoose from 'mongoose';
import carModel from './carModel'
import userModel from './userModel'


const raceSchema= new mongoose.Schema({
    playerOne: { 
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'userModel',
        required: true
    },
    carOne: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'carModel',
        required: true
    },
    playerTwo: { 
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'userModel',
        required: true
    },
    carTwo: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'carModel',
        required: true
    },
    winner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'userModel',
        required: true
    }
})

const raceModel = mongoose.model('races', raceSchema)
export default raceModel
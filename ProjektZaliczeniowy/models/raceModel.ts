import mongoose from 'mongoose';

const raceSchema= new mongoose.Schema({
    playerOne: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    carOne: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cars',
        required: true
    },
    playerTwo: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    carTwo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cars',
        required: true
    },
    winner: {
        type: String,
        required: true
    }
})

const raceModel = mongoose.model('races', raceSchema)
export default raceModel
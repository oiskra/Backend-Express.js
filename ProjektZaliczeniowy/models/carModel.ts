import mongoose from 'mongoose'

const statisticsSchema = new mongoose.Schema({
    speed: {
        type: Number,
        min: 1,
        max: 10,
        required: true
    },
    acceleration: {
        type: Number,
        min: 1,
        max: 10,
        required: true
    },
    grip: {
        type: Number,
        min: 1,
        max: 10,
        required: true
    },
    braking: {
        type: Number,
        min: 1,
        max: 10,
        required: true
    }
})


const carSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    statistics: {
        type: statisticsSchema,
        required: true
    },
    price: Number,
    tier: {
        type: Number,
        min: 1,
        max: 4,
        required: true
    }   
})

carSchema.pre('save', function() {
    const priceCalc : number = this.statistics.speed + this.statistics.acceleration + this.statistics.braking + this.statistics.grip
    this.price = priceCalc * 100
})

const carsModel = mongoose.model('cars', carSchema)
const marketModel = mongoose.model('market', carSchema)
export {carsModel, marketModel}
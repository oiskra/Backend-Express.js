import mongoose from 'mongoose'


const statisticsSchema = new mongoose.Schema({
    speed: {
        type: Number,
        min: 1,
        max: 10
    },
    acceleration: {
        type: Number,
        min: 1,
        max: 10
    },
    grip: {
        type: Number,
        min: 1,
        max: 10
    },
    braking: {
        type: Number,
        min: 1,
        max: 10
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
    const priceCalc : Number = this.statistics.speed + this.statistics.acceleration + this.statistics.braking + this.statistics.grip
    this.price = priceCalc 
})

const carModel = mongoose.model('market', carSchema)
export default carModel
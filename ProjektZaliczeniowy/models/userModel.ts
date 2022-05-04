import mongoose from "mongoose";
import carModel from "./carModel"
import raceModel  from "./raceModel"


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
    cars: [mongoose.SchemaTypes.ObjectId],
    races: [mongoose.SchemaTypes.ObjectId],
    money:{
        type: Number,  
        default : 1000
    } 
}, {
    timestamps: true
})

const userModel = mongoose.model("users", userSchema)
export default userModel


export const createAdmin = async(): Promise<void> => {
    const admin = new userModel({
        username: 'admin',
        login: 'admin',
        password: 'admin'
    })
    const dbAdmin = await userModel.findOne({login: admin.login})
    if(!dbAdmin) {
        await admin.save()
        console.log('admin created')
    }
}


import mongoose from 'mongoose';


export const connectDb = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect('mongodb+srv://oiskra:oiskra@projektzaliczeniowy.o0vsa.mongodb.net/ProjektZaliczeniowy?retryWrites=true&w=majority')
        console.log('DB connection established..')
    } catch(error) {
        console.log(error);
    }

}
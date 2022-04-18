import mongoose from "mongoose";
//const connString = 'mongodb+srv://Olaf-Iskra-pab:Olaf-Iskra-pab@noteapi.srls2.mongodb.net/test';

async function main() {
    

    const noteModel  = mongoose.model('notes', notesSchema)

    const newNote  = new noteModel({
        title: 'first note',
        content: 'from mongoose', 
        private: true,
        tags: ['first', 'second']
    })

    const saveRet = await newNote.save()

    const delRet = await noteModel.deleteOne({private: false})

    const notes = await noteModel.find()
}

const notesSchema = new mongoose.Schema({

})
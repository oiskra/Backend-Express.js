// import mongoose from "mongoose";

// async function main() {
    

//     const noteModel  = mongoose.model('notes', notesSchema)

//     const newNote  = new noteModel({
//         title: 'first note',
//         content: 'from mongoose', 
//         private: true,
//         tags: ['first', 'second']
//     })

//     const saveRet = await newNote.save()

//     const delRet = await noteModel.deleteOne({private: false})

//     const notes = await noteModel.find()
// }

// const notesSchema = new mongoose.Schema({

// })
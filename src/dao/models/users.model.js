import mongoose from "mongoose";

const usersCollection = 'users'
const userSchema = mongoose.Schema({

    first_name: {
        type: String,
        required : true
    },
    last_name:{
        type: String,
        required : true
    },
    email:{
        type: String,
        required : true
    },
    password:{
        type: String,
        required : true
    },
    age:{ 
        type: Number
    },
    rol : {
        type: String,
        default: 'usuario',
        enum: ['usuario', 'admin']
    }
})

const userModel =  mongoose.model(usersCollection, userSchema)
export default userModel;
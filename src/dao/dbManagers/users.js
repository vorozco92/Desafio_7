import usersModel from "../models/users.js";

export default class Users{

    constructor(){
        console.log("Estamos trabajando en db mongo");
    }

    getAll=async()=>{
        let users = await usersModel.find().lean();
        return users;
    }

    saveUsers = async user=> {
        let result = await usersModel.create(user)
        return result
    }
}
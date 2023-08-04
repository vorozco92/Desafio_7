import passport from "passport"
import local from "passport-local"

import userModel from "../dao/models/users.model.js"
import { createHash, isValidPassword } from "../utils.js"

const LocalStrategy = local.Strategy;

const initializatedPassport = ()=>{
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField:'email'}, async(req, username,password, done)=>{
            const { first_name,last_name,email, age}=req.body;

            try{
                let user =await userModel.findOne({email:username});
                if (user){
                    console.log('User already exist')
                }

                const userNew={
                    first_name,
                    last_name,
                    email,
                    age,
                    password : createHash(password)
                }
                let result = await userModel.create(userNew)
                return done(null, result)
            }
            catch(error){
                return done('error en usuario'+error)

            }
        }
    ));

    passport.serializeUser((user, done)=>{
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done)=>{
        let user  = await userModel.findById(id)
        done(null, user)
    })
}


export default initializatedPassport
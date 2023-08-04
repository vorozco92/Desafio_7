import passport from "passport"
import local from "passport-local"

import userModel from "../dao/models/users.model.js"
import { createHash, isValidPassword } from "../utils.js"
import githubService from 'passport-github2';

const LocalStrategy = local.Strategy;

export const  initializatedPassport = ()=>{
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

export const initPassportGit =() =>
{
    passport.serializeUser((user,done)=>{
        done(null,user._id)
    });
    passport.deserializeUser(async(id,done)=>{
        let user = await githubService.findById(id);
        done(null,user);
    })


    passport.use('github', new githubService({
        clientID: "Iv1.a5c4c3ca5dda0ea0",
        clientSecret: "e3817b907e74088d329e094e7d68dd2c3db23f15",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken,refreshToken,profile, done)=>
    { try{

        console.log(profile);
        let user = await userModel.findOne({email:profile._json.email})
        if(!user){
            let newUser = {
                first_name: profile._json.name,
                last_name: profile._json.name,
                age:18,
                email: profile._json.email,
                password:'req'
            }
            let result = await  userModel.create(newUser);
            done(null,result)
        }else{
            done(null,user)
        }
    }catch(error){
        return done(error)
    }

    }))

}


import { Router } from "express"
import userModel  from "../dao/models/users.model.js"

const router = Router();
//const userModel = new userModel();



router.post('/register',async(req,res)=>{
    const {first_name, last_name, email, age, password} = req.body;
    let exist = await userModel.findOne({email:email});
   if (exist) return res.status(400).send({status:'error',error:'Ya esta registrado este correo'});
   
   const user = {
    first_name,
    last_name,
    email, age,
    password :createHash(password)
   }

   if (email == 'adminCoder@coder.com' && password == 'adminCod3r123')
        user.rol = 'admin'

   let resr = await userModel.create(user);
   return res.status(200).send({status:'success',msj:'Te registraste correctamente'});
})

router.post('/login',async(req,res)=>{
    const {email,password}=req.body
    if (! email|| ! password) return res.status(404).send({status: 'error', error_description:'Todos los campos son obligatoios'});
   
    const user = await userModel.findOne({email:email},{email:1,first_name: 1, last_name:1,password:1});
    if(!user) return res.status(400).send({status:"error",error:"User not found"})

    if(! isValidPassword(user, password)) return res.status(403).send({status:"error",error:"Incorrect credentials"})
    req.session.user={
        name: `${user.first_name} ${user.last_name}`,
        email:user.email,
        rol : user.rol
    }
    res.send({status:"success",payload:req.session.user, message:"Nuestro primer logueo"})
})

router.post('/logout',async(req,res)=>{
    if (req.session.user)
        req.session.destroy()
    res.redirect('/login')
})

/**
 * router.post('/register',async(req,res)=>{
    const { first_name,last_name,email, age, password}=req.body;
    const exist =await userModel.findOne({email});

    if(exist) return res.status(400).send({status:"error",error:"Users already exists"})

    const user={
        first_name,
        last_name,
        email,
        age,
        password
    }
    let result = await userModel.create(user)
    res.send({status:"success",message:"User registered"})
})


router.post('/login',async(req,res)=>{
    const {email,password}=req.body
    const user = await userModel.findOne({email,password});

    if(!user) return res.status(400).send({status:"error",error:"Incorrect credentials"})

    req.session.user={
        name: `${user.first_name} ${user.last_name}`,
        email:user.email,
        age: user.age
    }
    res.send({status:"success",payload:req.session.user, message:"Nuestro primer logueo"})
})
 */

router.post('/reset',async(req,res)=>{
    const {email,password}=req.body

    if (! email|| ! password) return res.status(404).send({status: 'error', error_description:'Todos los campos son obligatoios'});
   
    const user = await userModel.findOne({email:email});

    if(!user) return res.status(400).send({status:"error",error:"User not found"})
   
    user.password = password
    user.save();

    res.send({status:"success", message:"Contraseña reseteada correctamente"})

})

export default router;
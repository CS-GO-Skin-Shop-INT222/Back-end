const router = require('express').Router();
require("dotenv").config();
const { PrismaClient } = require('@prisma/client')
const { adminTokens } = new PrismaClient()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const admins = new PrismaClient().admin
const {verifyTokenAdmin} = require('../middleware/auth')


router.get('/admin', async (req, res) => {
    const result = await admins.findMany()
    return res.status(200).send({data:result})
})

router.post('/login',verifyTokenAdmin, async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const findedAmin = await admins.findFirst({
            where: { Email: Email }
        })
          if(!(Email&&Password)) {
        return res.status(401).send({msg: "Please fill information"})
        }
        if (!findedAmin ) {
            return res.status(401).send({msg:"invalid email !"})
          } 
        console.log(findedAmin)
        const validPassword =await bcrypt.compare(Password,findedAmin.Password)
        if (!validPassword) {
           return res.status(401).send({msg:"invalid password ! "})
        } 
         delete findedAmin.password 
        const token =jwt.sign(findedAmin, process.env.TOKEN);
        console.log(token)
        await adminTokens.create({
            data:{
                Token: token,
                AdminID: findedAmin.AdminID
            }
        })
       return res.status(200).header("access-token",token).send({ token: token})
    

    } catch(error) {
        res.status(400).end("error")
     }
    
})
router.delete("/logout",verifyTokenAdmin, async (req, res) => {
    try{
        await adminTokens.deleteMany({
            where:{token:req.Token}
        })
        res.status(200).send("logout finished")
    }catch(error){
        res.status(400).send({error:error.message})
    }
    })
module.exports = router;
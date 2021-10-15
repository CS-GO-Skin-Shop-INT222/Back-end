const router = require('express').Router();
require("dotenv").config();
const { adminTokens } = require('../models/model')
const { admin } = require('../models/model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {verifyTokenAdmin} = require('../middleware/auth')


router.get('/admin', async (req, res) => {
    const result = await admin.findMany()
    return res.status(200).send({data:result})
})

router.post('/login',verifyTokenAdmin, async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const findedAmin = await admin.findFirst({
            where: { Email: Email }
        })
          if(!(Email&&Password)) {
        return res.status(401).send({msg: "Please fill information"})
        }
        if (!findedAmin ) {
            return res.status(401).send({msg:"invalid email !"})
          } 
        const validPassword =await bcrypt.compare(Password,findedAmin.Password)
        if (!validPassword) {
           return res.status(401).send({msg:"invalid password ! "})
        } 
         delete findedAmin.password 
        const token =jwt.sign(findedAmin, process.env.TOKEN);
        await adminTokens.create({
            data:{
                Token: token,
                AdminID: findedAmin.AdminID
            }
        })
       return res.status(200).header("access-token",token).send({ token: token})
    

    } catch(error) {
        res.status(401).end("error")
     }
    
})
router.delete("/logout",verifyTokenAdmin, async (req, res) => {
    try{
        await adminTokens.deleteMany({
            where:{token:req.Token}
        })
        res.status(200).send("logout finished")
    }catch(error){
        res.status(401).send({error:error.message})
    }
    })
module.exports = router;
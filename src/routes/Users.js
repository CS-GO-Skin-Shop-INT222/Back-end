const router = require('express').Router();
require("dotenv").config();
const { PrismaClient } = require('@prisma/client')
const { userTokens } = new PrismaClient()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const users = new PrismaClient().users
const auth = require('../middleware/auth')


router.get('/users', async (req, res) => {
    const result = await users.findMany()
    return res.status(200).send(result)
})

router.get('/profile',auth, async (req, res) =>{
    res.status(200).send({user:req.user})
})

router.get('/user/:id', async (req, res) => {
    const id = Number(req.params.id)
    const result = await users.findUnique({
      where: {  UserID: id }
    })
    return res.status(200).send(result)
  })


router.post('/register', async (req, res) => {
    const { Name, Email, Tel, Password, Credit } = req.body
    if (!(Name && Email && Tel && Password && Credit)) {
        return res.status(400).send("input your info")
    }
    const oldUserName = await users.findFirst({
        where: { Name : Name  }
    })
    const oldUserEmail = await users.findFirst({
        where: {Email: Email  }
    })
    if (oldUserName || oldUserEmail) {     
        
        return res.status(409).send({msg:"User is already exist"})
    }
    let encryptedPassword = await bcrypt.hash(Password, 10);
    const hashPassword = await bcrypt.hash(Password, encryptedPassword)
    await users.create({
        data: {
            Name: Name,
            Email: Email.toLowerCase(),
            Tel: Tel,
            Password: hashPassword,
            Credit: Credit
        }
    })
    return res.send("successfully")
})

router.post('/login', async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const findedUser = await users.findFirst({
            where: { Email: Email }
        })
          if(!(Email&&Password)) {
        return res.status(401).send({msg: "Please fill information"})
        }
        if (!findedUser ) {
            return res.status(401).send({msg:"invalid email !"})
          } 
        console.log(findedUser)
        const validPassword =await bcrypt.compare(Password,findedUser.Password)
        if (!validPassword) {
           return res.status(401).send({msg:"invalid password ! "})
        } 
         delete findedUser.password 
        const token =jwt.sign(findedUser, process.env.TOKEN);
        await userTokens.create({
            data:{
                Token: token,
                UserID: findedUser.UserID
            }
        })
       return res.status(200).header("access-token",token).send({ token: token})
    

    } catch(error) {
        res.status(400).end("error")
     }
    
})

router.delete("/logout",auth, async (req, res) => {
try{
    await userTokens.deleteMany({
        where:{token:req.Token}
    })
    res.status(200).send("logout finished")
}catch(error){
    res.status(400).send({error:error.message})
}
})

router.put('/edituser/',auth, async (req, res) => {
    let id = Number(req.params.id)
    const result = await users.update({
        data: req.body,
        where: { UserID: id }
    })
    if(result.count == 0 ){
        return res.status(400).send("don't have user ")
      }
      return res.send(result)
    })



router.delete("/deleteuser/",auth, async (req, res) => {
    const id = Number(req.params.id)
     await users.deleteMany ({
        where: { UserID: id }
    })
    return res.send("deleteuser successfully" )
})

module.exports = router;
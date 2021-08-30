const router = require('express').Router();
require("dotenv").config();
const express = require('express')
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const users = new PrismaClient().users
const { marketItem } = new PrismaClient()


router.get('/users', async (req, res) => {
    const result = await users.findMany()
    return res.send(result)
})


router.post('/register', async (req, res) => {
    const { Name, Email, Tel, Password, Credit } = req.body
    if (!(Name && Email && Tel && Password && Credit)) {
        return res.status(400).send("input your info")
    }
    const oldUser = await users.findFirst({
        where: { Email: Email }
    })
    if (oldUser) {
        return res.status(409).send("User is already exist")
    }
    encryptedPassword = await bcrypt.hash(Password, 10);
    const hashPassword = await bcrypt.hash(Password, encryptedPassword)
    let result = await users.create({
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
        const validPassword =await bcrypt.compare(Password,findedUser.Password)
       
        if (!(findedUser && validPassword)) {
            res.status(400).send("invalid email or password")
        }
        
         delete findedUser.password 
        const token =jwt.sign(findedUser, process.env.TOKEN,{expiresIn:"1h"})
       return res.header("access-token",token).send({ token: token})

    } catch(err) {
        console.log(err)
     }
})





router.put('/edituser/:id', async (req, res) => {
    let id = req.params.id
    const result = await users.update({
        data: req.body,
        where: { UserID: id }
    })
    return res.send(result)
})
router.delete("/deleteuser/:id", async (req, res) => {
    const id = req.params.id
    const result = await users.delete({
        where: { UserID: id }
    })
    return res.send(result)
})

module.exports = router;
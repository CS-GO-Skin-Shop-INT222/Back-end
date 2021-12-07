const router = require('express').Router();
require("dotenv").config();
const { userTokens } = require('../models/model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { users } = require('../models/model')
const { verifyTokenUser } = require('../middleware/auth')




router.get('/profile', verifyTokenUser, async (req, res) => {
    res.status(200).send({ user: req.user })
})

router.get('/user/:id', async (req, res) => {
    const id = Number(req.params.id)
    const result = await users.findUnique({
        where: { UserID: id }
    })
    return res.status(200).send(result)
})


router.post('/register', async (req, res) => {
    const { Name, Email, Tel, Password, Credit } = req.body
    if (!(Name && Email && Tel && Password && Credit)) {
        return res.status(400).send("input your info")
    }
    const oldUserName = await users.findFirst({
        where: { Name: Name }
    })
    const oldUserEmail = await users.findFirst({
        where: { Email: Email }
    })
    if (oldUserName || oldUserEmail) {

        return res.status(400).send({ msg: "User is already exist" })
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
    return res.status(200).send({ msg: "Register successfully" })
})

router.post('/login', async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const findedUser = await users.findFirst({
            where: { Email: Email }
        })
        if (!(Email && Password)) {
            return res.status(400).send({ msg: "Please fill information" })
        }
        if (!findedUser) {
            return res.status(400).send({ msg: "invalid email !" })
        }
        const validPassword = await bcrypt.compare(Password, findedUser.Password)
        if (!validPassword) {
            return res.status(400).send({ msg: "invalid password ! " })
        }
        delete findedUser.password
        const token = jwt.sign(findedUser, process.env.TOKEN);
        await userTokens.create({
            data: {
                Token: token,
                UserID: findedUser.UserID
            }
        })
        return res.status(200).header("access-token", token).send({ token: token })


    } catch (error) {
        res.status(500).send({ error: error.message })
    }

})

router.delete("/logout", verifyTokenUser, async (req, res) => {
    try {
        await userTokens.deleteMany({
            where: { token: req.Token }
        })
        res.status(200).send("logout finished")
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})


router.put('/edituser/:id', verifyTokenUser, async (req, res) => {
    let id = Number(req.params.id)
    let { Name, Tel, Password } = req.body
    let encryptedPassword = await bcrypt.hash(Password, 10);
    const oldUserName = await users.findFirst({
        where: { Name: Name }
    })
    if (oldUserName.Name == Name && oldUserName.UserID != id) {
        return res.status(400).send({ msg: "Name is already exist" })
    }
    if (Name) {
       await users.update({
            data: {
                Name: Name,
            },
            where: { UserID: id }
        })
    }
    if (Tel) {
       await users.update({
            data: {
                Tel: Tel
            },
            where: { UserID: id }
        })
    }
    if (Password) {
        await users.update({
            data: {
                Password: encryptedPassword
            },
            where: { UserID: id }
        })
    }
   return res.status(200).send({ msg:" update successfully!"})
})



router.delete("/deleteuser/:id", verifyTokenUser, async (req, res) => {
    const id = Number(req.params.id)
    await users.deleteMany({
        where: { UserID: id }
    })
    return res.status(200).send("deleteuser successfully")
})

module.exports = router;
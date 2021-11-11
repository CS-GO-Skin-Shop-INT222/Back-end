const router = require('express').Router();
require("dotenv").config();
const { adminTokens } = require('../models/model')
const { admin } = require('../models/model')
const { users } = require('../models/model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { verifyTokenAdmin } = require('../middleware/auth')


router.get('/admin', verifyTokenAdmin, async (req, res) => {
    return res.status(200).send({user:{ admin:req.admin , state:"admin" }})
})

router.post('/login', verifyTokenAdmin, async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const findedAmin = await admin.findFirst({
            where: { Email: Email }
        })
        if (!(Email && Password)) {
            return res.status(500).send({ msg: "Please fill information" })
        }
        if (!findedAmin) {
            return res.status(500).send({ msg: "invalid email !" })
        }
        const validPassword = await bcrypt.compare(Password, findedAmin.Password)
        if (!validPassword) {
            return res.status(500).send({ msg: "invalid password ! " })
        }
        delete findedAmin.password
        const token = jwt.sign(findedAmin, process.env.TOKEN);
        await adminTokens.create({
            data: {
                Token: token,
                AdminID: findedAmin.AdminID
            }
        })
        return res.status(200).header("access-token", token).send({ token: token })


    } catch (error) {
        res.status(500).end("error")
    }

})
router.delete("/logout", verifyTokenAdmin, async (req, res) => {
    try {
        await adminTokens.deleteMany({
            where: { token: req.Token }
        })
        res.status(200).send("logout finished")
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})
router.get('/users', verifyTokenAdmin, async (req, res) => {
    const result = await users.findMany()
    return res.status(200).send(result)
})

router.put("/addcredit/:id", verifyTokenAdmin, async (req, res) => {
    let id = Number(req.params.id)
    let { Credit } = req.body
    const result = await users.update({
        data: {
            Credit: Credit
        },
        where: { UserID: id }
    })
    if (result.count == 0) {
        return res.status(500).send("don't have user ")
    }
    return res.status(200).send(result)
})


module.exports = router;
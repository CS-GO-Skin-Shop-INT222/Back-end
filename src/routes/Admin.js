const router = require('express').Router();
require("dotenv").config();
const { PrismaClient } = require('@prisma/client')
const { adminTokens } = new PrismaClient()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const admins = new PrismaClient().admin
const auth = require('../middleware/auth')


router.get('/admin', async (req, res) => {
    const result = await admins.findMany()
    return res.status(200).send({data:result})
})


module.exports = router;
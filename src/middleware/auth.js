const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client')
const users = new PrismaClient().users
const Admin = new PrismaClient().admin

const verifyTokenUser = async(req, res, next) => {
    try{
    const token = req.body.token ||  req.header('Authorization').replace('Bearer ','');
    if(!token ){
        return res.status(500).send("A token is require for authentication")
    }
        const decoded = jwt.verify(token, process.env.TOKEN);
        const user = await users.findFirst({
            where:{UserID:decoded.UserID}
        })
        req.user = user;
        next();
    }catch(error){
        return res.status(500).send("invalid token")
    }
}
const verifyTokenAdmin = async(req, res, next) => {
    try{
    const token = req.body.token ||  req.header('Authorization').replace('Bearer ','');
    if(!token ){
        return res.status(500).send("A token is require for authentication")
    }
        const decoded = jwt.verify(token, process.env.TOKEN);
        const admin = await Admin.findFirst({
            where:{AdminID:decoded.AdminID}
        })
        req.admin = admin;
        next();
    }catch(error){
        return res.status(500).send("invalid token")
    }
}
module.exports = {verifyTokenUser , verifyTokenAdmin};
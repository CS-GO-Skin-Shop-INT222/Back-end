const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client')
const users = new PrismaClient().users

const verifyToken = async(req, res, next) => {
    try{
    const token = req.body.token ||  req.header('Authorization').replace('Bearer ','');
    if(!token ){
        return res.status(403).send("A token is require for authentication")
    }
        const decoded = jwt.verify(token, process.env.TOKEN);
        const user = await users.findFirst({
            where:{UserID:decoded.UserID}
        })
        req.user = user;
        next();
    }catch(error){
        return res.status(401).send("invalid token")
    }

    
}
module.exports = verifyToken;
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try{
    const token = req.body.token ||  req.header('Authorization').replace('Bearer ','');
    if(!token ){
        return res.status(403).send("A token is require for authentication")
    }
        const decoded = jwt.verify(token, process.env.TOKEN);
        req.user = decoded;
        next();
    }catch(error){
        return res.status(401).send("invalid token")
    }

    
}
module.exports = verifyToken;
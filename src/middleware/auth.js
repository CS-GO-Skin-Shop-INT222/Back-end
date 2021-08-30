const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    const token = req.body.token ||  req.headers['access-token'];


    if(!token ){
        return res.status(403).send("A token is require for authentication")
    }
    try{
        const decoded = jwt.verify(token, process.env.TOKEN);
        req.user = decoded;
    }catch(error){
        return res.status(401).send("invalid token")
    }

    return next();
}
module.exports = verifyToken;
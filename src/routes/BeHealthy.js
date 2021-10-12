const router = require("express").Router()

router.get('/health',  (req, res)=>{
    return res.status(200).send({status:" Backend is healthy"})

})

module.exports = router
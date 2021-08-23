const router = require('express').Router();
const { PrismaClient } = require("@prisma/client")
const { users } = new PrismaClient()



router.get('/users', async(req, res) => {
    const result = await users.findMany()
    return res.send(result)
})

router.post('/register', async (req, res) => {
    const result = await users.create({
        data: req.body,
    })
    return res.send(result)
})
router.put('/edituser/:id', async (req, res) => {
    let id = req.params.id 
   const result = await users.update({
     data : req.body,
     where : {UserID:id }
 })
  return res.send(result)
})
router.delete("/deleteuser/:id",async(req, res)=>{
    const id = req.params.id
    const result = await users.delete({
       where : {UserID: id}
    })
    return res.send(result)
})

module.exports = router;
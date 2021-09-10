const router = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const { inventory_sticker } = new PrismaClient()



router.get('/sticker', async (req, res) => {
    const result = await inventory_sticker.findMany()
    return res.send(result)
})
router.post('/addsticker', async (req, res) => {
  const result = await inventory_sticker.create({
  data: req.body,
})
return res.send(result)
})

module.exports = router
const router = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const { item_Sticker } = new PrismaClient()



router.get('/sticker', async (req, res) => {
    const result = await item_Sticker.findMany()
    return res.send(result)
})
router.post('/addsticker', async (req, res) => {
  const result = await item_Sticker.createMany({
  data: req.body,
})
return res.send(result)
})

module.exports = router
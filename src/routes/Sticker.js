const router = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const { item_Sticker } = require('../models/model')
const { sticker } = require('../models/model') 



router.get('/sticker', async (req, res) => {
  const result = await sticker.findMany()
  return res.status(200).send(result)
})
router.post('/addsticker', async (req, res) => {
  const { ItemID, StickerID } = req.body
  const result = await item_Sticker.createMany({
    data: {
      ItemID: ItemID,
      StickerID: StickerID,
    }
  })
  const oldsticker = await item_Sticker.findFirst({
    where: { StickerID: StickerID }
  })
  if (oldsticker) {
    return res.status(401).send({ msg: "Sticker is already exist" })
  }

  return res.status(200).send(result)
})

module.exports = router
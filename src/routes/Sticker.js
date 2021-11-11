const router = require("express").Router()
const path = require('path');
const { item_Sticker } = require('../models/model')
const { sticker } = require('../models/model') 



router.get('/sticker', async (req, res) => {
  const result = await sticker.findMany()
  return res.status(200).send(result)
})

router.get('/stickerimage/:imgname', async (req, res)=>{
  let imgname = req.params.imgname
  let pathfile = path.join(__dirname + "../../../public/sticker/" + imgname + ".png")
    return res.status(200).sendFile(pathfile)
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
    return res.status(500).send({ msg: "Sticker is already exist" })
  }

  return res.status(200).send(result)
})

module.exports = router
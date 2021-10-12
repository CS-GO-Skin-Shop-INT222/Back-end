const router = require("express").Router()
const { item } = require('../models/model')
const { item_Sticker } = require('../models/model')
const dayjs = require("dayjs")
let lastUpdate = dayjs(Date.now()).format()


router.get('/allItem', async (req, res) => {
  const result = await  item.findMany({
     include: {
      WeaponSkin:{include:{
        Skin :{select:{SkinName: true }},
        Weapon:{select:{WeaponName: true}}
      }},
      Users: { select: { Name: true, Email: true } },
      Item_Sticker: { include: { Sticker: { select: { StickerName: true } } } }
    }
  })
    
  return res.send(result)
})

router.get('/getitem/:id', async (req, res) => {
  const id = Number(req.params.id)
  const result = await item.findUnique({
    where: { ItemID: id },
    include: {
      WeaponSkin:{include:{
        Skin :{select:{SkinName: true }},
        Weapon:{select:{WeaponName: true}}
      }},
      Users: { select: { Name: true, Email: true } },
      Item_Sticker: { include: { Sticker: { select: { StickerName: true } } } }
    }
  })
  return res.send(result)
})

router.post('/addItem', async (req, res) => {
  let { Price, Description, UserID, WeaponSkinID , Stickers ,Publish} = req.body
  if (!( Price && Description && WeaponSkinID && UserID && Publish)) {
    return res.status(400).send("input your info")
  }
  let result = await item.create({
    data: {
      Price: Price,
      Description: Description,
      Date: lastUpdate,
      WeaponSkinID:WeaponSkinID,
      UserID: UserID,
      Publish: Publish
    }
  })
  
  for (let i = 0; i < Stickers.length; i++) {
    await item_Sticker.createMany({
      data: {
        ItemID: result.ItemID,
        StickerID: Stickers[i].id
      }
    })
  }
  return res.send("successfully")
})

router.put('/editItem/:id', async (req, res) => {
  let id = Number(req.params.id)
  const result = await item.updateMany({
    data: req.body,
    where: { ItemID: id }
  })
  if (result.count == 0) {
    return res.status(400).send("don't have item")
  }
  return res.send(result)
})
router.delete("/deleteItem/:id", async (req, res) => {
  const id = Number(req.params.id)
  const result = await item.delete({
    where: { ItemID: id }
  })
  return res.send("Delete successfully" + result)
})

module.exports = router;
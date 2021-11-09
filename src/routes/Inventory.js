const router = require("express").Router()
const { item } = require('../models/model')
const { item_Sticker } = require('../models/model')
const dayjs = require("dayjs")
let lastUpdate = dayjs(Date.now()).format()


router.get('/allItem', async (req, res) => {
  const result = await item.findMany({
    include: {
      WeaponSkin: {
        include: {
          Skin: { select: { SkinName: true } },
          Weapon: { select: { WeaponName: true } }
        }
      },
      Users: { select: { Name: true, Email: true } },
      Item_Sticker: { include: { Sticker: { select: { StickerName: true } } } }
    }
  })

  return res.status(200).send(result)
})
router.get('/MyItem/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const result = await item.findMany({
      where: { UserID: id },
      include: {
        WeaponSkin: {
          include: {
            Skin: { select: { SkinName: true } },
            Weapon: { select: { WeaponName: true } }
          }
        },
        Users: { select: { Name: true, Email: true } },
        Item_Sticker: { include: { Sticker: { select: { StickerName: true } } } }
      }
    })
    return res.status(200).send(result)
  } catch (error) {
    res.status(401).end("error")
  }
})


router.get('/getitem/:id', async (req, res) => {
  const id = Number(req.params.id)
  const result = await item.findUnique({
    where: { ItemID: id },
    include: {
      WeaponSkin: {
        include: {
          Skin: { select: { SkinName: true } },
          Weapon: { select: { WeaponName: true } }
        }
      },
      Users: { select: { Name: true, Email: true } },
      Item_Sticker: { include: { Sticker: { select: { StickerName: true } } } }
    }
  })
  return res.send(result)
})

router.post('/addItem', async (req, res) => {
  let { Price, Description, UserID, WeaponSkinID, Stickers } = req.body
  if (!(Price && Description && WeaponSkinID && UserID)) {
    return res.status(401).send({ msg: "Please input item information!" })
  }
  let result = await item.create({
    data: {
      Price: Price,
      Description: Description,
      Date: lastUpdate,
      WeaponSkinID: WeaponSkinID,
      UserID: UserID,
    }
  })
  console.log(result)
  for (let i = 0; i < Stickers.length; i++) {
    await item_Sticker.createMany({
      data: {
        ItemID: result.ItemID,
        StickerID: Stickers[i].id
      }
    })
  }
  return res.status(200).send({ msg: "Create successfully" })
})

router.put('/editItem/:id', async (req, res) => {
  let id = Number(req.params.id)
  const result = await item.updateMany({
    data: req.body,
    where: { ItemID: id }
  })
  if (result.count == 0) {
    return res.status(401).send({ msg: "Don't have item" })
  }
  return res.send(result)
})

router.put('/sellItem/:id', async (req, res) => {
  let id = Number(req.params.id)
  const result = await item.update({
    where: { ItemID: id },
    data: { Publish: true }
  })
  if (result.count == 0) {
    return res.status(401).send({ msg: "Don't have item" })
  }
  if(result.Publish=true){
    return res.status(401).send({ msg: "the item is sell" })
  
  }
  return res.send({ msg: "this item is selling!" })
})


router.delete("/deleteItem/:id", async (req, res) => {
  const id = Number(req.params.id)
  const result = await item.deleteMany({
    where: { ItemID: id }
  })
  if (result.count == 0) {
    return res.status(401).send({ msg: "Don't have item" })
  }
  return res.status(200).send({ msg: "Delete successfully" + result })
})

module.exports = router;
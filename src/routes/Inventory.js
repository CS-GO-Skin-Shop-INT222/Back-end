const router = require("express").Router()
const { item } = require('../models/model')
const { item_Sticker } = require('../models/model')
const dayjs = require("dayjs")
let lastUpdate = dayjs(Date.now()).format()
const { verifyTokenUser } = require('../middleware/auth')

router.get('/allItem',verifyTokenUser, async (req, res) => {

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
router.get('/MyItem/:id/:page',verifyTokenUser, async (req, res) => {
  try {
    const calSkip = (page, numberOfItem) => {
      return (page - 1) * numberOfItem
    }
    const CalPage = (item, numberOfItem) => {
      return Math.ceil(item / numberOfItem)
    }
    let page = Number(req.params.page)
    let numberOfItem = 9
    const id = Number(req.params.id)
    const result = await item.findMany({
      skip: calSkip(page, numberOfItem),
      take: numberOfItem,
      where: { UserID: id , Publish : false},
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
    const totalItem = await item.count({
      where: { UserID: id, Publish : false}
    })
  
    return res.status(200).send({ data: result, page: page, totalpage: CalPage(totalItem, numberOfItem) })
  } catch (error) {
    res.status(500).end({ error: error.message })
  }
})

router.get('/MyItemselling/:id/:page',verifyTokenUser, async (req, res) => {
  try {
    const calSkip = (page, numberOfItem) => {
      return (page - 1) * numberOfItem
    }
    const CalPage = (item, numberOfItem) => {
      return Math.ceil(item / numberOfItem)
    }
    let page = Number(req.params.page)
    let numberOfItem = 9
    const id = Number(req.params.id)
    const result = await item.findMany({
      skip: calSkip(page, numberOfItem),
      take: numberOfItem,
      where: { UserID: id , Publish : true},
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
    const totalItem = await item.count({
      where: { UserID: id, Publish : true}
    })
    return res.status(200).send({ data: result, page: page, totalpage: CalPage(totalItem, numberOfItem) })
    
  } catch (error) {
    res.status(500).end({ error: error.message})
  }
})

router.get('/getitem/:id',verifyTokenUser, async (req, res) => {
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
  return res.status(200).send(result)
})

router.post('/addItem',verifyTokenUser, async (req, res) => {
  let { Price, Description, UserID, WeaponSkinID, Stickers } = req.body
  if (!(Price && Description && WeaponSkinID && UserID)) {
    return res.status(500).send({ msg: "Please input item information!" })
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

router.put('/editItem/:id',verifyTokenUser, async (req, res) => {
  let id = Number(req.params.id)
  let { Price , Description } = req.body
  const result = await item.update({ 
    where: { ItemID: id },
    data: {Price : Price , Description :Description}
   
  })
  if (result.count == 0) {
    return res.status(400).send({ msg: "Don't have item" })
  }
  return res.status(200).send(result)
})

router.put('/sellItem/:id',verifyTokenUser, async (req, res) => {
  let id = Number(req.params.id)
  const result = await item.update({
    where: { ItemID: id },
    data: { Publish: true }
  })
  if (result.count == 0) {
    return res.status(404).send({ msg: "Don't have item" })
  }
  if(result.Publish=true){
    return res.status(400).send({ msg: "the item is sell" })
  
  }
  return res.status(200).send({ msg: "this item is selling!" })
})
router.put('/cancelsales/:id',verifyTokenUser, async (req, res) => {
  let id = Number(req.params.id)
  const result = await item.updateMany({
    data: req.body,
    where: { ItemID: id },
    data: { Publish: false }
  })
  if (result.count == 0) {
    return res.status(404).send({ msg: "Don't have item" })
  }
  if(result.Publish=true){
    return res.status(404).send({ msg: "this item is not sell" })
  
  }
  return res.status(200).send({ msg: "cancel finish!" })
})

router.delete("/deleteItem/:id",verifyTokenUser, async (req, res) => {
  const id = Number(req.params.id)
  const result = await item.deleteMany({
    where: { ItemID: id }
  })
  if (result.count == 0) {
    return res.status(404).send({ msg: "Don't have item" })
  }
  return res.status(200).send({ msg: "Delete successfully" + result })
})

module.exports = router;
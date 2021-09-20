const router = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const { inventory } = new PrismaClient()
const { inventory_sticker } = new PrismaClient()
const dayjs = require("dayjs")
let lastUpdate = dayjs(Date.now()).format()


router.get('/allItem', async (req, res) => {
  const result = await inventory.findMany({
    include: {
      users: { select: { Name: true, Email: true } },
      typeofitem: { select: { TypeName: true } },
      inventory_sticker: { include: { sticker: { select: { StickerName: true } } } }
    }
  })
  return res.send(result)
})

router.get('/getitem/:id', async (req, res) => {
  const id = Number(req.params.id)
  const result = await inventory.findUnique({
    where: { ItemID: id },
    include: {
      users: { select: { Name: true, Email: true } },
      typeofitem: { select: { TypeName: true } },
      inventory_sticker: { include: { sticker: { select: { StickerName: true } } } }
    }
  })
  return res.send(result)
})

router.post('/addItem', async (req, res) => {
  let { Name_item, Price, Description, UserID, TypeID, Stickers } = req.body
  if (!(Name_item && Price && Description && TypeID && UserID)) {
    return res.status(400).send("input your info")
  }
  let result = await inventory.create({
    data: {
      Name_item: Name_item,
      Price: Price,
      Description: Description,
      Date: lastUpdate,
      UserID: UserID,
      TypeID, TypeID
    }
  })
  console.log(result)
  for (let i = 0; i < Stickers.length; i++) {
    await inventory_sticker.createMany({
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
  const result = await inventory.updateMany({
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
  const result = await inventory.delete({
    where: { ItemID: id }
  })
  return res.send("Delete successfully" + result)
})

module.exports = router;
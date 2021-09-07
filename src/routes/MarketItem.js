const router = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const { marketitem } = new PrismaClient()
const {marketitem_sticker} = new PrismaClient()
const dayjs = require("dayjs")
let lastUpdate = dayjs(Date.now()).format()


router.get('/allItem', async (req, res) => {
  const result = await marketitem.findMany({
    include: {
      users :{select: { Name: true , Email: true}},
      typeofitem:{select: { TypeName : true}},
      marketitem_sticker:{include:{sticker:{select:{StickerName:true}}}}
    }
  })
  return res.send(result)
})

router.post('/addItem', async (req, res) => {
  let { Name_item, Price, Description, UserID, TypeID , Stickers } = req.body
  if (!(Name_item && Price && Description && TypeID && UserID)) {
    return res.status(400).send("input your info")
  }
  let result = await marketitem.create({
    data: {
      Name_item: Name_item,
      Price: Price,
      Description: Description,
      Date: lastUpdate,
      UserID: UserID,
      TypeID, TypeID,
    }
  })
 console.log(result)
for(let i = 0 ; i < Stickers.length ; i++ ){
  await marketitem_sticker.createMany({
    data: {
      ItemID : result.ItemID,
      StickerID : Stickers[i].id
    }
  })
}

  return res.send("successfully")
})

router.put('/editItem/:id', async (req, res) => {
  let id = Number(req.params.id)
  const result = await marketitem.update({
    data: req.body,
    where: { ItemID: id }
  })
  return res.send(result)
})
router.delete("/deleteItem/:id", async (req, res) => {
  const id = Number(req.params.id)
  const result = await marketitem.delete({
    where: { ItemID: id }
  })
  return res.send("Delete successfully")
})

module.exports = router;
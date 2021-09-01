const router = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const { marketitem } = new PrismaClient()
const dayjs = require("dayjs")
let lastUpdate = dayjs(Date.now()).format()


router.get('/allItem', async (req, res) => {
  const result = await marketitem.findMany({
    include: {
      users: true,
      typeofitem: true
    }
  })
  return res.send(result)
})

router.post('/addItem', async (req, res) => {
  let { Name_item, Price, Description, UserID, TypeID } = req.body
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
      TypeID, TypeID
    }
  })
  return res.send("successfully")
})



router.put('/editItem/:id', async (req, res) => {
  let id = req.params.id
  const result = await marketItem.update({
    data: req.body,
    where: { ItemID: id }
  })
  return res.send(result)
})
router.delete("/deleteItem/:id", async (req, res) => {
  const id = req.params.id
  const result = await marketItem.delete({
    where: { ItemID: id }
  })
  return res.send(result)
})

module.exports = router;
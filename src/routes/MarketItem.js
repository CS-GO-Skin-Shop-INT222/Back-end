const router = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const { marketItem } = new PrismaClient()
const dayjs = require("dayjs")
let lastUpdate = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss')


router.get('/allItem', async (req, res) => {
  const result = await marketItem.findMany()
  return res.send(result)
})

router.post('/addItem', async (req, res) => {
  const result = await marketItem.create({
      data: req.body,
  })
  try {
      return res.send(result)
  } catch {
      res.status(400).send(err);
  }
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
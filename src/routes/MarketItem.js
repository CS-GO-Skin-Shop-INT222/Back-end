const router = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const { marketitem } = new PrismaClient()
const {inventory} = new PrismaClient()


router.get('/allmarket', async (req, res) => {
    const result = await marketitem.findMany({
      include: {
      inventory:{select:{Name_item: true ,typeofitem: true ,
        Description: true ,Price: true,inventory_sticker: true ,users:{select:{Name : true ,Email : true}}}}
      
      }
    })
    return res.send(result)
})

router.get('/getitem/:id', async (req, res) => {
  const id = Number(req.params.id)
  const result = await marketitem.findUnique({
    where: {  MarketItemID: id },
    include: {
      inventory:{select:{Name_item: true ,typeofitem: true ,
        Description: true ,Price: true,inventory_sticker: true ,users:{select:{Name : true ,Email : true}}}}
      }
  })
  return res.send(result)
  console.log(result)
})

router.post('/addmarket', async (req, res) => {
    const result = await marketitem.create({
    data: req.body,
  })
  return res.send(result)
  })

module.exports = router;
const router = require("express").Router()
const {item} = require('../models/model')


router.get('/allmarket', async (req, res) => {  
  const result = await item.findMany({
    where:{Publish : true},
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
    where: {  MarketItemID: id , Publish : true },
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

router.put('/buyitem', async (req, res) => {
    const result = await marketitem.create({
    data: req.body,
  })
  return res.send(result)
  })

module.exports = router;
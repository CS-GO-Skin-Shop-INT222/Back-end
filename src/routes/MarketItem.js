const router = require("express").Router()
const {item} = require('../models/model')


router.get('/allmarket/:page', async (req, res) => {
  const calSkip = (page , numberOfItem ) => {
    return (page - 1) * numberOfItem
  }  
  const CalPage = (item, numberOfItem ) => {
    return Math.ceil(item / numberOfItem)
  }
  let page = Number(req.params.page)
  let numberOfItem = 9
  const result = await item.findMany({
    skip: calSkip(page , numberOfItem),
    take: numberOfItem,
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
    const totalItem = await item.count()
    return res.status(200).send({data:result,page:page, totalpage:CalPage(totalItem, numberOfItem)})
})
router.get('/filterType/:id/:page', async (req, res) => {
  const id = req.params.id
  const calSkip = (page , numberOfItem ) => {
      return (page - 1) * numberOfItem
    }  
    const CalPage = (item, numberOfItem ) => {
      return Math.ceil(item / numberOfItem)
    }
    let page = Number(req.params.page)
    let numberOfItem = 9    
  const result = await item.findMany({
      skip: calSkip(page , numberOfItem),
      take: numberOfItem,
      where:{WeaponSkin:{Weapon:{TypeID : id }},  Publish : true}
  })
  const totalItem = await item.count()
  return res.status(200).send({data:result,page:page, totalpage:CalPage(totalItem, numberOfItem)})
})

router.get('/filterWeapon/:id/:page',async (req, res)=>{
  const id = req.params.id
  const calSkip = (page , numberOfItem ) => {
      return (page - 1) * numberOfItem
    }  
    const CalPage = (item, numberOfItem ) => {
      return Math.ceil(item / numberOfItem)
    }
    let page = Number(req.params.page)
    let numberOfItem = 9    
  const result = await item.findMany({
      skip: calSkip(page , numberOfItem),
      take: numberOfItem,
      where:{WeaponSkin:{Weapon:{WeaponID : id }},  Publish : true}
  })
  const totalItem = await item.count()
  return res.status(200).send({data:result,page:page, totalpage:CalPage(totalItem, numberOfItem)})
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
  return res.status(200).send(result)
})

router.put('/buyitem', async (req, res) => {
    const result = await marketitem.create({
    data: req.body,
  })
  return res.send(result)
  })

module.exports = router;
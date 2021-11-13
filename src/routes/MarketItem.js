const router = require("express").Router()
const { item } = require('../models/model')
const { users } = require('../models/model')
const { verifyTokenUser } = require('../middleware/auth')


router.get('/allmarket/:page', async (req, res) => {
  const calSkip = (page, numberOfItem) => {
    return (page - 1) * numberOfItem
  }
  const CalPage = (item, numberOfItem) => {
    return Math.ceil(item / numberOfItem)
  }
  let page = Number(req.params.page)
  let numberOfItem = 9
  const result = await item.findMany({
    skip: calSkip(page, numberOfItem),
    take: numberOfItem,
    where: { Publish: true },
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
  const totalItem = await item.count()
  return res.status(200).send({ data: result, page: page, totalpage: CalPage(totalItem, numberOfItem) })
})
router.get('/filterType/:id/:page', async (req, res) => {
  const id = req.params.id
  const calSkip = (page, numberOfItem) => {
    return (page - 1) * numberOfItem
  }
  const CalPage = (item, numberOfItem) => {
    return Math.ceil(item / numberOfItem)
  }
  let page = Number(req.params.page)
  let numberOfItem = 9
  const result = await item.findMany({
    skip: calSkip(page, numberOfItem),
    take: numberOfItem,
    where: { WeaponSkin: { Weapon: { TypeID: id } }, Publish: true },
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
  const totalItem = await item.count()
  return res.status(200).send({ data: result, page: page, totalpage: CalPage(totalItem, numberOfItem) })
})

router.get('/filterWeapon/:id/:page', async (req, res) => {
  const id = req.params.id
  const calSkip = (page, numberOfItem) => {
    return (page - 1) * numberOfItem
  }
  const CalPage = (item, numberOfItem) => {
    return Math.ceil(item / numberOfItem)
  }
  let page = Number(req.params.page)
  let numberOfItem = 9
  const result = await item.findMany({
    skip: calSkip(page, numberOfItem),
    take: numberOfItem,
    where: { WeaponSkin: { Weapon: { WeaponID: id } }, Publish: true },
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
  const totalItem = await item.count()
  return res.status(200).send({ data: result, page: page, totalpage: CalPage(totalItem, numberOfItem) })
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
  return res.status(200).send(result)
})

router.put('/buyItem/:id', verifyTokenUser, async (req, res) => {
  const id = Number(req.params.id)
  const itemtosell = await item.findFirst({
    where: { ItemID: id }
  })
  if(!itemtosell){
    return res.status(500).send({ msg: "noting item"})
  }
  let userloginCredit = await users.findFirst({
    where:{UserID :req.user.UserID},
    select:{Credit:true}
  })
  if(itemtosell.UserID == req.user.UserID){
    return res.status(500).send({ msg: "item is your" })
  }
  if (itemtosell.Price > userloginCredit) {
    return res.status(500).send({ msg: "Credit is not enough" })
  }
  let expendcredit = await users.update({
    where: { UserID: req.user.UserID },
    data: { Credit:{decrement:itemtosell.Price} }
  })
  let receivecredit  = await users.update({
    where: { UserID: itemtosell.UserID },
    data: { Credit: { increment: itemtosell.Price } }
  })
  let changeowner = await item.update({
    where: { ItemID: id },
    data: { UserID: req.user.UserID , Publish:false}
  })
  
  let result = await item.findFirst({
    where: { ItemID:id}
  })
  return res.status(200).send(result)
})

module.exports = router;
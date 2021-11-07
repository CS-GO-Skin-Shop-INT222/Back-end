const router = require("express").Router()
const { skin, item } = require('../models/model')
const { typeOfWeapon } = require('../models/model')
const { weapon } = require('../models/model')
const { weaponSkin } = require('../models/model')

router.get('/showweapon/:id', async (req, res) => {
    const id = req.params.id
    const result = await weaponSkin.findMany({
        where: { WeaponID: id },
        include: {
            Skin: { select: { SkinName: true } }
        }

    })
    return res.status(200).send({ Weapon: result })
})

router.get('/showskin/:id', async (req, res) => {
    const id = req.params.id
    const result = await weaponSkin.findMany({
        where: { SkinID: id },
        include: {
            Weapon: { select: { WeaponName: true } }
        }
    })
    return res.status(200).send({ Weapon: result })
})

router.get('/weapon/:id', async (req, res) => {
    const id = req.params.id
    const result = await weapon.findMany({
        where: { TypeID: id }
    })
    return res.send({ Weapon: result })
})

router.get('/allweaponskin', async (req, res) => {
    const result = await weaponSkin.findMany()
    return res.status(200).send({ msg: 'all skin ', Skin: result })
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



router.get('/allskin', async (req, res) => {
    const result = await skin.findMany()
    return res.status(200).send({ msg: 'all skin ', Skin: result })
})
router.get('/alltype', async (req, res) => {
    const result = await typeOfWeapon.findMany()
    return res.status(200).send({ msg: 'all type ', Type: result })
})
router.get('/allweapon', async (req, res) => {
    const result = await weapon.findMany()
    return res.status(200).send({ msg: 'all weapon ', Weapon: result })
})
module.exports = router;

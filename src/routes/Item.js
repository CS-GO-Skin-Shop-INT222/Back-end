const router = require("express").Router()
const { skin } = require('../models/model')
const { typeOfWeapon } = require('../models/model')
const { weapon } = require('../models/model')
const { weaponSkin } = require('../models/model')

router.get('/skin/:id', async (req, res) => {
    const id = req.params.id
    const result = await weaponSkin.findMany({
        where: { WeaponID: id },
        include: {
            Skin: { select: { SkinName: true } }
        },

    })
    return res.status(200).send({ Skin: result })
})

router.get('/weapon/:id', async (req, res) => {
    const id = req.params.id
    const result = await weapon.findMany({
        where: { TypeID: id }
    })
    return res.send({ Weapon: result })
})

router.get('/allskin', async (req, res) => {
    const result = await skin.findMany()
    return res.status(200).send({ msg: 'all skin ', Skin: result })
})
router.get('/alltype', async (req, res) => {
    const result = await typeOfWeapon.findMany()
    return res.send({ msg: 'all type ', Type: result })
})
router.get('/allweapon', async (req, res) => {
    const result = await weapon.findMany()
    return res.send({ msg: 'all weapon ', Weapon: result })
})
module.exports = router;

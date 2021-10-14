const router = require("express").Router()
const { skin } = require('../models/model')
const { typeOfWeapon } = require('../models/model')
const { weapon } = require('../models/model')

router.get('/skin', async (req, res) => {
    const result = await skin.findMany()
    return res.send({msg:'all skin ', Skin :result})
})
router.get('/type', async (req, res) => {
    const result = await typeOfWeapon.findMany()
    return res.send({msg:'all type ', Type :result})
})

router.get('/weapon', async (req, res) => {
    const result = await weapon.findMany()
    return res.send({msg:'all weapon ', Weapon :result})
})


module.exports = router;

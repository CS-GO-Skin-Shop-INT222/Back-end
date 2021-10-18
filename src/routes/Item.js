const router = require("express").Router()
const { skin } = require('../models/model')
const { typeOfWeapon } = require('../models/model')
const { weapon } = require('../models/model')
const {weaponSkin } = require('../models/model')

router.get('/skin/:id', async (req, res) => {
    const id = req.params.id
    const result = await weaponSkin.findMany({
        where:{WeaponID:id},
        include:{
            Skin:{select:{SkinName: true}}
        },
        
    })
    console.log(result)
    return res.status(200).send({ Skin :result})
})

router.get('/weapon/:id', async (req, res) => {
    const id = req.params.id
    const result = await weapon.findMany({
        where:{TypeID :id}
    })
    return res.send({ Weapon :result})
})





module.exports = router;

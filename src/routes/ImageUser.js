const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { users } = require('../models/model')
const { verifyTokenUser } = require('../middleware/auth');



const storage = multer.diskStorage({
    destination: './public/upload',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

    const mimetype = filetypes.test(file.mimetype)

    if (mimetype) {
        return cb(null, true);
    } else {
        cb('error: image only')

    }
}

const upload = multer({
    storage: storage,
    limits: { fieldSize: 500 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    }
})


router.get('/getImage/:id', async (req, res) => {
    const id = Number(req.params.id)
    const result = await users.findFirst({
        where:{ UserID: id },
        select:{ImageUser: true}  
    })
    if(!result.ImageUser){
        return res.status(200).send({ msg: "Don't have ImageUser!"})
    }
    let pathfile =path.join(__dirname + "../../../public/upload/" + result.ImageUser )
    if(!fs.existsSync(pathfile) ){
        return res.status(200).send({ msg: "ImageUser is missing!"})
    }
    return res.status(200).sendFile(pathfile) 
})

router.post('/uploadImage', verifyTokenUser, upload.single('avatar'), async (req, res) => {
    const file = req.file
    const result = await users.update({
        data: { ImageUser: file.filename },
        where: { UserID: req.user.UserID }
    })
    if (result.count == 0) {
        return res.status(404).send("Don't have image")
    }
    return res.status(200).send({ msg: "uploadImage successfully! " })
})

module.exports = router
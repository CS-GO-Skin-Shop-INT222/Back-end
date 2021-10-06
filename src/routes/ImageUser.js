const router = require('express').Router();
const multer = require('multer');
const path = require ('path')
const { PrismaClient } = require('@prisma/client')
const users = new PrismaClient().users
const auth = require('../middleware/auth')


const storage = multer.diskStorage({
    destination: './public/upload',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

  function checkFileType(file,cb){
    const filetypes =  /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

    const mimetype = filetypes.test(file.mimetype)

    if(mimetype ){
        return cb(null ,true);
    }else{
        cb('error: image only')

    }
}

const upload = multer({
    storage:storage,
    limits : {fieldSize:500},
    fileFilter: function(req, file,cb){
        checkFileType(file,cb)
    }
})
router.get('/getImage' ,auth , async (req, res)=>{
    const ImageFile = './public/upload'
    const {ImageUser}= req.body
    if(ImageFile == ImageUser){
        return res.status(200).send(ImageFile)
    }
    console.log(ImageFile)
   return res.status(200).send({user:req.user})
})

router.post('/uploadImage',auth, upload.single('avatar') , async (req, res)=>{
    const file = req.file
    console.log(req.user)
    const result = await users.update({
     data:{ImageUser: file.filename},
        where: { UserID: req.user.UserID}
    })
    if (result.count == 0) {
        return res.status(400).send("don't have image")
      }
      return res.status(200).send({msg:"uploadImage successfully! " })
})

module.exports = router
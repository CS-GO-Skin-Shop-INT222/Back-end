const { PrismaClient }=require("@prisma/client");
const {skin , sticker,typeOfWeapon ,userTokens ,users ,weapon ,item ,item_Sticker, weaponSkin, admin , adminTokens }=new PrismaClient()

module.exports.admin = admin
module.exports.adminTokens = adminTokens
module.exports.item = item
module.exports.skin = skin
module.exports.weaponSkin= weaponSkin
module.exports.item_Sticker = item_Sticker
module.exports.sticker = sticker
module.exports.weapon = weapon
module.exports.typeOfWeapon= typeOfWeapon
module.exports.userTokens= userTokens
module.exports.users = users
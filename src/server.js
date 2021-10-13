require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const { API_PORT } = process.env
const port = process.env.PORT || API_PORT;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin : process.env.ORIGIN,
    methods:['GET', 'POST', 'PUT', 'DELETE' , 'HEAD' , 'OPTIONS'],
}))

///import routes
// const authRoute = require('./middleware/auth');
const inventory = require('./routes/Inventory')
// const marketitem = require('./routes/MarketItem')
const user = require('./routes/Users')
const sticker = require('./routes/Sticker')
const admin = require('./routes/Admin')
const ImageUser = require('./routes/ImageUser')
const health = require('./routes/BeHealthy')
const item =require('./routes/Item')
/// route middlewares
// app.use('/api/user', authRoute);
app.use('/api/admins',admin)
app.use('/api/inventory', inventory)
app.use('/api/item', item)
// app.use('/api/marketitem' , marketitem)
app.use('/api/user' ,user)
app.use('/api/stickeritem', sticker)
app.use('/api/imageusers', ImageUser)
app.use('/api',health)

app.listen(port, () => {
    console.log(`server running on port ${port}`)
})

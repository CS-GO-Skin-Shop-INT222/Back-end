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
const authRoute = require('./middleware/auth');
const inventory = require('./routes/Inventory')
const marketitem = require('./routes/MarketItem')
const user = require('./routes/Users')
const sticker = require('./routes/Sticker')

/// route middlewares
// app.use('/api/user', authRoute);
app.use('/api/inventory',authRoute, inventory)
app.use('/api/marketitem' , marketitem)
app.use('/api/user',user)
app.use('/api/stickeritem', sticker)

app.listen(port, () => {
    console.log(`server running on port ${port}`)
})

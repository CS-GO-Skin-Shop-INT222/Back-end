require("dotenv").config();
const express = require('express');
const app = express();
const { API_PORT } = process.env
const port = process.env.PORT || API_PORT;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

///import routes
//const authRoute = require('./middleware/auth');
const marketitem = require('./routes/MarketItem')
const user = require('./routes/Users')
const sticker = require('./routes/Sticker')

/// route middlewares
// app.use('/api/user', authRoute);
app.use('/api/marketitem' , marketitem)
app.use('/api/user',user)
app.use('/api/stickeritem', sticker)

app.listen(port, () => {
    console.log(`server running on port ${port}`)
})

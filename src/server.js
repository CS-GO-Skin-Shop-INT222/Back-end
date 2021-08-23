const express = require('express');
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

///import routes
const authRoute = require('./routes/auth');



/// route middlewares
app.use('/api/user', authRoute);



app.listen(5000, () =>{
    console.log('server run on port 5000')
})

const express = require('express');
const bodyparser = require('body-parser');
const passport = require('passport');
// const jsonwebtoken = require('jsonwebtoken');
const mongodb = require('mongodb');

//root
const user = require('./router/api/user');
const question = require ('./router/api/question')


const app = express();


// //Middelware for express
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

//mongodb
const db = require('./setup/mongodb').mongoURl;
// const question = require('./models/question');

//passport middelware

app.use(passport.initialize())

//confiq jwt
require ('./strategi/jsonwebtoken')(passport);

app.use(express.static('./public'));  // image

//test
app.get('/', (req,res) => {
    res.send('runing')
})


//runing router

app.use('/user', user);

app.use('/question', question);



const port = process.env.PORT || 3000;
app.listen(port,() => console.log(`App is runing at port ${port}`))



module.exports = app;






require('../config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
//parse
app.use( bodyParser.urlencoded( { extended : false } ) );

app.use( bodyParser.json() );
app.use( bodyParser.json() );
app.use( require('../routes/index') );

app.use( express.static( path.resolve( __dirname , '../public' ) ) );

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const mongoose = require('mongoose');

mongoose.connect('mongodb://yamil:Alejandro39@ds261755.mlab.com:61755/bzcocho', (err, res)=>{
    if(err) throw err;
});

app.listen(process.env.PORT, console.log('OK'));

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const { verificaTokenImg } = require('../middlewares/auth');

app.get( '/imagen/:tipo/:img', verificaTokenImg, ( req, res ) => {
  let tipo = req.params.tipo;
  let img = req.params.img;

  let pathNoImg = path.resolve( __dirname , '../assets/noimage.gif' );
  let pathImg = path.resolve( __dirname, `../uploads/${ tipo }/${ img }`);
  let response = pathNoImg;
  if( fs.existsSync( pathImg ) ){
    response = pathImg;
  }
  res.sendFile( response );
});

module.exports = app;

const express = require('express');
const { verificaToken, adminRole } = require('../middlewares/auth');
const bodyParser = require('body-parser');
const Categoria = require('../models/categoria');
const app = express();

app.use( bodyParser.urlencoded( { extended : false } ) );

app.use( bodyParser.json() );

app.get( '/categoria/:id', [ verificaToken, adminRole ], ( req, res ) => {

  let id = req.params.id;

  if( id === undefined ) {
    return res.status( 400 ).json({
      ok: false,
      error: {
        message: 'Ingresa un id.'
      }
    })
  }

  Categoria.findById( id )
  .exec( (err, categoriaDB) => {

    if( err ) {
      return res.status( 417 ).json({
        ok: false,
        err
      })
    }

    if( !categoriaDB ) {
      return res.status( 204 ).json({
        ok: false,
        error: {
          message: 'No existe una categoria con el id provisto.'
        }
      })
    }else{
      res.json({
        ok: true,
        response: categoriaDB
      })
    }

  })

});

app.get( '/categoria', [ verificaToken, adminRole ], ( req, res ) => {
  Categoria.find({})
  .populate('usuario', 'email nombre')
  .exec( (err, categoriaDB) => {
      if( err ) {
        return res.status( 417 ).json({
          ok: false,
          err
        })
      }

      if( !categoriaDB ) {
        return res.status( 204 ).json({
          ok: false,
          error: {
            message: 'La coleccion esta vacia.'
          }
        })
      }else{
        res.json({
          ok: true,
          response: categoriaDB
        })
      }
  })
});

app.post( '/categoria', [ verificaToken, adminRole ], ( req, res ) => {

    let categoria = new Categoria({
        descripcion: req.body.descripcion,
        usuario: req.usuario._id
    });

    if( categoria.descripcion === undefined ) {

        return res.status( 400 ).json({
          ok: false,
          error: {
            message: 'El campo descripcion se encuantra vacio.'
          }
        })

    }

    categoria.save( ( err, categoriaDB) => {

        if( err ) {
          return res.status( 500 ).json({
            ok: false,
            err
          })
        }

        res.json({
          ok: true,
          response: categoriaDB
        })
      })

});

app.put( '/categoria/:id', [ verificaToken, adminRole ], ( req, res ) => {
  let id = req.params.id;

  if( id === undefined ) {
    return res.status( 400 ).json({
      ok: false,
      error: {
        message: 'Ingresa un id'
      }
    })
  }

  Categoria.findByIdAndRemove( {_id: id }, { rawResult: true }, ( err, categoriaDB ) => {

    if( err ){
      res.status( 400 ).json({
        ok: false,
        err
      })
    }else {
      res.json({
        ok: categoriaDB.ok,
        response: categoriaDB.value
      })
    }
  })

})
module.exports = app;

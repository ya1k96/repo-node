const express = require('express');
const bodyParser = require('body-parser');
const { verificaToken } = require('../middlewares/auth');

const app = express();
let Producto = require('../models/productos');

app.use( bodyParser.urlencoded( { extended : false } )  );
app.use( bodyParser.json() );

app.get( '/producto/buscar/:termino', verificaToken, ( req, res ) => {
  let termino = req.params.termino;

  if( termino === undefined ) {
    return res.status( 400 ).json({ ok: false, response: 'Introduce el valor a buscar' })
  }

  let regex = new RegExp(termino, 'i');
  Producto.find({ nombre: regex })
    .populate('Categoria')
    .exec( ( err, productoDB ) => {
      if( err ){
        return res.status( 500 ).json({ ok: false, err });
      }

      if( productoDB.length === 0 ) {
        res.status( 403 ).json({ ok: true, response: 'Sin coincidencias.' })
      }else{
        res.json({ ok: true, productoDB });
      }
    })
})

app.route( '/producto', verificaToken )
  .get( ( req, res ) => {
    Producto.find({})
      .sort( 'nombre' )
      .exec( ( err, productoDB ) => {
        if( err ) { return res.status( 500 ).json({ ok: false, err }) }
        if( !productoDB ) {
          res.status( 403 ).json({
            ok: false,
            response: 'No existen colecciones'
          })
        }else{
          res.json({ ok: true, response: productoDB })
        }
      })
  })
  .post( ( req, res ) => {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUnitario,
        descripcion: body.descripcion,
        disponible: true
    })

    producto.save( ( err, categoriaDB ) => {
      if( err ) { return res.status( 500 ).json({ ok: false, err }) }
      if( !categoriaDB ) { res.status( 500 ).json({ ok:true, response: 'undefined'}) }
      else { res.json({ ok: true, response: categoriaDB }) }
    })
  })
app.route( '/producto/:id', verificaToken )
    .get( ( req, res ) => {
      let id = req.params.id;
      Producto.findById( id , ( err, productoDB ) => {
        if( err ) {
          return res.status( 400 ).json({
            ok: false,
            err
          })
        }

        if( !productoDB ) {
          res.json({
            ok: true,
            response: 'No existe en la base de datos'
          })
        }else{
          res.json({
            ok: true,
            productoDB
          })
        }
      })
    })
   .put( ( req, res ) => {
     let id = req.params.id;
     let body = req.body;

     if( id === undefined ){ return res.status( 400 ).json({ ok: false, response: 'Ingresa un id' }) }

     Producto.findByIdAndUpdate( id, body, { new: true, runValidators: true}, ( err, productoDB) => {
       if( err ){ res.status( 500 ).json({ ok:false, err }) }

       if( !productoDB ) { res.json({ ok: true, response: 'undefined' }) }
       else { res.json({ ok: true, response: productoDB }) }
     })
   })
   .delete( ( req, res ) => {
     let id = req.params.id;

     if( id === undefined ){ return res.status( 400 ).json({ ok: false, response: 'Ingresa un id' }) }

     Producto.findByIdAndUpdate( id, { disponible: false }, { new: true }, ( err, productoDB) => {
         if( err ){ res.status( 500 ).json({ ok:false, err }) }
         else{ res.json({ ok: true, response: productoDB }) }
     })
   })

module.exports = app;

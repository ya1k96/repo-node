const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/productos');
const path = require('path');
const fs = require('fs');

app.use(fileUpload());

let borrarArchivo = ( nombreImagen, tipo ) => {
  let pathImagen = path.resolve( __dirname + `../../uploads/${ tipo }/${ nombreImagen }` );
  if( fs.existsSync( pathImagen ) ) {
    fs.unlinkSync( pathImagen );
  }
}
let usuario = ( id, res, nombreFinal, archivo ) => {
  Usuario.findById({ _id: id })
    .exec( ( err, usuarioDB ) => {
    if( err ){
      borrarArchivo( nombreFinal, 'usuario' );
      return res.status( 500 ).json({ ok: false, err })
    }

    if( !usuarioDB ){
      borrarArchivo( nombreFinal, 'usuario' );
      return res.json({ ok: true, response: 'Usuario sin coincidencias' })
    }

    borrarArchivo( usuarioDB.img, 'usuario' );

    usuarioDB.img = nombreFinal;
    usuarioDB.save( ( err, usuarioGuardado ) => {
      if( err ){
        return res.status( 400 ).json({ ok: false, err })
      }

      archivo.mv( `uploads/usuario/${ nombreFinal }`, ( err ) => {
        if ( err ){
          return res.status( 500 ).json({ ok:false, err } );
        }

      });

      res.json({ ok: true, usuarioGuardado, img: nombreFinal });
    })
  });
}
let producto = ( id, res, nombreFinal, archivo ) => {
  Producto.findOne({ _id: id })
    .exec( ( err, productoDB ) => {
    if( err ){
      borrarArchivo( nombreFinal, 'producto' );
      return res.status( 500 ).json({ ok: false, err })
    }

    if( !productoDB ){
      borrarArchivo( nombreFinal, 'producto' );
      return res.json({ ok: true, response: 'Producto sin coincidencias' })
    }

    borrarArchivo( productoDB.img, 'producto' );

    productoDB.img = nombreFinal;
    productoDB.save( ( err, productoGuardado ) => {
      if( err ){
        return res.status( 400 ).json({ ok: false, err })
      }

      archivo.mv( `uploads/producto/${ nombreFinal }`, ( err ) => {
        if ( err ){
          return res.status( 500 ).json({ ok:false, err } );
        }
      });
      res.json({ ok: true, productoGuardado, img: nombreFinal });
    })
  });
}
app.put( '/upload/:tipo/:id', ( req, res ) => {
  let tipo = req.params.tipo;
  let id = req.params.id;
  if( id === undefined )
    return res.status( 400 ).json({ ok: false, error: 'Debes proveer un Id'})

  if( !req.files ){
    return res.status( 400 ).json({
      ok: false,
      error: 'No ingresaste un archivo.'
    })
  }
  //tipos de ruta validos
  let tiposValidos = [ 'usuario', 'producto' ];
  if( tiposValidos.indexOf( tipo ) < 0 ) {
    return res.status( 400 ).json({
      ok: false, error: 'Tipos validos ' + tiposValidos.join(', ')
     })
  }
  let archivo = req.files.archivo;
  //Extensiones validas
  let extensionesValidas = [ 'png', 'jpg', 'gif', 'jpeg' ];

  let nombreArchivo = archivo.name.split('.');
  let extension = nombreArchivo [ nombreArchivo.length - 1 ];

  if( extensionesValidas.indexOf( extension ) < 0 ){
    return res.status( 400 ).json({
      ok: false,
      error: 'Las extensiones permitidas son ' + extensionesValidas.join( ', ' )
    })
  }

  let nombreFinal = `${nombreArchivo[ 0 ]}-${ id }.${extension}`;

  if( tipo == 'usuario' ){
    usuario( id, res, nombreFinal, archivo );
  }else{
    producto( id, res, nombreFinal, archivo );
  }
})

module.exports = app;

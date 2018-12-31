const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/productos');
const path = require('path');
const fs = require('fs');

app.use(fileUpload());

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
  archivo.mv( `uploads/${ tipo }/${ nombreFinal }`, ( err ) => {
    if ( err )
      return res.status( 500 ).json({ ok:false, err } );

      imagenUsuario( id, res, nombreFinal);
  });
})

let imagenUsuario = ( id, res, nombreFinal ) => {
  Usuario.findById( id, ( err, usuarioDB ) => {
    if( err )
      return res.status( 500 ).json({ ok: false, err })

    if( !usuarioDB )
      res.json({ ok: true, response: 'Usuario sin coincidencias' })

    let pathImagen = path.resolve( __dirname + `../uploads/usuarios/${ usuarioDB.img }` );
    if( fs.existsSync( pathImagen ) ) {
      fs.unlinkSync( pathImagen );
    }

    usuarioDB.img = nombreFinal;
    usuarioDB.save( ( err, usuarioGuardado ) => {
      if( err )
        return res.status( 400 ).json({ ok: false, err })

      res.json({ ok: true, usuarioGuardado, img: nombreFinal });
    })
  });
}

module.exports = app;

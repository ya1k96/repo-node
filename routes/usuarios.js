const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');

//parse
app.use( bodyParser.urlencoded( { extended : false } ) );

app.use( bodyParser.json() );

const { 
    verificaToken,
    adminRole 
} = require('../middlewares/auth');

//    .get( [verificaToken, adminRole], ( req, res ) => {
        //
//            Usuario.find({ estado: true }, 'nombre email img role')                   
                    //
//                    .exec( (err, usuarioDB) => {
//                        if(err){
//                            return res.status(400).json({
//                                ok: false,
//                                err
//                            })
//                        }else{
//                             Usuario.count({ estado: true }, (err, count) =>{
//                                res.json({
//                                    ok: true,
//                                    res: usuarioDB,
//                                    cantidad: count
//                                });
//                             })
//                        }
//                    })
//
//        }
//         )
app.route('/usuario')
    .get( [verificaToken, adminRole], ( req, res ) => {
      
          Usuario.findOne({ estado: true }, 'email')                   
                  
                  .exec( (err, usuarioDB) => {
                      if(err){
                          return res.status(400).json({
                              ok: false,
                              err
                          })
                      }else{
                              res.json({
                                  ok: true,
                                  res: usuarioDB   
                              });                        
                      }
                  })
      }
       )

    .post( [verificaToken, adminRole], ( req, res ) => {
        let body =  req.body;

        let usuario = new Usuario({
            nombre: body.nombre,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10), 
            role: body.role
        })


        if( body.nombre === undefined ){
            res.status(400).json({
                ok:false,
                message: 'El nombre es necesario'
            });
        }else{
            usuario.save( (err, usuarioDB) => {
                if(err){
                    return res.status(400).json({
                        ok:false,
                        err: err.errors
                    });
                }
    
                res.json({
                    ok: true,
                    usuario: usuarioDB
                });
            } )
        }
    } )

    .put(verificaToken, adminRole, ( req, res ) => {
        let id = req.body.id;
        let body = _.pick( req.body , ['nombre','img','role','estado']);

        Usuario.findByIdAndUpdate( id, body, { new: true, runValidators: true } , ( err, usuarioDB ) => {
            res.json({ usuarioDB });
        })

    } )

    .delete(verificaToken, ( req, res ) => {
        let id = req.query.id;
        let body = _.pick( { estado: false }, ['estado']);
        Usuario.findByIdAndUpdate( id, body, { new: true } , ( err, usuarioDB ) => {
           if ( err ) {
                res.status(400).json({
                    ok: false,
                    err
                })
            }
            if( usuarioDB === null ) {
                console.log(usuarioDB);
                return res.status(400).json({
                    ok:false,
                    message: 'No existe el usuario dentro de la base de datos'
                })
            }
            res.json({
                ok: true,
                usuario_updated: usuarioDB
            }) 
        })
       
    } );

module.exports = app;
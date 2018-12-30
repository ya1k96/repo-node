const express =  require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');
const app = express();
const { verify } = require('../middlewares/auth')

    app.post('/login', (req, res) => {
        let body = req.body;

        Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
            if( err ){
                res.status(500).json({
                    ok: false,
                    err
                })
            }

            if ( !usuarioDB ){
                res.status(400).json({
                    ok:false,
                    err: {
                        message: 'Usuario o contraseña incorrecta'
                    }
                })
            }

            if( !bcrypt.compareSync( body.password, usuarioDB.password ) ){
                res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Usuario o contraseña incorrecta'
                    }
                })
            }
        //generacion de token
        let token = jwt.sign({
            usuario: usuarioDB
        }, 'secret', { expiresIn: '48h' })

            res.json({
                ok: true,
                user: usuarioDB,
                token
            })


        })
    })

    app.post('/google', async (req, res) => {

      let token = req.body.idtoken;

      let usuario = await verify( token )
          .catch((e) => {
            return res.status(403).json({
              ok: false,
              error:e
            })
          })

      Usuario.findOne( { email: usuario.email }, (err, usuarioDB ) => {
          if( err ) {
            return res.status(500).json({
              err
            })
          }

          if( usuarioDB ){

            if( usuarioDB.google === false ){
              return res.status(401).json({
                ok: false,
                error: {
                  message: 'Te has autenticado en otra cuenta con este email.'
                }
              })
            }else {
              //generacion de token
                let token = jwt.sign({
                    usuario: usuarioDB
                }, 'secret', { expiresIn: 60 * 300 * 100 })

                    res.json({
                        ok: true,
                        user: usuarioDB,
                        token
                    })
              }

          }else {
            let user = new Usuario();

            user.nombre = usuario.nombre;
            user.email = usuario.email;
            user.password = 'undefined';
            user.google = true;
            user.img = usuario.img;

            user.save( ( err, usuarioDB )  => {
                if( err ){
                  return res.status(400).json({
                    err
                  })
                }

                if( usuarioDB ){
                  res.json({
                    ok: true,
                    response: 'Usuario almacenado correctamente.'
                  })
                }

            })

            }


      })
      // res.json({
      //   res:usuario
      // })

    });

module.exports = app;

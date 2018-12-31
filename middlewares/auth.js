//===================
//Verificacion de token
//===================
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


let verificaToken = ( req, res, next ) => {
    let token = req.query.token;

    if( !token ){
        return res.status(400).json({
            ok:false,
            error: {
                message: 'Es necesario ingresar un token.'
            }
        })
    }

    jwt.verify(token, 'secret', (err, decoded) => {

        if( err ){
            return res.status(401).json({
                ok: false,
                message: 'Token no valido'
            })
        }

        req.usuario = decoded.usuario;
        next();
    });

}
let adminRole = (req, res, next) => {
    let user = req.usuario.role;
    console.log(user)
    if(user === 'ADMIN_ROLE'){
        next();
    }else{
        return res.status(401).json({
            ok: false,
            error: {
                message: 'No tiene permitido esta accion.'
            }
        })
    }

}
//===================
// configuracion de google
//===================
async function verify( token ) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  const payload = ticket.getPayload();
  console.log( payload.name )
  console.log( payload.email )
  console.log( payload.picture )
  return {
      nombre: payload.name,
      email: payload.email,
      img: payload.picture,
      google: true
  }
}

let verificaTokenImg = ( req, res, next ) => {
  let token = req.query.token;
  if( !token ){
      return res.status(400).json({
          ok:false,
          error: {
              message: 'Es necesario ingresar un token.'
          }
      })
  }

  jwt.verify(token, 'secret', ( err, decoded ) => {

      if( err ){
          return res.status(401).json({
              ok: false,
              message: 'Token no valido.'
          })
      }

      req.push({ usuario: decoded.usuario});
      next();
  });
}

module.exports = { verificaToken, adminRole, verify, verificaTokenImg };

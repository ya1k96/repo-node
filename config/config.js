
//=========================
//  PUERTO
//=========================

process.env.PORT  = process.env.PORT || 3000;

//=========================
//  ENTORNO
//=========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//=========================
// CLIENT_ID
//=========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '789343798725-aolfiiue92gq2s3f44lgenh8026hrbh1.apps.googleusercontent.com';
//=========================
//  BASE DE DATOS
//=========================

let mongobd;

if(process.env.NODE_ENV === 'dev'){

    mongobd = 'mongodb://localhost:27017/Bzcocho';
}else{

     mongobd = 'mongodb://yamil:Alejandro39@ds261755.mlab.com:61755/bzcocho';
}

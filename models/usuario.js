const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;
let roles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let usuarioSchema = new Schema({
    nombre:{
        type: String,
        required: [true, 'Nombre necesario']
    },
    email:{
        type: String,
        required:[true, 'Email necesario'],
        unique: true
    },
    password:{
        type: String,
        required: [true,'Constraseña obligatoria']
    },
    img:{
        type: String,
        required:false
    },
    role:{
        type: String,
        default:'USER_ROLE',
        required:false,
        enum: roles
    },
    estado:{
        type: Boolean,
        default:true
    },
    google:{
        type: Boolean,
        default:false
    }
});

usuarioSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser unico' } );

module.exports = mongoose.model('Usuario', usuarioSchema);
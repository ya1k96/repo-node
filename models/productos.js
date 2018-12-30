let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let productoSchema = new Schema({
  nombre: {
    type: String, required: [true, 'El nombre es requerido']
  },
  precioUni: {
    type: Number, required: [true, 'El precio unitario es requerido']
  },
  descripcion: {
    type: String, required: [true, 'La descripcion es necesaria']
  },
  disponible: {
    type: Boolean, required: [true, 'La disponibilidad de un producto es requerida']
  },
  categoria: {
    type: Schema.Types.ObjectId, ref: 'Categoria'
  },
  usuario: {
    type: Schema.Types.ObjectId, ref: 'Usuario'
  }
});

module.exports = mongoose.model( 'Producto', productoSchema );

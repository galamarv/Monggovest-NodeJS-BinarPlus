const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const KomoditasSchema = Schema({
    nama_ternak: String,
    foto: String,
    asal: String,
    harga: String
  });

  module.exports = mongoose.model('Komoditas',KomoditasSchema);

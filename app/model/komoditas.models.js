const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const KomoditasSchema = Schema({
    nama_ternak: String,
    foto: String,
    asal: String,
    harga: String,
    deskripsi: String,
    jumlah_lot: String,
    lot_tersedia: String
  });


  module.exports = mongoose.model('Komoditas',KomoditasSchema);

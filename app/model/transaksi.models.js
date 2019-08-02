const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const TransaksiSchema = Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    jumlah_lot: String,
    nama_lengkap: String,
    nomor_ktp: String,
    bank: String,
    harga: String,
    _komoditasId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Komoditas'},
    isVerified: { type: Boolean, default: false },
    email: String
  });

  module.exports = mongoose.model('Transaksi',TransaksiSchema);
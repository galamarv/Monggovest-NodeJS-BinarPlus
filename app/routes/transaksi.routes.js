module.exports = (app) => {
    const transaksi = require('../controllers/transaksi.controllers');
    var auth = require('../middleware/auth')
    
    app.post('/api/user/transaksi/', auth.isAuthenticated, transaksi.transaksi_post )
    app.get('/api/user/transaksi/', auth.isAuthenticated, transaksi.show_transaksi)
    app.post('/api/admin/transaksi/verifikasi',  auth.isAuthenticated, transaksi.verifikasi_transaksi)
    app.get('/api/admin/transaksi',auth.isAuthenticated, transaksi.show_transaksiAll)
    
}

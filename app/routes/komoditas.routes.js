module.exports = (app) => {
    const komoditas = require('../controllers/komoditas.controllers');
    var auth = require('../middleware/auth')
    
    app.post('/api/admin/post', auth.isAuthenticated, komoditas.komoditas_post )
    app.get('/api/user/komoditas',  komoditas.show_komoditas)
    app.get('/api/user/komoditas/:id',  komoditas.show_komoditas_detail)
    app.post('/api/user/komoditas/cari', komoditas.cari_komoditas)
    //app.get('/api/user/komoditas/:peternak', auth.isAuth, komoditas.komoditas_peternak)

    
}

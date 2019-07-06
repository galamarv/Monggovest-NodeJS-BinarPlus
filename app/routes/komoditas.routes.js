module.exports = (app) => {
    const komoditas = require('../controllers/komoditas.controllers');
    var auth = require('../middleware/auth')


    
    app.post('/api/admin/post', auth.isAuth, komoditas.komoditas_post )
    app.get('/api/user/komoditas',  komoditas.show_komoditas)
    app.get('/api/user/komoditas/:peternak', auth.isAuth, komoditas.komoditas_peternak)

    
}
module.exports = (app) => {
    const user = require('../controllers/user.controllers');
    var auth = require('../middleware/auth')


    
    app.post('/api/user/register', user.create_user)
    app.get('/api/user', auth.isAuthenticated, user.show_user)
    app.put('/api/user/', auth.isAuthenticated, user.update_user)
    app.post('/api/user/login', user.user_login)
    app.post('/api/admin/login/', user.admin_login)
    app.get('/confirmation/:token', user.konfirmasi)
    //app.post('/resend', user.resendTokenPost)
   
   

    
}

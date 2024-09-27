const express = require('express');
const routes = express.Router();
const controlToRoute = require('../controllers/controller');
// const upload = require('../config/multerConfig');
const passport = require('../config/passport');
const isAuth = require('../middleware/isAuth');


routes.get('/',isAuth, controlToRoute.defaultController);
routes.get('/signup', controlToRoute.signupController);
routes.post('/signup', controlToRoute.postSignupController);
routes.get('/login', controlToRoute.loginController);
routes.post('/login',passport.authenticate('local', {failureRedirect: '/login'}),controlToRoute.PostLoginController);
routes.get('/logout',controlToRoute.postLogout);
routes.get('/profile', controlToRoute.profileController);
// routes.post('/profile', controlToRoute.postProfileController);



module.exports = routes;
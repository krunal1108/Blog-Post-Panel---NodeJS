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

routes.get('/changePass', controlToRoute.changePassController);
routes.post('/updatePass', controlToRoute.updatePassContoller);
routes.get('/forgotPass', controlToRoute.forgotPassController);
routes.post('/checkUser', controlToRoute.checkUserContoller);

routes.get('/otpValidate/:id',controlToRoute.otpValidateController);
// routes.get('/checkOtp', controlToRoute.checkOtpController);
routes.post('/checkOtpController/:id', controlToRoute.checkOtpControllerLast);
// routes.get('/resetPass/:id', controlToRoute.resetPassController);
routes.get('/resetPassword/:id', controlToRoute.getResetPasswordController);
routes.post('/resetPassword/:id', controlToRoute.resetPasswordController);

routes.get('/add-topic', controlToRoute.postAddTopic);
routes.post('/submitTopic', controlToRoute.submitTopicController);
routes.get('/deleteTitle/:id', controlToRoute.deleteTitleContoller);

routes.get('/addSubTopic', controlToRoute.addSubTopicController);
routes.post('/submitSubTopic',controlToRoute.submitTopicandSubTopic);

module.exports = routes;
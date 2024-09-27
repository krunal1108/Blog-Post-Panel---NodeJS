const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/adminPanelModel');
const bcrypt = require('bcrypt');

console.log("session storage start....(passportJS)");


passport.use(new LocalStrategy({ usernameField: 'email' },
    async function (email, password, done) {
        const userData = await User.findOne({ email: email })
        if (userData) {
            bcrypt.compare(password, userData.password, async (err, result) => {
                if (err) {
                    done(null,false);
                }

                if(result){
                    done(null,userData)
                }else{
                    done(null,false)
                }
            });
        } else {
           done(null,false)
        }
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id);
        done(null, user); // ✅ Correct: Pass the user instance
    } catch (error) {
        done(error);
    }
});


module.exports = passport;
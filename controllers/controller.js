const modelsmsg = require('../models/adminPanelModel');
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 10;

let storeTodoData = [];


const defaultController = async (req, res) => {

    // ...for Secure Route
    // if (req.cookies.userId) {
    //     const fNameProfile = req.cookies.fname;
    //     const emailProfile = req.cookies.email;

    //     const user = await req.cookies.userName;
    //     console.log("userName : ", user);

    //     res.render('index', {
    //         user,
    //         fname: fNameProfile,
    //         email: emailProfile
    //     });
    // } else {
    //     res.redirect('/login');
    // }





    // let getdata = await modelsmsg.find()
    res.render('index');

}




// Sign Up Form Submission Process

const signupController = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.render('signup');
}
const postSignupController = async (req, res) => {
    if (req.body.password === req.body.con_pass) {
        // console.log("hello",req.body);
        const hash = await bcrypt.hash(req.body.password, saltRounds)
        // Store hash in your password DB.
        console.log("bcrypt passsss", hash);
        try {
            const userData = {
                fname: req.body.fname,
                email: req.body.email,
                password: hash
            }
            const newData = new modelsmsg(userData)
            await newData.save();
            console.log("newDATA", newData);

            res.cookie('id', newData._id);
            res.redirect('/login');
        } catch (err) {
            res.send("your Email is already exists..")
        }


    } else {
        console.log("could not found form data..");
    }
}



// Login Form Submit Process


const loginController = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.render('login');
}


const PostLoginController = async (req, res) => {
    res.redirect('/');
}



const postLogout = (req, res) => {
    console.log("Logout Succesfully..");
    req.logout((err) => {
        if (err) {
            next();
        }

        res.redirect('/login');
    })    
}


// const profileController = (req, res)=>{
//     res.render('profile')
// }


const profileController = async (req, res) => {

    const fname = await req.cookies.fname;
    const email = await req.cookies.email;
    const password = await req.cookies.password;

    res.render('profile', {
        fname: fname,
        email: email,
        password: password
    });

}





module.exports = { defaultController, signupController, loginController, postSignupController, PostLoginController, profileController, postLogout };

const modelsmsg = require('../models/adminPanelModel');
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
let myOTP = null;
const randomstring = require("randomstring");
const addTitle = require('../models/addTitle');
const addSubTitle = require('../models/addSubTitle');
// const allBlogs = require('../models/blog');
// const { log } = require('util');



// Create a transporter for send MAIL in users Inbox.
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: "krunalkotadiya2004@gmail.com", // Your Gmail address
        pass: "wlqumnmhnstqgknc", // Your App Password or Gmail password
    },
    tls: {
        rejectUnauthorized: false // Allow self-signed certificates (only for testing!)
    }
});


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

// Sign Up form submit after password hashing and hashed password set in users database.
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

const loginController = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.render('login');
}


const PostLoginController = async (req, res) => {
    console.log("LOGIN Succesfully..");

    res.redirect('/');
}




// Logout
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




// Change Password GET(Render or Run) method
const changePassController = (req, res) => {
    res.render('changePass');
}


// Change Password Submit
const changePassControllerPost = async (req, res) => {
    const oldPass = req.body.oldPass;
    const newPass = req.body.newPass;
    const confirmPass = req.body.confirmPass;
    const fname = req.cookies.fname;
    const email = req.cookies.email;
    const password = req.cookies.password;
    const hashedOldPass = await bcrypt.hash(oldPass, 10);
    const hashedNewPass = await bcrypt.hash(newPass, 10);
    const hashedConfirmPass = await bcrypt.hash(confirmPass, 10);
    if (hashedOldPass === password && hashedNewPass === hashedConfirmPass) {
        res.render('changePass', {
            message: 'Password changed successfully'
        });
    } else {
        res.render('changePass', {
            message: 'Password not changed'
        });
    }
}



// const updatePassContoller = (req, res) => {
//     const { password } = req.user;
//     console.log("hello userrrrrrrrrrrrrr");


//     const { current_password, new_password, confirm_password } = req.body;
//     console.log("all request complete...");


//     bcrypt.compare(password, current_password), (err, res) => {        
//         if (new_password == confirm_password) {
//             console.log("Passwords are match..");
//             bcrypt.hash(new_password, saltRounds, async (err, hash) => {
//                 if (err) {
//                     console.log("errrr");
//                     res.redirect('/changePass');
//                 }
//                 else {
//                     let updateP = await modelsmsg.updateOne({ _id: req.user._id }, { password: hash })
//                     console.log("hash change", updateP);
//                     res.redirect('/');
//                 }
//             })
//         } else {
//             console.log("Passwords are match");
//             res.redirect('/changePass');
//         }

//     }
// }




// Update Password
const updatePassContoller = async (req, res) => {
    try {
        const { password } = req.user; // Fetch the current user's password from the database or session
        const { current_password, new_password, confirm_password } = req.body;

        // Compare the current password with the one stored in the database
        const isMatch = await bcrypt.compare(current_password, password);
        if (!isMatch) {
            console.log("Current password does not match.");
            return res.redirect('/changePass'); // Redirect to the change password page if passwords don't match
        }

        // Check if the new password matches the confirmation password
        if (new_password !== confirm_password) {
            console.log("New passwords do not match.");
            return res.redirect('/changePass'); // Redirect back to the change password page if they don't match
        }

        // If the passwords match, hash the new password
        const hashedPassword = await bcrypt.hash(new_password, saltRounds);
        console.log("Hashed Change(Updated) Password..", hashedPassword);

        // Update the password in the database
        let updateP = await modelsmsg.updateOne({ _id: req.user._id }, { password: hashedPassword });

        console.log("Password updated successfully..", updateP);
        res.redirect('/'); // Redirect to the homepage after successful password change
    } catch (err) {
        console.log("Error updating password:", err);
        res.redirect('/changePass'); // Redirect back to the change password page if any error occurs
    }
};





// Forgot Password
const forgotPassController = (req, res) => {
    res.render('forgotPass');
}

// const checkUserContoller = async (req, res) => {
//     let { email } = req.body;

//     console.log("Email:", email);

//     let userData = await modelsmsg.findOne({ email: email })
//     console.log("User ", userData);



//     if (userData) {
//         let otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
//         myOTP = otp;
//         console.log("otpGenerator", otp);
//         res.redirect(`/otpValidate/${userData._id}`);
//         // const link = `http://localhost:3012/resetPassword/${userData._id}`;
//         // console.log("LINK for Forgot password..>>>",link);
//         // res.redirect('/forgotPass');

//         const mail = {
//             from: 'krunalkotadiya2004@gmail.com',
//             to: userData.email,
//             subject: 'Forgot Password Link:',
//             text: `Your Link :-  ${otp}`
//         }

//         // sendMail is method
//         transporter.sendMail(mail);

//     } else {
//         res.redirect('/forgotPass');
//     }


// }




// Check valid or register user
const checkUserContoller = async (req, res) => {
    let { email } = req.body;

    console.log("Email:", email);

    let userData = await modelsmsg.findOne({ email: email });
    console.log("User ", userData);

    if (userData) {
        let otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
        myOTP = otp;
        console.log("Generated OTP:", otp);

        const token = randomstring.generate();
        console.log("token", token);

        await modelsmsg.updateOne({ _id: userData.id }, { resetToken: token })


        // const link = `http://localhost:3012/resetPassword/${userData._id}`;
        // console.log("LINK for Forgot password..>>>", link);
        // res.redirect('/forgotPass');



        const mailOptions = {
            from: 'krunalkotadiya2004@gmail.com',
            to: userData.email,
            subject: 'Forgot Password OTP',
            text: `Your Reset Password Link is: ${otp}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).send("Error sending OTP email.");
            }
            console.log("EMAIL sent: " + info.response);
            res.redirect(`/otpValidate/${userData._id}`);
        });
    } else {
        res.redirect('/forgotPass');
    }
};



// Only Render different page in for LINK through Reset Your Password
// const getResetPasswordController = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const user = await modelsmsg.findOne({ _id: id });
//         if (user) {
//             console.log("User", user);
//             if (user.resetToken) {
//                 console.log("Token", user.resetToken);
//                 res.render('resetPass', { id });
//             } else {
//                 res.send("Invalid URL");
//             }
//         } else {
//             console.log("Invalid Token");
//         }
//     } catch (error) {
//         console.log("error", error);
//     }
// }
const getResetPasswordController = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await modelsmsg.findOne({ _id: id });
        if (user) {
            console.log("User", user);
            if (user.resetToken) {
                console.log("Token", user.resetToken);
                // Pass `id` to the template
                res.render('resetPass', { id });
            } else {
                res.send("Your Url was expired..😌");
            }
        } else {
            console.log("Invalid User ID");
            res.send("User not found");
        }
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send("Internal Server Error");
    }
}



const otpValidateController = (req, res) => {

    const { id } = req.params;

    res.render('otpValidate', { id });
}


// after OTP check -> render Next Reset Password Form
const checkOtpControllerLast = async (req, res) => {

    const { id } = req.params;
    if (myOTP === req.body.otp) {
        res.render('resetPass', { id });
    } else {
        console.log("Incorrect OTP..");
        res.redirect('/otpValidate');
    }
}



// Reset Password and after hashing password and hashed password set(replace) on database in old password.
const resetPasswordController = async (req, res) => {

    const { id } = req.params;
    const { newPassword, confirmPassword } = req.body;
    const user = await modelsmsg.findOne({ _id: id });

    if (user) {
        bcrypt.hash(newPassword, 10, async (err, hash) => {

            let updateP = await modelsmsg.updateOne({ _id: user }, { password: hash, resetToken: null });

            console.log("Update Password..>>>", updateP);
            console.log("Updated HASH Password..>>>", hash);


            res.redirect('/login');

        });

    } else {
        res.redirect('/signup');

    }

    console.log("user reset", user);
}







const postAddTopic = async (req, res) => {
    // addTitle is -> model file
    const dataTitle = await addTitle.find()
    res.render('add-topic', { dataTitle });
}



const submitTopicController = async (req, res) => {
    const { topicname } = req.body;
    console.log("Topic Name>>>>>>", topicname);

    const topic = new addTitle({
        topicName: topicname,
        user: req.user._id  // Ensure that the logged-in user ID is stored
    });
    console.log("Topic Name", topic);


    try {
        const topicData = new addTitle(topic);
        await topicData.save();
        console.log("Title ADDED..");
        res.redirect('/add-topic');
    } catch (error) {
        console.log("Error in title Add..");
    }

}




const deleteTitleContoller = async (req, res) => {
    // const {id} = req.params;
    // addTitle is -> model
    // const deleteTitle = await addTitle.findByIdAndDelete({_id:id});
    // console.log("DELETE Title..");

    // res.redirect('/add-topic');




    // new

    try {
        // 'addTitle' is model file name
        const title = await addTitle.findById(req.params.id);

        // Check if the Title exists
        if (!title) {
            return res.status(404).send('Title not found');
        }

        // Ensure that the logged-in user is the owner of the Title
        if (title.user.toString() !== req.user._id.toString()) {
            console.log('Unauthorized access. User:', req.user._id, 'Title Owner:', title.user);
            return res.status(403).send('Unauthorized User: You can not delete this title😔');
        }

        // Delete the Title using findByIdAndDelete
        await addTitle.findByIdAndDelete(req.params.id);

        res.redirect('/add-topic');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting Title');
    }
    console.log("DELETE Title Succesfully..");

}




const addSubTopicController = async (req, res) => {
    try {
        // Fetch topics
        const topic = await addTitle.find({});
        console.log("TOPIC:-", topic);

        // Populate the field 'topicName'
        const dataSubTitle = await addSubTitle.find({}).populate('topicName');
        res.render('addSubTopic', { dataSubTitle, topic });
        console.log("Topic Populate successfully....");
    } catch (error) {
        console.log("Error in adding SubTopic:", error);
        res.status(500).send("Error in fetching topics or subtitles");
    }
};



const submitTopicandSubTopic = async (req, res) => {
    try {
        const { topicname, subtopic } = req.body;

        // Find the topic using the ID & 'topicname' is a add topic input form field name
        const topic = await addTitle.findById(topicname);

        // Create a new subtopic
        const subTopic = new addSubTitle({
            SubTitle: subtopic,
            topicName: topic._id // Reference the topic
            
        });
        const newSubTopic = await subTopic.save();

        console.log("New SubTopics:", newSubTopic);

        // Fetch all topics and subtopics for rendering
        const topicnames = await addTitle.find({});
        const SubTitles = await addSubTitle.find({}).populate('topicName');

        res.render('submitSubTopic', { topicnames, SubTitles });
    } catch (error) {
        console.log("Error in SubTopics:", error);
        res.status(500).send('Error occurred while submitting the Sub Topic');
    }
};















module.exports = { defaultController, signupController, loginController, postSignupController, PostLoginController, profileController, postLogout, changePassController, changePassControllerPost, updatePassContoller, forgotPassController, checkUserContoller, otpValidateController, checkOtpControllerLast, resetPasswordController, getResetPasswordController, postAddTopic, submitTopicController, deleteTitleContoller, addSubTopicController, submitTopicandSubTopic };

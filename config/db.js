const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://krunalkotadiya2004:mongoISMYFAVmaroon%4025@cluster0.cprjc.mongodb.net/authenticationAdminPanel')
    .then(() => console.log('Database Connected!')).catch((error) => {
        console.log("Error", error);
    })


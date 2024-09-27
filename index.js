const express =require('express');
const path = require('path');
const app = express();
const env = require('dotenv');
const passport = require('./config/passport');
const express_session = require('express-session');
const router = require('./routes/routes')
// Middlewares
const blogRoutes = require('./routes/blogRoutes');
env.config();

const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const mypath = path.join(__dirname, 'views');
const database = require('./config/db');
const cookieParser = require('cookie-parser');


app.set('view engine', 'ejs');

app.use('/upload',express.static(path.join(__dirname,'upload')));
app.use(express.static(mypath));


// body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express_session({ secret: 'maroonKey', resave: true, saveUninitialized: true }));
app.use(passport.initialize()); // Correct!
app.use(passport.session());

// Use Routes
app.use('/', blogRoutes);

// Use the routes
app.use('/', router);


// app.get('/', (req, res)=>{
//     res.render('Hello Users, I am Maroon!')
// });






    

app.listen(PORT, (error)=>{
    if(!error){
        console.log(`Server Running on http://localhost:${PORT}`);
    }
});
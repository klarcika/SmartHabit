var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');

var indexRouter = require('./routes/habits');

const app = express();
const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Naloži route
const habitsRoutes = require('./routes/habits');
app.use('/habits', habitsRoutes);

// Zaženi strežnik
app.listen(port, () => {
    console.log(`✅ SmartHabit strežnik teče na http://localhost:${port}`);
});


app.use('/', indexRouter);


module.exports = app;

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');

var indexRouter = require('./routes/habits');

// Ni delovalo na 3000, zato sem spremnila na 3001, če vama ne bo delalo spremenita nazaj na 3000 tako kot je bilo prej
const app = express();
const port = process.env.PORT || 3001;

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
app.use('/api/uporabniki', require('./routes/uporabniki'));
app.use('/api/napredek', require('./routes/napredek'));
app.use('/api/obvestila', require('./routes/obvestila'));
app.use('/api/dosezki', require('./routes/dosezki'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/recommendations', require('./routes/recommendations'));



module.exports = app;

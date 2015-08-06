var express = require('express');
var app = express();

// middleware
app.use(express.static('client'));




app.listen(3000);
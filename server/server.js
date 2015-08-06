var express = require('express');
var app = express();

var sequelize = new Sequelize('postgres://localhost/codefeed');
// middleware
app.use(express.static('client'));


app.post('/post', function (req, res) {
  Post.save().then(function (err, post) {

  });
});

app.listen(3000);
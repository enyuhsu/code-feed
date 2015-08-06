var express = require('express');
var app = express();
var Sequelize = require('sequelize');






var sequelize = new Sequelize('postgres://localhost/codefeed');

var User = sequelize.define('user', {
	username: {
		type: Sequelize.STRING,
		field: 'username'
	},
	password: {
		type: Sequelize.STRING,
		field: 'password'
	},
	usertoken: {
		type: Sequelize.STRING,
		field: 'usertoken'
	},
	email: {
		type: Sequelize.STRING,
		field: 'email'
	}
	}, {
	freezeTableName: true
	
});

var Post =  sequelize.define('post',{
	title: {
		type: Sequelize.STRING,
		field: 'title'
	},
	url: {
		type: Sequelize.STRING,
		field: 'url'
	},	
	posts: {
		type: Sequelize.STRING,
		field: 'posts'
	}
    },{
	freezeTableName: true
});

User.hasMany(Post, {as: 'posts'});



Post.sync({force:true}).then(function(){
	return Post.create({
		title: 'BOBs',
		url: 'donut.com',
		posts: "these donut are yummy!"
	});
});




var sequelize = new Sequelize('postgres://localhost/codefeed');
// middleware
app.use(express.static('client'));


app.post('/post', function (req, res) {
  Post.save().then(function (err, post) {

  });
});



app.listen(3000);
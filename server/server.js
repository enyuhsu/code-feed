var express = require('express');
var app = express();
var Sequelize = require('sequelize');






var sequelize = new Sequelize('postgres://localhost/codefeed');

var User = sequelize.define('users', {
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



User.sync({force:true}).then(function(){
	return User.create({
		username: 'BOB',
		password: 'donut.com',
		usertoken: 'gfgfutfuf',
		email: "er@these.com!"
	});
});






// middleware
app.use(express.static('client'));







app.listen(3000);
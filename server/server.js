var express = require('express');
var app = express();
var Sequelize = require('sequelize');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

app.use(express.static('client'));
app.use(bodyParser.json());
app.use(cookieParser());

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
	},
	username: {
		type : Sequelize.STRING,
		field: 'username'
	}
  },{
	
	freezeTableName: true
});


var Comment = sequelize.define('comment', {
  comments:{
    type: Sequelize.STRING,
    field:'comments'
  }
    },{
   freezeTableName: true 
});


User.hasMany(Post, {as: 'posts'});
User.hasMany(Comment,{as: 'comments'});
Post.hasMany(Comment, {as: 'comments'});


User.sync();
Post.sync();
Comment.sync();

app.post('/fb_login', function(req,res){
	User
	  .findOrCreate({
	  	where : {
	  		username : req.body.username
	  	},
	  	defaults:{
	  		usertoken : req.body.usertoken
	  	}
	  }).spread(function(user,created){
	  	user.updateAttributes({
      		usertoken : req.body.usertoken
      	});
	  });
});



app.get('/user/:id', function (req, res) {
  User
    .findById(id)
    .then(function (user) {
      res.send(user);
    })
    .catch(function (error) {
      if (error) {
        res.send(error);
      }
    });
});




app.post('/comment', function (req, res) {
  console.log(req.body);
  Comment
    .create(req.body)
    .then(function(comment){
      res.send(comment);
    })
    .catch(function (error) {
      if (error) {
        res.send(error);
      }
    });
});




// app.get('/post:id', function (req, res) {
//   Post
//     .findById(id)
//     .then(function (post) {
//       res.send(req.params.id);
//     })
//     .catch(function (error) {
//       if (error) {
//         res.send(error);
//       }
//     });
// });



// middleware

app.get('/com', function (req, res) {
  Comment
    .findAll()
    .then(function (comments) {
      res.send(comments);
    })
    .catch(function (error) {
      res.send(error);
    });
});






app.post('/post', function (req, res) {
	//query database where username = req.body.username and retrieve usertoken
	//if usertoken !== req.cookies.access_token
	console.log("Body: "+req.body);
	if(!req.cookies.username){
		console.log("Cookies don't exist: "+req.cookies.username);
		//res.send('Please log in before posting');
		res.error();
		res.end();
	}
	else{
		console.log("Cookies exist: "+req.cookies.username);
		User.find({username: req.cookies.username})
			.then(function(user){
				if(!user){
					res.send('Please log in before posting');
				}
				req.body.username = req.cookies.username;
				console.log(req.body);
				Post
				  .create(req.body)
				  .then(function(post){
				  	res.send(post);
				  	//res.send('post added');
				  })
				  .catch(function (error) {
				    if (error) {
				      res.send(error);
				    }
				  });
			});
	}

});


app.get('/posts', function (req, res) {
  Post
    .findAll()
    .then(function (posts) {
      res.send(posts);
    })
    .catch(function (error) {
      res.send(error);
    });
});

app.get('/fb_users', function (req, res) {
  User
    .findAll()
    .then(function (users) {
      res.send(users);
    })
    .catch(function (error) {
      res.send(error);
    });
});


app.listen(3000);
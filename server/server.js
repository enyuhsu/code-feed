var express = require('express');
var app = express();
var Sequelize = require('sequelize');
var pg = require('pg');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

app.use(express.static('client'));
app.use(bodyParser.json());
app.use(cookieParser());


//var DATABASE_URL = 'postgres://ifxtabnfjinbbw:pGvSheCDwrimLtiqpbBm-YAekP@ec2-54-197-230-210.compute-1.amazonaws.com:5432/ddegi6ju8v9huu';
/**
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT table_schema,table_name FROM information_schema.tables;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});
*/


var sequelize = new Sequelize('postgres://ifxtabnfjinbbw:pGvSheCDwrimLtiqpbBm-YAekP@ec2-54-197-230-210.compute-1.amazonaws.com:5432/ddegi6ju8v9huu');



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

var Upvote =  sequelize.define('upvote',{
  title: {
    type: Sequelize.INTEGER,
    field: 'upvote'
  }
  }, {

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

User.sync();
Post.sync();
Comment.sync();
Upvote.sync();

User.hasMany(Post, {as: 'posts'});
User.hasMany(Comment,{as: 'comments'});
Post.hasMany(Comment, {as: 'comments'});
Post.belongsTo(User);
// Comments.belongsToMany()





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
	} else {
		console.log("Cookies exist: "+req.cookies.username);
		User.find({username: req.cookies.username})
			.then(function(user){
				if(!user){
					res.send('Please log in before posting');
				}
				else if(req.cookies.access_token !== user.usertoken){
					console.log("Invalid token");
					res.error();
					res.end();
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

app.post('/upvote', function (req, res) {
  console.log(req.body);
  Upvote
    .create(req.body)
    .then(function(upvote) {
      res.send(upvote);
    })
    .catch(function (error) {
      res.send(error);
    });
});


app.listen(process.env.PORT || 3000);

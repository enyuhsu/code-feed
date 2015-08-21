var express = require('express'),
    app = express(),
    path = require('path'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    Schema = mongoose.Schema,
    http = require('http'),
    array = [];

mongoose.connect('mongodb://Thlapath:codefeed@ds059672.mongolab.com:59672/recoddit', function(err){
  if(err){return err;}
  console.log("connected to Db");
});

var UserSchema = new Schema({
	email:{type: String , required:true , index: {unique: true}},
	username:{type: String, required:true, index: {unique: true}},
	password: {type: String, required: true},
	access_token: {type: String}
});

var PostSchema = new Schema({
	title: {type: String, required: true},
	url: {type: String, required: true},
	post: {type: String, required: true},
	postedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	comment: [{body: "string", by: mongoose.Schema.Types.ObjectId}]//should reference comment id
}); 

// var CommentSchema = new Schema({
// 	comment: {type: String, required: true},
// 	date: {type: date, required: true},

// });

var User = mongoose.model("User", UserSchema);
var Post = mongoose.model("Post", PostSchema);
app.use(express.static('client'));
app.use(bodyParser.json());
app.use(cookieParser());

// app.post('/fb_login', function(req,res){
// 	User
// 	  .findOrCreate({
// 	  	where : {
// 	  		username : req.body.username
// 	  	},
// 	  	defaults:{
// 	  		usertoken : req.body.usertoken
// 	  	}
// 	  }).spread(function(user,created){
// 	  	user.updateAttributes({
//       		usertoken : req.body.usertoken
//       	});
// 	  });
// });

// app.get('/user/:id', function (req, res) {
//   User
//     .findById(id)
//     .then(function (user) {
//       res.send(user);
//     })
//     .catch(function (error) {
//       if (error) {
//         res.send(error);
//       }
//     });
// });

app.post('/comment', function (req, res) {
  Post.findOneAndUpdate({_id: req.body.postId}, function(err,post){
  	if(err) throw err;
  	post.comment.push({
  		body: req.body.body,
  		by: req.body.username
  	});
  });
});

// middleware

app.get('/comments', function (req, res) {
	Post.find({_id: req.body.postId}, function(err, post){
		if(err) throw err;
		res.send(post.comment);
	});  
});

app.post('/post', function (req, res) {
		var newpost = new Post({
				title: req.body.title,
				url: req.body.url,
				post: req.body.post,
				postedBy: req.body.username
		});
		newpost.save(function(){
			console.log("saved a new post");
		})


	//query database where username = req.body.username and retrieve usertoken
	//if usertoken !== req.cookies.access_token
	// console.log("Body: "+req.body);
	// if(!req.cookies.username){
	// 	console.log("Cookies don't exist: "+req.cookies.username);
	// 	//res.send('Please log in before posting');
	// 	res.error();
	// 	res.end();
	// } else {
	// 	console.log("Cookies exist: "+req.cookies.username);
	// 	User.find({username: req.cookies.username})
	// 		.then(function(user){
	// 			if(!user){
	// 				res.send('Please log in before posting');
	// 			}
	// 			else if(req.cookies.access_token !== user.usertoken){
	// 				console.log("Invalid token");
	// 				res.error();
	// 				res.end();
	// 			}
	// 			req.body.username = req.cookies.username;
	// 			console.log(req.body);
	// 			Post
	// 			  .create(req.body)
	// 			  .then(function(post){
	// 			  	res.send(post);
	// 			  	//res.send('post added');
	// 			  })
	// 			  .catch(function (error) {
	// 			    if (error) {
	// 			      res.send(error);
	// 			    }
	// 			  });
	// 		});


 //  }
});


app.get('/posts', function (req, res) {
  Post.find({}, function(err,posts){
  	if(err) throw err;
  	res.send(posts);
  });
});

// app.get('/fb_users', function (req, res) {
 
// });

// app.post('/upvote', function (req, res) {
  
// });


app.listen(process.env.PORT || 3000);

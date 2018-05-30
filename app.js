var express= require('express');
var app    = express();
var engine =require("ejs-mate");
var User   = require("./models/user");
var methodOverride=require("method-override");
var expressSanitizer=require("express-sanitizer");
app.use(expressSanitizer());
app.use(methodOverride("_method"));
//var mailer = require('./mailer');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
var engine               =require("ejs-mate");
var passport             =require("passport");
var mongoose             =require("mongoose");
var LocalStrategy        =require("passport-local");
var passportLocalMongoose=require("passport-local-mongoose");
mongoose.connect("mongodb://localhost/intern_v1");
app.engine('ejs',engine);
app.set('view engine','ejs');
app.set('views', __dirname + '/views');
//app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require("express-session")({
		secret:"whats up",
		resave:false,
		saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
});
//mongoose.connect("mongodb://localhost/restful_intern");
var blogSchema = new mongoose.Schema({
		title:String,
		image:String,
		video:String,
		body:String,
		created:{type:Date,default:Date.now},
		author:{id:{type:mongoose.Schema.Types.ObjectId,ref:"User"},username:String}
	});
var Blog =mongoose.model("Blog",blogSchema);
var blogSchema_medi = new mongoose.Schema({
		title:String,
		image:String,
		video:String,
		body:String,
		created:{type:Date,default:Date.now},
		author:{id:{type:mongoose.Schema.Types.ObjectId,ref:"User"},username:String}
	});
var Blog_medi =mongoose.model("Blog_medi",blogSchema_medi);
/*Blog_medi.create(
	{
		title:"Test Blog",
		image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVdaeWFjAGNQnGlP2TCpKHgWniQ8YGlusxlowwqaYiQ9LZo-bI",
		body:"This is blog post"
	},function(err,Blog_medi){
		if(err)
			console.log(err);
		else
			console.log(Blog_medi);
});*/

app.get('/',function(req,res){
	Blog.find({},function(err,y){
	if(err)
		console.log(err);
	else
		res.render("home",{dzees:y});
});
});
app.get('/about',function(req,res){
        res.render('about');
});
app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get("/dzees",function(req,res){//1. index route:to display the list
		console.log(req.user);
		Blog.find({},function(err,x){
		if(err)
			console.log(err);
		else
			res.render("index",{dzees:x});
});
});
app.get("/dzees/new",isLoggedIn,function(req,res){
		res.render("new");
});
app.get("/dzees/:id",function(req,res){//4. show route:to show info about one campground
	Blog.findById(req.params.id,function(err,blogFound){
	//function given by mongoose
		if(err)
			console.log(err);
		else
			res.render("show",{dzees:blogFound});
});
});
app.post("/dzees",function(req,res){//2. create route:to add new campground to db
		var title=req.body.title;
		var img=req.body.image;
		var video=req.body.video;
		var body=req.body.body;
		var author ={id:req.user._id,
			username:req.user.username}
		var newBlog={title:title,image:img,video:video,body:body,author:author};
		console.log(req.body);
		req.body.body=req.sanitize(req.body.body);
		console.log(req.body);
		Blog.create(newBlog,function(err,Blog){
		if(err)
			console.log(err);
		else
		res.redirect("/dzees");
})});



app.get("/dzees/:id/edit",isLoggedIn,function(req,res){
		Blog.findById(req.params.id,function(err,blogFound){//edit route
	//function given by mongoose
		if(err)
			console.log(err);
		else
			res.render("edit",{dzees:blogFound});
});
});
app.put("/dzees/:id",function(req,res){//update route
		var title=req.body.title;
		var img=req.body.image;
		var video=req.body.video;
		var body=req.body.body;
		var author ={id:req.user._id,
				username:req.user.username}
		var updateBlog={title:title,image:img,video:video,body:body,author:author};
		Blog.findByIdAndUpdate(req.params.id,updateBlog,function(err,blogUpdate){//edit route
	//function given by mongoose
		if(err)
			console.log(err);
		else
			res.redirect("/dzees/"+req.params.id);
});
});
app.delete("/dzees/:id",isLoggedIn,function(req,res){//4. show route:to show info about one campground
	Blog.findByIdAndRemove(req.params.id,function(err){
	//function given by mongoose
		if(err)
			console.log(err);
		else
			res.redirect("/dzees");
});
});

app.get("/medibouts",function(req,res){//1. index route:to display the list
		console.log(req.user);
		Blog_medi.find({},function(err,x){
		if(err)
			console.log(err);
		else
			res.render("index1",{medibouts:x});
});
});
app.get("/medibouts/new",isLoggedIn,function(req,res){
		res.render("new1");
});
app.get("/medibouts/:id",function(req,res){//4. show route:to show info about one campground
	Blog_medi.findById(req.params.id,function(err,blogFound){
	//function given by mongoose
		if(err)
			console.log(err);
		else
			res.render("show1",{medibouts:blogFound});
});
});
app.post("/medibouts",function(req,res){//2. create route:to add new campground to db
		var title=req.body.title;
		var img=req.body.image;
		var video=req.body.video;
		var body=req.body.body;
		var author ={id:req.user._id,
			username:req.user.username}
		var newBlog_medi={title:title,image:img,video:video,body:body,author:author};
		console.log(req.body);
		req.body.body=req.sanitize(req.body.body);
		console.log(req.body);
		Blog_medi.create(newBlog_medi,function(err,Blog_medi){
		if(err)
			console.log(err);
		else
		res.redirect("/medibouts");
})});



app.get("/medibouts/:id/edit",isLoggedIn,function(req,res){
		Blog_medi.findById(req.params.id,function(err,blogFound){//edit route
	//function given by mongoose
		if(err)
			console.log(err);
		else
			res.render("edit1",{medibouts:blogFound});
});
});
app.put("/medibouts/:id",function(req,res){//update route
		var title=req.body.title;
		var img=req.body.image;
		var video=req.body.video;
		var body=req.body.body;
		var author ={id:req.user._id,
				username:req.user.username}
		var updateBlog_medi={title:title,image:img,video:video,body:body,author:author};
		Blog_medi.findByIdAndUpdate(req.params.id,updateBlog_medi,function(err,blogUpdate){//edit route
	//function given by mongoose
		if(err)
			console.log(err);
		else
			res.redirect("/medibouts/"+req.params.id);
});
});
app.delete("/medibouts/:id",isLoggedIn,function(req,res){//4. show route:to show info about one campground
	Blog_medi.findByIdAndRemove(req.params.id,function(err){
	//function given by mongoose
		if(err)
			console.log(err);
		else
			res.redirect("/medibouts");
});
});



app.get("/register",function(req,res){//show signUp page
		res.render("register");
});
app.post("/register",function(req,res){//handling user sign up

	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
			if(err)
				res.render("register");
			else
			{
			passport.authenticate("local")(req,res,function(){
			res.redirect("/");})
			}

});
});
/*app.get("/",isLoggedIn,function(req,res){
		res.render("profile");
});*/
app.get("/login",function(req,res){//render login form
		res.render("login");
});

app.post("/login",passport.authenticate("local",{
			successRedirect:"/",
			failureRedirect:"/login"
}),function(req,res){


	/*var username  =req.body.username;
	var password   =req.body.password;
	var newUser ={username:username,password:password};
	User.push(newUser);-
   res.redirect("/");
*/

});

app.get("/logout",function(req,res){
		req.logout();
		res.redirect("/login");
});

function isLoggedIn(req,res,next){
		if(req.isAuthenticated()){
			return next();
		}
	res.redirect("/login");
}

app.post('/send', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${req.body.name}</li>

      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
        user: 'akshayvgupta7@gmail.com', // generated ethereal user
        pass: '9424042481'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
});

let mailOptions = {
      from: '"Nodemailer Contact" akshayvgupta7@gmail.com', // sender address
      to: '16ucc011@lnmiit.ac.in', // list of receivers
      subject: 'Node Contact Request', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
};

transporter.sendMail(mailOptions, function (err, info) {
   if(err)
     console.log(err)
   else
     console.log(info);
});

res.render('contact');});

app.listen(3000, () => console.log('Server started...'));

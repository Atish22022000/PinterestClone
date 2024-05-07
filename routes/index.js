const express = require('express');
const router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const passport = require('passport');
const localStrategy = require('passport-local');
const upload = require('./multer');

passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/feed', function(req, res, next) {
  res.render('feed', { title: 'Feed' });
});
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'contact' });
});
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'about' });
});


router.post('/upload', isLoggedin, upload.single('file'), async function(req, res, next) {
  try {
    if (!req.file){
      return res.status(404).send("No file was given");
    }
  
    const user = await userModel.findOne({ username: req.session.passport.user }); 
    if (!user) {
      return res.status(404).send("User not found");
    }
  
    const post = await postModel.create({
      image: req.file.filename,
      imageText: req.body.filecaption,
      user: user._id
    });
  
    user.posts.push(post._id);
    await user.save();
  
    res.redirect('/profile');
  } catch (error) {
    console.error("Error uploading post:", error);
    res.status(500).send("Error uploading post");
  }
});

router.get('/login', function(req, res, next) {
  res.render('login' , {error:req.flash('error')});
});

router.get('/profile', isLoggedin, async function(req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user }).populate("posts");
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.render("profile", { user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).send("Error fetching user profile");
  }
});

router.post("/register", function(req, res) {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullName: fullname });

  userModel.register(userData, req.body.password)
    .then(function(){
      passport.authenticate("local")(req, res, function(){
        res.redirect("/profile");
      });
    })
    .catch(function(error) {
      console.error("Error registering user:", error);
      res.status(500).send("Error registering user");
    });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true
}));

router.post('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

function isLoggedin(req, res, next){
  if(req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}

module.exports = router;

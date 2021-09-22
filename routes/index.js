var express = require('express');
var router = express.Router();
var userModule=require('../modules/user')
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

/* GET home page.. */

// Taking middleware for Email
function checkEmail(req,res,next){
  var email=req.body.email;
  var checkexitemail = userModule.findOne({email:email});
  checkexitemail.exec((err,data)=>{
    if(err) throw err;
    if(data){
      return res.render('signup', { title: 'Password management System', msg:'Email Already Exit'});
    }
    next();
  });
};
  
// Taking middleware for User(signup api)
function checkUsername(req,res,next){
  var username=req.body.username;
  var username  = userModule.findOne({username :username});
  username.exec((err,data)=>{
    if(err) throw err;
    if(data){
      return res.render('signup', { title: 'Password management System', msg:'Username Already Exit'});
    }
    next();
  });
};

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Password management System', msg: '' });
});



router.post('/', function(req, res, next) {
  var {username,password} = req.body;
  var checkUsername = userModule.findOne({username:username});
checkUsername.exec((err, data)=>{
  if(err) throw err
  var getUserID=data._id;
  var getPassword=data.password;
  if(bcrypt.compareSync(password,getPassword)){
    var token = jwt.sign({ userID: getUserID}, 'loginToken');
    localStorage.setItem('userToken', token);
    localStorage.setItem('loginUser', username);
    res.redirect('/dashboard')
  }else{
    res.render('index', { title: 'Password management System', msg:'Invalid Username and Password.'});
  }
  });
  }); 


  router.get('/dashboard', function(req, res, next) {
    res.render('dashboard', { title: 'Password management System', msg:''});
  });


router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Password management System', msg:''});
});


//checkUser,checkEmail is the middleware that we put in post method.
router.post('/signup',checkUsername,checkEmail, function(req, res, next) {
  var {username,email,password,confpassword } = req.body
  
  if(password != confpassword){
    res.render('signup', {title:'Password management System', msg:'Password Not Matched'});
  }else{
    password=bcrypt.hashSync(req.body.password,10);
    var userDetails=new userModule({
    username:username,
    email:email,
    password:password
      });
      userDetails.save((err,doc)=>{
        if(err) throw err;
        res.render('signup', { title:'Password management System', msg:'User Registered Successfully'});
      });
    }
  });



router.get('/view-all-category', function(req, res, next) {
  res.render('viewallcategory', { title: 'Password management System' });
});


router.get('/add-new-category', function(req, res, next) {
  res.render('addNewcategory', { title: 'Password management System' });
});


router.get('/add-new-password', function(req, res, next) {
  res.render('addNewpassword', { title: 'Password management System' });
});


router.get('/view-all-password', function(req, res, next) {
  res.render('viewallpassword', { title: 'Password management System' });
});


module.exports = router;
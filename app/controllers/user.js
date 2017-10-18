var User = require('../models/user.js')

exports.showSignup = function(req, res){
  res.render('signup',{
    title: '注册页面'
  })
}

exports.showSignin = function(req, res){
  res.render('signin',{
    title: '登录页面'
  })
}
// singnup
exports.signup = function(req, res){

    var _user = req.body.user
    // var user = new User(_user)
    User.findOne({name: _user.name}, function(err, user){
        if(err){
            console.log(err);
        }

        if(user){
            return res.redirect('/signin');
        } else{
        var newUser = new User(_user);
        newUser.save(function(err,user){
            if(err){
            console.log(err)
            }
            res.redirect('/')
        })
        }
    })
       

}

  // signin
  exports.signin = function(req, res){
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;

    User.findOne({name:name})
      .exec(function(err,user){
      if(err){
        console.log(err);
        console.log('001');
      }
      if(!user){
        return res.redirect('/signup');
      } 
      user.comparePassword(password,function(err,isMatch){
        if(err){
          console.log(err);
          //console.log('002');
        }
        if(isMatch){
          req.session.user = user;
          return res.redirect('/');
        } else{
          res.redirect('/signin');
          console.log('Wrong Password!')
        }


      })
    })
  }
 // log out
exports.logout = function(req,res){
    // req.session.user = null
    delete req.session.user
    // delete app.locals.user
    res.redirect('/')
}

//userlist 
exports.userlist = function(req, res) {
  User.fetch(function(err, users) {
    if (err) {
      console.log(err);
    }
    res.render('userlist', {
      title: '用户',
      users: users
    })
  })
}

// midware for user
exports.signinRequired = function(req, res, next){
  var user = req.session.user
  if(!user){
    return res.redirect('/signin')
  }
  next()
}
// midware for admin
exports.adminRequired = function(req, res, next){
  var user = req.session.user
  if(user.role <= 10 || !user.role){
    return res.redirect('/signin')
  }
  next()
}

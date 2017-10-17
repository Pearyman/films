
var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var bodyParser= require('body-parser');
var _ = require('underscore')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var port = process.env.PORT || 3000
var app = express()
var Movie = require('./models/movie')
var User = require('./models/user')
// mongoose.connect('mongodb://localhost:27017/films')
mongoose.connect('mongodb://127.0.0.1:27017/films', { useMongoClient: true })

mongoose.Promise = global.Promise;

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Mongodb connect error !'))

db.once('open', function() {

    console.log('Mongodb started !')

})

app.set('views','./views/pages')
app.set('view engine','jade')
app.use(express.static(path.join(__dirname, 'public')))
app.locals.moment = require('moment')
// 表单数据格式化
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
// session
app.use(session({
  // name: 'films',
  secret: 'films',
  // resave: false,
  // saveUninitialized: true,
  // cookie: {
  //   maxAge: 2592000000
  // },
  store: new MongoStore({
    url: 'mongodb://127.0.0.1:27017/films'
  })
}))

app.listen(port)

console.log('films started on port' + port)

// pre handle user
app.use(function(req, res, next){
  var _user = req.session.user
  console.log(_user)
  if(_user){
    app.locals.user=_user
  }
  next()
 
  
})
app.get('/', function(req,res){
  // console.log(req.session.user)
  


	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('index', {
			title: '首页',
			movies: movies
		})
	})
	
})

// singnup
app.post('/user/signup', function(req, res){
  var _user = req.body.user
  // var user = new User(_user)
  User.findOne({name: _user.name}, function(err, user){
    if(err){
        console.log(err);
    }

    if(user){
        return res.redirect('/');
    } else{
      var newUser = new User(_user);
       newUser.save(function(err,user){
        if(err){
          console.log(err)
        }
        res.redirect('/admin/userlist')
      })
    }
  })
 
})

// signin
app.post('/user/signin', function(req, res){

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
        return res.redirect('/');
      } 
      user.comparePassword(password,function(err,isMatch){
        if(err){
          console.log(err);
          console.log('002');
        }
        // function(err,isMatch)(err) || function(err,isMatch)(null,isMatch)
        if(isMatch){
          req.session.user = user;
          return res.redirect('/');
        } else{
          res.redirect('/signin');
          console.log('Wrong Password!');
        }


      });    
    });
})
// log out
app.get('/logout',function(req,res){
  // req.session.user = null
  delete req.session.user
  delete app.locals.user
  res.redirect('/')
})
app.get('/movie/:id', function(req,res){
	var id = req.params.id
	Movie.findById(id, function(err,movie){
		res.render('detail', {
			title: '详情页'+ movie.title,
			movie: movie
		})
	})
	
})

app.get('/admin/movie', function(req,res){
	res.render('admin', {
		title: '后台录入页',
		movie: {
			title: '',
			doctor: '',
			country: '',
			year: '',
			poster: '',
			flash: '',
			summary: '',
			language: ''
		}
	})
})
//update
app.get('/admin/update/:id', function(req, res) {
  var id = req.params.id;
  if (id) {
    Movie.findById(id, function(err, movie) {
      res.render('admin', {
        title: '后台更新页',
        movie: movie
      });
    });
  }
});
//delete
app.delete('/admin/list',function(req,res){
    var id = req.query.id;
    if(id){
        Movie.remove({_id:id},function(err,movie){
            if(err){
               console.log(err);
            }else{
                res.json({success:1});
            }
        });
    }

})
// post form data
app.post('/admin/movie/new', function(req, res) {
  // console.log(req.body)
  var id = req.body.movie._id;
  var movieObj = req.body.movie;
  var _movie;
  if (id !== 'undefined') {
    Movie.findById(id, function(err, movie) {
      if (err) {
        console.log(err);
      }
      _movie = _.extend(movie, movieObj);
      _movie.save(function(err, movie) {
        if (err) {
          console.log(err);
        }
        res.redirect('/movie/' + movie._id);
      });
    });
  } else {
    _movie = new Movie({
      doctor: movieObj.doctor,
      title: movieObj.title,
      language: movieObj.language,
      country: movieObj.country,
      // year: movieObj.year,
      poster: movieObj.poster,
      flash: movieObj.flash,
      summary: movieObj.summary
    });
    _movie.save(function(err, movie) {
      if (err) {
        console.log(err);
      }
      res.redirect('/movie/' + movie._id)
    });
  }
})

app.get('/admin/userlist', function(req, res) {
  User.fetch(function(err, users) {
    if (err) {
      console.log(err);
    }
    res.render('userlist', {
      title: '用户',
      users: users
    })
  })
})

app.get('/admin/list', function(req, res) {
  Movie.fetch(function(err, movies) {
    if (err) {
      console.log(err);
    }
    res.render('list', {
      title: 'demo1 列表页',
      movies: movies
    })
  })
})

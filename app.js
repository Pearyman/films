'use strict'
let express = require('express')
let path = require('path')
let mongoose = require('mongoose')
let bodyParser= require('body-parser');
let _ = require('underscore')
let port = process.env.PORT || 3000
let app = express()
let Movie = require('./models/movie')
// mongoose.connect('mongodb://localhost:27017/films')
mongoose.connect('mongodb://127.0.0.1:27017/films', { useMongoClient: true })

mongoose.Promise = global.Promise;

let db = mongoose.connection;

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

app.listen(port)

console.log('films started on port' + port)

app.get('/', function(req,res){
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

app.get('/movie/:id', function(req,res){
	let id = req.params.id
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
  let id = req.params.id;
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
  let id = req.body.movie._id;
  let movieObj = req.body.movie;
  let _movie;
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

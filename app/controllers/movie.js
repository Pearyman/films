var Movie = require('../models/movie')
var _ = require('underscore')
var Comment = require('../models/comment')
var Category = require('../models/category')
  
  
exports.detail = function(req,res){
  var id = req.params.id
  
  Movie.findById(id, function(err,movie){
    Comment
      .find({movie: id})
      .populate('from', 'name')
      .populate('reply.from reply.to', 'name')
      .exec(function(err, comments){
        console.log(comments)
        res.render('detail', {
          title: '详情页'+ movie.title,
          movie: movie,
          comments: comments
        })
    })
  })    
}
  
exports.new  = function(req,res){
  Category.find({},function(err,categories ){
    res.render('admin', {
      title: '后台录入页',
      categories: categories,
      movie: {}
    })
  })  
}
  //update
exports.update = function(req, res) {
    var id = req.params.id
   
    if (id) {     
      Movie.findById(id, function(err, movie) {
        Category.find({},function(err,categories ){
          // console.log(categories)
          res.render('admin', {
            title: '后台更新页',
            movie: movie,
            categories: categories
          });
        })      
      });
    }
  }
  //delete
exports.del = function(req,res){
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
  
}
  // post form data
exports.save = function(req, res) {
    // console.log(req.body)
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
    if (id) {
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
      _movie = new Movie(movieObj)
      var categoryId = movieObj.category
      var categoryName = movieObj.categoryName
      // console.log(categoryId)
      _movie.save(function(err, movie) {
        if (err) {
          console.log(err)
        }
        if (categoryId) {
          // console.log(6666666666666)
          Category.findOne({_id: categoryId}, function(err, category) {
            // console.log(movie._id)
            category.movies.push(movie._id)
  
            category.save(function(err, category) {
              res.redirect('/movie/' + movie._id)
            })
          })
        }
        else if (categoryName) {
          var category = new Category({
            name: categoryName,
            movies: [movie._id]
          })
  
          category.save(function(err, category) {
            movie.category = category._id
            movie.save(function(err, movie) {
              res.redirect('/movie/' + movie._id)
            })
          })
        }
      })
    }
  }
 
  
exports.list = function(req, res) {
    Movie.fetch(function(err, movies) {
      if (err) {
        console.log(err);
      }
      res.render('list', {
        title: 'demo1 列表页',
        movies: movies
      })
    })
}
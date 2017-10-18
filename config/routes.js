
var Movie = require('../app/controllers/movie')
var User = require('../app/controllers/user')
var Index = require('../app/controllers/index')

module.exports = function(app){
    // pre handle user
app.use(function(req, res, next){
    var _user = req.session.user
    app.locals.user = _user
    next()   
})
  //Index
  app.get('/', Index.index)

  //User
  app.post('/user/signup', User.signup)
  app.post('/user/signin', User.signin)
  app.get('/signin', User.showSignin)
  app.get('/signup', User.showSignup)
  app.get('/logout', User.logout)
  app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.userlist)

  //Movie
  app.get('/movie/:id', Movie.detail)
  app.get('/admin/movie/new',  User.signinRequired, User.adminRequired, Movie.new)
  app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);
  app.delete('/admin/movie/list',  User.signinRequired, User.adminRequired,Movie.del)
  app.post('/admin/movie', User.signinRequired, User.adminRequired, Movie.save)
  app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list)

}

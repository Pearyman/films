
var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var bodyParser= require('body-parser')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var port = process.env.PORT || 3000
var app = express()

// mongoose.connect('mongodb://localhost:27017/films')
mongoose.connect('mongodb://127.0.0.1:27017/films', { useMongoClient: true })
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongodb connect error !'))
db.once('open', function() {
    console.log('Mongodb started !')
})

app.set('views','./app/views/pages')
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

if('development' === app.get('env')){
  app.set('showStackError',true)
  // app.use(express.logger(':method :url :status'))
  app.use(logger('dev'))
  app.locals.pretty = true
  mongoose.set('debug', true)
}

require('./config/routes')(app)
app.listen(port)

console.log('films started on port' + port)



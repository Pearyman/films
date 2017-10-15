let express = require('express')
let path = require('path')
let bodyParser= require('body-parser');
let port = process.env.PORT || 3000
let app = express()

app.set('views','./views/pages')
app.set('view engine','jade')
app.use(express.static(path.join(__dirname, 'bower_components')))
// 表单数据格式化
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())

app.listen(port)

console.log('films started on port' + port)

app.get('/', function(req,res){
	res.render('index', {
		title: '首页',
		movies:[{
			title:'jerry',
			poster:'https://img1.doubanio.com/view/movie_poster_cover/lpst/public/p2499793218.webp',
			_id:1

		},{
			title:'jerry',
			poster:'https://img1.doubanio.com/view/movie_poster_cover/lpst/public/p2499793218.webp',
			_id:1

		},{
			title:'jerry',
			poster:'https://img1.doubanio.com/view/movie_poster_cover/lpst/public/p2499793218.webp',
			_id:1

		},{
			title:'jerry',
			poster:'https://img1.doubanio.com/view/movie_poster_cover/lpst/public/p2499793218.webp',
			_id:1

		},{
			title:'jerry',
			poster:'https://img1.doubanio.com/view/movie_poster_cover/lpst/public/p2499793218.webp',
			_id:1

		},{
			title:'jerry',
			poster:'https://img1.doubanio.com/view/movie_poster_cover/lpst/public/p2499793218.webp',
			_id:1

		}
		]
	})
})

app.get('/movie/:id', function(req,res){
	res.render('detail', {
		title: '详情页',
		movie:{
			_id:1,
			title: '机械战警',
			director:'何塞.帕迪利亚',
			year:2014,
			country:'美国',
			language:'英语',
			poster: './assets/images/001.png',
			flash: 'http://d6.baidupcs.com/file/afad0f4d478bc18a098dcf16564b64fb?bkt=p3-0000b94ca25801c1e83aea555a76081945d1&xcode=d24d9befd1ddf03987c824ff353cb6c59f84374e2ebf02a5&fid=4070653298-250528-350998311310962&time=1507997951&sign=FDTAXGERQBHSK-DCb740ccc5511e5e8fedcff06b081203-LvuGnkGr8WYtfwZ7LRp4sBIIMRo%3D&to=d6&size=1515592098&sta_dx=1515592098&sta_cs=829&sta_ft=mp4&sta_ct=0&sta_mt=0&fm2=MH,Guangzhou,Netizen-anywhere,,jiangsu,ct&newver=1&newfm=1&secfm=1&flow_ver=3&pkey=0000b94ca25801c1e83aea555a76081945d1&expires=8h&rt=pr&r=439332018&mlogid=6656649430930751208&vuk=4070653298&vbdid=-&fin=%5B1993s.top%5D%E7%89%A1%E4%B8%B9%E8%8A%B1%E4%B8%8B.2017.%E4%B8%AD%E8%8B%B1%E5%AD%97%E5%B9%95.BDrip.AAC.720p.x264.mp4&bflag=d6,h1,p2,9,18,19-d6&check_blue=1&rtype=1&iv=2&dp-logid=6656649431064968936&dp-callid=0.1.1&tsl=0&csl=0&csign=mIyir4Ru1jhEpEDpqvzsuL%2Fqyi8%3D&so=1&ut=1&uter=0&serv=1&uc=0&ic=2208169077&ti=220620fd8d32b115af1448de98394e88f58df91b2b77418b&by=themis',
			summary:'Yes , you know what , i am the Summary for this!!'
		}
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

app.get('/admin/list', function(req,res){
	res.render('list', {
		title: '列表页',
		movies:[{
		    _id:1,
		    title: '机械战警',
		    director:'何塞.帕迪利亚',
		    year:2014,
		    country:'美国',
		    language:'英语',
		    poster: './assets/images/002.png',
		    flash: 'http://player.youku.com/player.php/sid/XNJA1Njc0NTUy/v.swf',
		    summary:'我是描述我是描述我是描述我'
		},{
		    _id:2,
		    title: '机械战警',
		    director:'何塞.帕迪利亚',
		    year:2012,
		    country:'美国',
		    language:'英语',
		    poster: './assets/images/001.png',
		    flash: 'http://player.youku.com/player.php/sid/XNJA1Njc0NTUy/v.swf',
		    summary:'我是描述我是描述我是描述'
		},
		{
		    _id:2,
		    title: '机械战警',
		    director:'何塞.帕迪利亚',
		    year:2012,
		    country:'美国',
		    language:'英语',
		    poster: './assets/images/001.png',
		    flash: 'http://player.youku.com/player.php/sid/XNJA1Njc0NTUy/v.swf',
		    summary:'我是描述我是描述我是描述'
		}
		]
	})
})
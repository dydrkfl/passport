var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser')
var compression = require('compression');
var session = require('express-session')
var LokiStore = require('connect-loki')(session)
var db = require('./lib/db');

var helmet = require('helmet')
app.use(helmet());
var flash = require('connect-flash');
// 이전 nodejs-m 강의에서 빼먹은 것.



// /topic으로 시작하는 주소들에 대해 미들웨어 topicRouter 를 제공하겠다.
app.use(express.static('public'));
// public폴더 내에서 static파일을 찾겠다.
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(compression());

app.use(session({
  // HttpOnly : true,
  // javascript로 접근하는 것 막음

  // secure: true,
  // https 통신했을 때만 session받을 수 있게 함.
  secret: 'asadlfkj!@#!@#dfgasdg',
  resave: false,
  saveUninitialized: true,
  store: new LokiStore(),
}))
app.use(flash());
//무조건 session 다음에!! / middle ware는 실행순서가 중요하다.
// app.get('/flash', function(req,res){
//   req.flash('msg', 'Flash is back!');
//   res.send('flash');
// });
// app.get('/flash-display', function(req,res){
//   var fmsg = req.flash();
//   console.log(fmsg);
//   res.send(fmsg);
// });


// passport 는 session을 이용하기 때문에 반드시 session을 사용하는 code 보다 아래에 나와야 함.
var passport = require('./lib/passport')(app);


app.get('*', function (request, response, next) {
  // * : 모든요청 / 만약 그냥 app.use로 썼다면 post 방식에 대해서도 작동하므로 비효율적임.
  request.list = db.get('topics').value();
 
    next();


})

var topicRouter = require('./routes/topic');
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth')(passport);

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);



app.use(function (req, res, next) {
  res.status(404).send('Sorry cant find that!');
});
app.use(function (err, req, res, next) {
  // 4개의 인자를 가진 함수는 express에서 error를 핸들링하는 함수로 약속되어 있음.
  res.status(500).send('Something broke!');
});



app.listen(3000, function () {
  console.log('Example app listening on port 3000');
})

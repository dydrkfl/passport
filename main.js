var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser')
var compression = require('compression');
var session = require('express-session')
var FileStore = require('session-file-store')(session)

var helmet = require('helmet')
app.use(helmet());
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
  store:new FileStore()
}))
var authData = {
  email : 'qqfelix@naver.com',
  password : '111111', 
  nickname : 'yongdoll'
}

// passport 는 session을 이용하기 때문에 반드시 session을 사용하는 code 보다 아래에 나와야 함.
var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user,done){
  // 로그인에 성공했을때, 로그인에 성공한 사실을 session store에 저장하는 역할.(1번만 호출)
  console.log('serializeUser',user);
  done(null,user.email);
})
passport.deserializeUser(function(id,done){
  // 방문한 사람이 로그인했는지 안했는지 체크하는 함수.(우리가 필요한 정보를 조회할 때마다 호출)
  console.log('deserializeUser',id);
  done(null,authData);
})

passport.use(new LocalStrategy({
  usernameField : 'email',
  passwordField : 'pwd'
  // default value -> username..: 'username' / password : 'password'
},  
  function(username, password, done){
    console.log('LocalStrategy', username, password); 
    if(username === authData.email){
      console.log(1)
        if(password === authData.password){
          console.log(2)

          return done(null, authData);
        }
        else{
          console.log(3)

              return done(null, false, {
          message: 'Incorrect password'
        });
        }
    }
    else{
      console.log(4)

      return done(null, false, {
        message: 'Incorrect username'
      })
    }
  }
));
app.post('/auth/login_process',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect : '/auth/login'
    }));

app.get('*',function (request, response, next) {
  // * : 모든요청 / 만약 그냥 app.use로 썼다면 post 방식에 대해서도 작동하므로 비효율적임.

  fs.readdir('./data', function (error, filelist) {
    request.list = filelist;
    next();


  });

})

var topicRouter = require('./routes/topic');
var indexRouter =require('./routes/index');
var authRouter =require('./routes/auth');

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);



app.use(function(req,res,next){
  res.status(404).send('Sorry cant find that!');
});
app.use(function(err, req,res,next){
  // 4개의 인자를 가진 함수는 express에서 error를 핸들링하는 함수로 약속되어 있음.
  res.status(500).send('Something broke!');
});



app.listen(3000, function () {
  console.log('Example app listening on port 3000');
})


var db = require('../lib/db')

module.exports =function(app){
    

    var authData = {
        email : 'qqfelix@naver.com',
        password : '111111', 
        nickname : 'yongdoll'
      }
var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user,done){
  // 로그인에 성공했을때, 로그인에 성공한 사실을 session store에 저장하는 역할.(1번만 호출)
  console.log('serializeUser',user);
  done(null,user.id);
})
passport.deserializeUser(function(id,done){
  // sesstion store 에 접근해 방문한 사람이 로그인한 사용자인지 아닌지 체크하는 함수.(우리가 필요한 정보를 조회할 때마다 호출)
  var user = db.get('users').find({id:id}).value();
  console.log('deserializeUser',id, user);
 
  done(null,user);
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

          return done(null, authData,{
            message: 'Welcome'});
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
return passport;
}
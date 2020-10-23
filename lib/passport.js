var db = require('../lib/db')
var bcrypt = require('bcrypt');
module.exports = function (app) {

  var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function (user, done) {
    // 로그인에 성공했을때, 로그인에 성공한 사실을 session store에 저장하는 역할.(1번만 호출)
    console.log('serializeUser', user);
    done(null, user.id);
  })
  passport.deserializeUser(function (id, done) {
    // sesstion store 에 접근해 방문한 사람이 로그인한 사용자인지 아닌지 체크하는 함수.(우리가 필요한 정보를 조회할 때마다 호출)
    var user = db.get('users').find({
      id: id
    }).value();
    console.log('deserializeUser', id, user);

    done(null, user);
  })

  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'pwd'
      // default value -> username..: 'username' / password : 'password'
    },
    function (email, password, done) {
      console.log('LocalStrategy', email, password);
      var user = db.get('users').find({
        email: email 
      }).value();
      if (user) {
        bcrypt.compare(password, user.password, function(err, result){
          if(result){
            return done(null, user, {
              message: 'Welcome'
            });
          }else {
            return done(null, false, {
              message: 'Password is not correct'
            })
    
          }
        })
        
      } else {
        return done(null, false, {
          message: 'There is no email.'
        })

      }
    }

  ));
  return passport;
}
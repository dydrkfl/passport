var express = require("express");
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template');

var authData = {
  email: 'qqfelix@naver.com',
  password: '111111',
  nickname: 'yongdoll'
}



router.get('/login', function (request, response) {
  var title = 'WEB - login';
  var list = template.list(request.list);
  var html = template.HTML(title, list, `
    <form action="/auth/login_process" method="post">
      <p><input type="text" name="email" placeholder="email"></p>
      <p><input type="password" name="pwd" placeholder="password"></p>

      <p>
        <input type="submit" value = "login">
      </p>
    </form>
  `, '');
  response.send(html);

});

// router.post('/login_process', function (request, response) {
//   var post = request.body;
//   var email = post.email;
//   var password = post.pwd;
//   if (email === authData.email) {
//     if (password === authData.password) {
//       request.session.is_logined = true;
//       request.session.nickname = authData.nickname;
//       request.session.save(function(){
//         // 곧바로 session store에 session을 기록하는 작업을 하고 이 작업이 끝나면 callback 함수 실행
//         // 이로써, session이 저장되지 않은 상태에서 redirect가 발생하는 문제 막음.
//         response.redirect('/');
//       });
//     } else {
//       response.send('Wrong password');

//     }
//   } else {
//     response.send('WHO?');

//   }

// })
router.get('/logout', function (request, response) {
  request.session.destroy(function (err) {
    response.redirect('/');
  })
});

module.exports = router;

var express = require('express');
var router = express.Router();
var template = require('../lib/template');
var auth = require('../lib/auth')


router.get('/', function (request, response) {
  console.log('/', request.user);
  // passport를 사용하게 되면  request에 user 객체를 주입해줌.
  var fmsg = request.flash();
  var feedback = '';
  if(fmsg.success){
    feedback = fmsg.success[0];
  }
  else if(fmsg.error){
    feedback=fmsg.error[0];
  }
  var title = 'Welcome';
  var description = 'Hello, Node.js';
  var color =fmsg.success? 'blue': 'red';
  var list = template.list(request.list)
  var html = template.HTML(title, list,
    `
     <div style="color:${color};">${feedback}</div>

      <h2>${title}</h2>${description}
      <img src= "/images/hello.jpg" style="width: 300px; display: block; margin-top: 10px;">
      `,
    `<a href="/topic/create">create</a>`,
    auth.statusUI(request, response)
  );
  response.send(html);

});
module.exports = router;
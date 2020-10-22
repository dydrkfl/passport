var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
var FileStore = require('session-file-store')(session)
  
var app = express()
  
app.use(session({
  secret: 'keyboard cat',
  resave: false,
//   false: session data가 바뀔 때만 저장함.
  saveUninitialized: true,
//   true : session 이 필요할 때만 사용함 / false: 항상 사용 -> 서버에 부담 줄 수 있음
    store: new FileStore()
    // 본래 session data는 memory에 저장된다, 하지만, 임의로 session-file-store를 지정할 경우 사용자가 session을 갖고 있을 때 req.header의 쿠키값으로
    // session id를 전달한다. 그러면 session middleware는 해당 id 값에 대응되는 값을 session store에서 찾고 req.session 에 객체를 추가.

}))

app.get('/', function(req,res,next){
    console.log(req.session)
    if(req.session.num === undefined){
        req.session.num = 1;
    }
    else{
        req.session.num = req.session.num +1;

    }
    res.send(`Views : ${req.session.num} `)
})

 
app.listen(3000, function(){
    console.log('3000!');
});
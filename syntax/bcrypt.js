const bcrypt = require('bcrypt');
const saltRounds = 10;
// 실행횟수를 줄여줌.
const myPlaintextPassword = '111111';
const someOtherPlaintextPassword = '111112';

bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    console.log(hash);
    bcrypt.compare(myPlaintextPassword, hash, function(err,result){
        console.log('mypassword', result);
    })
    bcrypt.compare(someOtherPlaintextPassword, hash, function(err,result){
        console.log('other password', result);
    })
    // Store hash in your password DB.
});

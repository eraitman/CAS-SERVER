exports.render =function(req,res){

    console.log("index 요청됨");
    if(!req.user)
    {
        console.log('사용자 인증이 안됨');
        res.redirect('/login');
        return;
    }
    console.log('사용자 인증이 됨');
    res.redirect('/main');
    
}   
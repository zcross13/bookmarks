const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    let token = req.get('Authorization')

    if(token){
        token = token.replace('Bearer ', '') //replace bearer with an empty string
        
        jwt.verify(token, process.env.SECRET, function(err, decoded){
            req.user = err ? null : decoded.user //store decoded user here 
            req.exp = err ? null : new Date(decoded.exp * 1000) 
            res.locals.data.email = decoded.user.email // store decode user email 
        })
        return next()
    }else{
        req.user = null 
        return next()
    }
}
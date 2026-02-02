const userAuth = (req,res,next)=>{
    const token = 'a'
    const isAuthorized = 'a'
    if(isAuthorized===token){
        next()
    }
    else{
        res.status(400).send('not authorized')
    }
}

const hrAuth = (req,res,next)=>{
    const token = 'n'
    const isAuthorized = 'n'
    if(isAuthorized===token){
        next()
    }
    else{
        res.status(400).send('not authorized')
    }
}

module.exports={userAuth, hrAuth}
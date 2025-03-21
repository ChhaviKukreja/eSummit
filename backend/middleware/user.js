const { User }=require("../db");
const jwt=require("jsonwebtoken");
const JWT_SECRET = 'amogh1212';

function userMiddleware(req,res,next){
    try{
        const token=req.headers.authorization;
        const words=token.split(" ");
        const jwtToken=words[1];

        const decodedValue= jwt.verify(jwtToken,JWT_SECRET);
        if (decodedValue.email) {
            req.email = decodedValue.email; // Set username in request object
            next();
        }
        else{
            res.status(403).json({
                msg:"You are not authenticated"
            })
        }
    } catch(e){
        res.json({
            msg:"Incorrect inputs"
        })
    }  
}
module.exports=userMiddleware;
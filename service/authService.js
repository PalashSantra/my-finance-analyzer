const {convertFromBase64, convertToBase64} = require('../helper/helper')
const jwt = require('jsonwebtoken')

const authenticate = async (req,res,next) => {
    try {
        const encodedToken = req.headers.authorization.replace('Bearer ','')
        const decodedToken = convertFromBase64(encodedToken)
        isVerified = await jwt.verify(decodedToken,process.env.SECRET)
        if((Date.parse(isVerified.expiry)-new Date(Date.now()))<0){
            return res.status(200).json({
                status:'error',
                message:'Token expired'
            })
        }
        else{
            next()
        }
    } catch (error) {
        console.log(error)
        return res.status(422).json({
            status:'error',
            message:'Bad Token'
        })
    }
    
    
}

const refreshAuthToken = async (req,res) => {
    try{
        const encodedToken = req.headers.refreshtoken
        const decodedToken = convertFromBase64(encodedToken)
        isVerified = await jwt.verify(decodedToken,process.env.REFRESH_TOKEN_SECRET)
        if((Date.parse(isVerified.expiry)-new Date(Date.now()))<0){
            return res.status(422).json({
                status:'error',
                message:'Token expired'
            })
        }
        else{
            authToken = await generateAuthToken(isVerified._id)
            return res.status(200).json({
                status:'success',
                message:'Successfully token generated',
                token:convertToBase64(authToken)
            })
        }
    }catch(e){
        console.log('Token generation failed',e)
        return res.status(500).json({
            status:'error',
            message:'Bad Token'
        })
    }
}

const generateAuthToken = async function(_id){
    try{
        let token = await jwt.sign({_id:_id,expiry:new Date(Date.now()+Number(process.env.TOKEN_TIMEOUT))},process.env.SECRET)
        return new Promise((resolve,reject)=>{
            if(token){
                resolve(token)
            }
            else{
                reject(token)
            }
        })
    }
    catch(e){
        console.log('Token creation failed',e)
        throw e
    }
}

module.exports = {authenticate,refreshAuthToken}
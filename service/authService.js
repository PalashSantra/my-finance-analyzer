const {convertFromBase64} = require('../helper/helper')
const jwt = require('jsonwebtoken')

const authenticate = async (req,res,next) => {
    try {
        const encodedToken = req.headers.authorization.replace('Bearer ','')
        const decodedToken = convertFromBase64(encodedToken)
        isVerified = await jwt.verify(decodedToken,process.env.SECRET)
        if((Date.parse(isVerified.expiry)-new Date(Date.now()))<0){
            return res.status(422).json({
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

module.exports = authenticate
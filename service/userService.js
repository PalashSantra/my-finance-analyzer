const bcrypt = require('bcryptjs')
const Validator = require('validatorjs')
const User = require('../model/userModel')
const {convertToBase64} = require('../helper/helper')

const register = async (req,res) =>{
    const validationRule = {
        name:'required|string|min:2',
        email:'required|email',
        phone:'required',
        password:'required|string',
        cpassword:'required|string'
    }
    try{
        const validation = await new Validator(req.body,validationRule)
        if(validation.fails()){
            console.log(validation.errors)
            return res.status(422).json({
                status:'error',
                message:'Fill the inputs properly',
                result:validation.errors
            })
        }
        const inputData = {name,email,phone,password,cpassword} = req.body
        if(inputData.password!==inputData.cpassword){
            return res.status(422).json({
                status:'error',
                message:'Password and confirm password not matched'
            })
        }
        userExists = await User.findOne({email:inputData.email})
        if(userExists) return res.status(422).json({
            status:'error',
            message:'Email already exist'
        })
        const user = new User(inputData)
        await user.save()
        return res.status(200).json({
            status:'success',
            message:'Successfully registered'
        })
    }catch(e){
        console.log('Error in user registration',e)
        return res.status(500).json({
            status:'error',
            message:'Something went wrong'
        })
    }
}

const login = async (req,res) =>{
    const validationRule = {
        email:'required|email',
        password:'required|string'
    }
    try {
        const validation = await new Validator(req.body,validationRule)
        const {email,password} = req.body
        if(validation.fails()){
            return res.status(422).json({
                status:'error',
                message:'Fill the data properly',
                result:validation.errors
            })
        }
        user = await User.findOne({email:email})
        if(user){
            isMatched = await bcrypt.compare(password,user.password)
            if(isMatched){
                token = await user.generateAuthToken()
                user_id = user._id
                await res.cookie('authToken',convertToBase64(token),{
                    expires:new Date(Date.now()+(1000*60*3))
                })
                return res.status(200).json({
                    status:'success',
                    message:'Successfully logged in',
                    user_id:user_id,
                    token:convertToBase64(token)
                })
            }else{
                return res.status(400).json({
                    status:'error',
                    message:'Credential not matched'
                })
            }
            }
            else{
                return res.status(400).json({
                    status:'error',
                    message:'Credential not matched'
                })
            }
         
    } catch (e) {
        console.log('Login failed',e)
        return res.status(500).json({
            status:'error',
            message:'Something went wrong'
        })
    }
}

const logout = async (req,res) =>{
    console.log('Logged out')
}



module.exports = {
    register,
    login,
    logout
}
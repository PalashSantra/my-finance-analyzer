const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    isActive:{
        type:Boolean,
        required:true,
        default:false
    }
})

schema.pre('save', async function(next){
    try{
        if(this.isModified('password')){
            this.password = await bcrypt.hash(this.password,12)
            this.cpassword = await bcrypt.hash(this.cpassword,12)
        }
    }
    catch(e){
        console.log('Password hassing failed',e)
    }
    
})

schema.methods.generateAuthToken = async function(){
    try{
        let token = await jwt.sign({_id:this._id,expiry:new Date(Date.now()+(Number(process.env.TOKEN_TIMEOUT)))},process.env.SECRET)
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

schema.methods.generateRefreshToken = async function(){
    try{
        let token = await jwt.sign({_id:this._id,expiry:new Date(Date.now()+(Number(process.env.REFRESH_TOKEN_TIMEOUT)))},process.env.REFRESH_TOKEN_SECRET)
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

const User = mongoose.model("users",schema)

module.exports = User

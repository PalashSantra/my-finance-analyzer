const mongoose = require('mongoose')

const initializeDB = async function(){
    let DB
    if(process.env.PROFILE==='DEV')
        DB = process.env.DATABASE_DEV
    else
    DB = process.env.DATABASE
    return new Promise((resolve,reject)=>{
        mongoose.connect(DB).then(()=>{
            console.log('DB Connected');
            resolve()
        }).catch(e=>{
            console.log('DB Connection fail',e)
            reject()
        })
    })
}

module.exports = initializeDB

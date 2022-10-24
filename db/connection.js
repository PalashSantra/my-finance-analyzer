const mongoose = require('mongoose')

const initializeDB = async function(){
    const DB = process.env.DATABASE
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

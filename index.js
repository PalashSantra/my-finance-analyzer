const express = require('express')
const dotenv = require('dotenv')
const route = require('./router/route')
const initializeDB = require('./db/connection')
const path = require('path')

// Environment Config
// Not required for deployment
dotenv.config({path:'./config.env',override:true})

//Initializing DB
require('./db/connection')
initializeDB().then(()=>{}).catch(()=>{})
//Configure Express
const app = express()
app.use(express.json()).use(route)
app.use('/', express.static(path.join(__dirname, './dist/my-finance-analyzer-angular')))
app.use((req, res, next) => {
    let url
    if(process.env.PROFILE && process.env.PROFILE==='DEV')
        url='http://localhost:4200'
    else if(process.env.PROFILE && process.env.PROFILE==='PROD')
        url=process.env.PROD_URL
    if(url){
        res.setHeader('Access-Control-Allow-Origin', url);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Credentials', true);
    }
    next();
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './dist/my-finance-analyzer-angular/index.html'));
});
app.listen(process.env.PORT, async ()=>{
    console.log(`Server is running at port : ${process.env.PORT}`);
})
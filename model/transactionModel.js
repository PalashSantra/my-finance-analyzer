const mongoose = require('mongoose')

const typeSchema = new mongoose.Schema({
    cat1:{
        type:String,
        enum:['Secured','Insurance','Mutual Fund','Stocks','Crypto'],
        required:false
    },
    cat2:{
        type:String,
        enum:['PPF','Gold Bond','Gold','SSS','NSS','KVP','SCS','RBI Bond','FD','Recurring','NPS','TB',
                'Term','Savings','Health','Car','Bike','House','Appliances',
                'ELSS','ELC','EMC','ESC','EB','Debt','Sectoral'],
        required:false
    }
})

const ledgerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    group:{
        type:String,
        enum:['Bank','Credit Card','Investment','Loan','Cash'],
        required:true
    },
    type : typeSchema
})
const schema = new mongoose.Schema({
    tran_date:{
        type:Date,
        required:true
    },
    particulars:{
        type:String,
        required:true
    },
    tran_type:{
        type:String,
        enum:['DR','CR'],
        required:true
    },
    cost:{
        amount : {
            type:Number,
            required:true
        },
        unit:{
            type:Number,
            required:false
        }
    },
    ledger: ledgerSchema,
    tags:{type:Array, required:false},
    user_id : {type: String, required:true},
    isDeleted:{
        type:Boolean,
        required:true,
        default:false
    },
    createdAt : {
        type: String,
        required:true,
        default : mongoose.now()
    },
    updatedAt : {
        type: String,
        required:false
    },
})
const Transaction = mongoose.model('transaction',schema)
module.exports = {Transaction,ledgerSchema}
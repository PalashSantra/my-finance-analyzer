const Validator = require('validatorjs')
const Ledger = require('../model/ledgerModel')
const { Transaction } = require('../model/transactionModel')
const ObjectId = require('mongoose').Types.ObjectId

const validationRule = {
    'name': 'required',
    'group': 'required|string',
    'type.cat1': 'string',
    'type.cat2': 'string',
    'user_id': 'required|string'
}

const saveData = async (req, res) => {
    try {
        const validation = await new Validator(req.body, validationRule)
        if (validation.fails()) {
            console.log(validation.errors)
            return res.status(422).json({
                status: 'error',
                message: 'Fill the inputs properly',
                result: validation.errors
            })
        }
        const inputData = req.body
        dataExist = await Ledger.findOne({ 
            'name': inputData.name,
            'user_id' : inputData.user_id
        })
        if (dataExist) {
            return res.status(422).json({
                status: 'error',
                message: 'Ledger exist with same information'
            })
        }
        ledger = new Ledger(inputData)
        await ledger.save()
        return res.status(200).json({
            status: 'success',
            message: 'Ledger saved successfully'
        })
    } catch (e) {
        console.log('Ledger add failed', e)
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}

const listData = async (req, res) => {
    try {
        let {user_id,name} = req.body
        if (!name) name = ""
        if(!user_id){
            return res.status(422).json({
                status: 'error',
                message: 'Input is not good'
            })
        }
        const list = await Ledger
                            .find({
                                "user_id":user_id,
                                name:{
                                    "$regex": name, 
                                    "$options": "i"
                                }
                            })
                            .sort({'name':1})
        return res.status(200).json({
            status: 'success',
            message: 'all ledger data fetched',
            result: list
        })
    } catch (e) {
        console.log('ledger listing failed', e)
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}

const getData = async (req, res) => {
    try {
        const ledger_id = req.params.ledger_id
        if(!ledger_id){
            return res.status(422).json({
                status: 'error',
                message: 'Input is not good'
            })
        }
        const details = await Ledger
                            .find({"_id":ledger_id})
        return res.status(200).json({
            status: 'success',
            message: 'ledger details fetched',
            result: details
        })
    } catch (e) {
        console.log('ledger details fetching failed', e)
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}

const getLedgerBalance = async(req, res)=>{
    try{
        const {ledger_id,user_id} = req.body
        let detailsTran
        if(ledger_id){
            detailsTran = await Transaction
            .aggregate([
                {
                    $match: {
                        'ledger._id' : new ObjectId(ledger_id),
                        'user_id': user_id
                    }
                },
                {
                    $group: {
                        _id: {
                                ledger_id:"$ledger._id",
                                ledger_name:"$ledger.name",
                                user_id:"$user_id"
                        },
                        "sum": {$sum : "$cost.amount"}
                    }
                    
                }
            ]).allowDiskUse(true)
        }else{
            detailsTran = await Transaction
            .aggregate([
                {
                    $group: {
                        _id: {ledger_id:"$ledger._id",ledger_name:"$ledger.name"},
                        "sum": {$sum : "$cost.amount"}
                    }
                    
                }
            ]).allowDiskUse(true)
        }
        detadetailsTran = detailsTran.sort((a,b)=>a.sum<b.sum?1:-1)
        const details = detailsTran.map(item=>{
            return {
                'ledger_id': item._id.ledger_id,
                'ledger_name' : item._id.ledger_name,
                'balance' : Math.abs(item.sum),
                'balance_type' : item.sum>0? 'CR':'DR'
            }
        })
        return res.status(200).json({
            status: 'success',
            message: 'ledger balance details fetched',
            result: details
        })
    }catch(e){
        console.log('ledger details fetching failed', e)
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}

module.exports = {
    saveData,
    listData,
    getData,
    getLedgerBalance
}
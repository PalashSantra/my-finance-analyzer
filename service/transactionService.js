const Validator = require('validatorjs')
const Transaction = require('../model/transactionModel').Transaction

const validationRule = {
    'tran_date': 'required|date',
    'particulars': 'required|string',
    'tran_type': 'required|string',
    'cost.amount': 'required|numeric',
    'cost.unit': 'numeric',
    'ledger.name': 'required',
    'ledger.group': 'required|string',
    'ledger.type.cat1': 'string',
    'ledger.type.cat2': 'string',
    'tag': 'array',
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
        dataExist = await Transaction.findOne({ 
            'tran_date': inputData.tran_date,
            'particulars' : inputData.particulars,
            'tran_type': inputData.tran_type,
            'cost.amount': inputData.cost.amount,
            'ledger.name' : inputData.ledger.name,
            'user_id' : inputData.user_id
        })
        if (dataExist) {
            return res.status(422).json({
                status: 'error',
                message: 'Transaction exist with same information'
            })
        }
        transaction = new Transaction(inputData)
        console.log('input data',inputData)
        console.log('transaction',transaction)
        await transaction.save()
        return res.status(200).json({
            status: 'success',
            message: 'Transaction saved successfully'
        })
    } catch (e) {
        console.log('Transaction add failed', e)
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}

const listData = async (req, res) => {
    try {
        const {page,pageSize,user_id} = req.body
        if(page && pageSize && user_id){
            const list = await Transaction
                            .find({'user_id':user_id})
                            .sort({tran_date:-1})
                            .skip((page-1)*pageSize)
                            .limit(pageSize)
            const docCount = await Transaction.find({'user_id':user_id}).count()
            return res.status(200).json({
                status: 'success',
                message: 'all transaction data fetched',
                result: {data:list,total:docCount}
            })
        }else{
            console.log("input not filled properly")
            return res.status(422).json({
                status: 'error',
                message: 'Fill the inputs properly'
            })
        }
        
    } catch (e) {
        console.log('transaction listing failed', e)
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}

const getData = async (req, res) => {
    try {
        const tran_id = req.params.tran_id
        if(!tran_id){
            return res.status(422).json({
                status: 'error',
                message: 'Input is not good'
            })
        }
        const details = await Transaction
                            .find({"_id":tran_id})
        return res.status(200).json({
            status: 'success',
            message: 'transaction details fetched',
            result: details
        })
    } catch (e) {
        console.log('transaction details fetching failed', e)
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}

module.exports = {
    saveData,
    listData,
    getData
}

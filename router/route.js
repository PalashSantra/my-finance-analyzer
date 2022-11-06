const express = require('express')
const userService = require('../service/userService')
const transactionService = require('../service/transactionService')
const ledgerService = require('../service/ledgerService')
const authenticate = require('../service/authService')

const router = express.Router()

router.get('/health', (req,res)=>{
    try{
        res.send('Server is up')
    }
    catch(e){
        console.log('Health not OK',e)
    }
})
router.post('/user/register', userService.register)
router.post('/loginMe', userService.login)
router.post('/logout', userService.logout)

router.post('/transaction/save', authenticate ,transactionService.saveData)
router.post('/transaction/list', authenticate ,transactionService.listData)
router.get('/transaction/:tran_id', authenticate ,transactionService.getData)

router.post('/ledger/save', authenticate ,ledgerService.saveData)
router.post('/ledger/list', authenticate ,ledgerService.listData)
router.get('/ledger/:ledger_id', authenticate ,ledgerService.getData)


module.exports = router



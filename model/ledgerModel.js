const mongoose = require('mongoose')
const ledgerSchema = require('./transactionModel').ledgerSchema
const schema = new mongoose.Schema(ledgerSchema)

const Ledger = mongoose.model('ledger',schema)
module.exports = Ledger
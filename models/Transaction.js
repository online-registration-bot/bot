const mongoose = require("mongoose")

const TransactionSchema = new mongoose.Schema({
    transactionNumber:{
        type:String,
        unique:true
    },
    amount:{
        type:String
    },
    phoneNumber:{
        type:String
    }
})


module.exports = mongoose.model("Transaction", TransactionSchema)
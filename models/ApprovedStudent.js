const mongoose = require("mongoose");

const ApprovedStudentSchema = new mongoose.Schema({
    studentId:{
        type:String,
        unique:true
    },
    studentName:{
        type:String
    },
    grade:{
        type:String
    }
},
    {
    timestamps:true
})

module.exports = mongoose.model("ApprovedStudent", ApprovedStudentSchema)
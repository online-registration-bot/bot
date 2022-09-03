const mongoose = require("mongoose")

const RegisteredStudentSchema = new mongoose.Schema({
    studentGrade:{
        type:String
    },
    studentName:{
        type:String
    },
    studentSex:{
        type:String
    },
    yearOfBirth:{
        type:String
    },
    studentPicture:{
        type:String
    },
    reportCard:{
        type:String
    },
    transcript:{
        type:String
    },
    parentName:{
        type:String
    },
    parentSex:{
        type:String
    },
    parentPhoneNumber:{
        type:String
    },
    address:{
        type:String
    },
    parentPicture:{
        type:String
    },
    // studentId:{
    //     type:String,
    //     required:true
    // }
})


module.exports = mongoose.model("RegisteredStudent", RegisteredStudentSchema)
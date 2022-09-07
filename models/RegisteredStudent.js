const mongoose = require("mongoose")

const RegisteredStudentSchema = new mongoose.Schema({
    studentGrade:{
        type:String
    },
    studentName:{
        type:String
    },
    studentId:{
        type:String
    }, //new
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
    seen:{
        type:Boolean,
        default:false
    }
})


module.exports = mongoose.model("RegisteredStudent", RegisteredStudentSchema)
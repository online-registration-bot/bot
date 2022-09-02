//The user shcema(the database design for each user)
const mongoose = require("mongoose");



const UserSchema = new mongoose.Schema({
    //profiles
    userId:{
        type: Number,
        required:true,
        unique: true
    },
    language:{
        type:Number,
        default:0
    },
    //registration
    newStudentRegistering:{
        type:Boolean,
        default:false
    },
    currentStudentRegistering:{
        type:Boolean,
        default:false
    },
    parentRegistering:{
        type:Boolean,
        default:false
    },
    studentGrade:{
        type:Number
    },
    questionType:{
        type:Number
    },
   studentQuestionCounter:{
        type:Number,
        default:0
   },
   parentQuestionCounter:{
        type:Number,
        default:0
   },
    studentId:{
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
    finishedRegistering:{
        type:Boolean,
        default:false
    }
},
    {timestamps:true}
)

module.exports = mongoose.model("User", UserSchema);
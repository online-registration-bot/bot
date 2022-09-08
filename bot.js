//packages
const {Telegraf} = require("telegraf") //initializing the telegraf package
const dotenv = require("dotenv"); //to store sensitive information like api keys
dotenv.config();
const bot= new Telegraf(process.env.TOKEN); //our bot token
const express = require("express"); //initializing the express package
const axios = require("axios"); //to send http requests(to connect to hahucloud)
const fs = require("fs"); //to intereact with files on the computer
const mongoose = require('mongoose'); //to have easier connection with our mongodb database
const User = require("./models/User");
const RegisteredStudent = require("./models/RegisteredStudent");


//variables
const studentQuestionNew = [
    {
        type:1,
        questions:[["fullName "," year of birth","sex"," picture of student"],
        ["ሙሉ ስም","የትውልድ ዘመን","ጾታ","የተማሪው ፎቶ",],
        ["Maqaa","waggaa dhalootaa","salla","suura barataa"]]
    },
    {
        type:2,
        questions:[["fullname","year of birth","sex"," picture of student","picture of report kard"],
        ["ሙሉ ስም","የትውልድ ዘመን", "ጾታ" ,"የተማሪው ፎቶ" ,"የሪፖርት ካርድ በፎቶ"],
        ["Maqaa","waggaa dhalootaa","salla","suura barataa","suura riipoort kaardii"]]
    },
    {
        type:3,
        questions:[["fullname","year of birth","sex"," picture of student","picture of report card","picture of transcript"],
        ["ሙሉ ስም","የትውልድ ዘመን", "ጾታ" ,"የተማሪው ፎቶ" ,"የሪፖርት ካርድ በፎቶ","ትራንስክሪብት በፎቶ"],
        ["Maqaa","waggaa dhalootaa"," salla","suura barataa","suura riipoort kaardii","suura tiraaniskiriipti"]]
    }   
]


const studentQuestionCurrent=[["Insert the student id number","picture of student","picture of report card"],
    ["የተማሪው መለያ ቁጥር ያስገቡ","የተማሪው ፎቶ","የውጤት ካርድ ፎቶ"],
    ["...","suura barataa","suura riipoort kaardii"]]; //new: student id?

const transitionQuestion = [
    "you have finished filling the student form next will be parent form",
    "የተማሪ ፎርም ሞልተው ጨርሰዋል የወላጅ ይከተላል",
    "Ragaa barataa guuttanii xumurtaniittu,gara ragaa maatiitti darbaa"
]
const parentQuestion=[["Parent's fullname", "phone numeber of parent","address","picture of parent"],
    ["የወላጅ ሙሉ ስም", "የወላጅ ሰልክ" ,"አድራሻ" ,"የወላጅ ፎቶ"],
    ["maqaa","lakkoofsa bilbila maatii","teessoo","suura matii"]]
 
const successfulRegistrationReply = [
    "you have finished filling the form wait untill the information is detected you will recive SMStext of confirmation","ፎርሙን ሞልተው ጨርሰዋል ትንሽ  ይጠብኩ የማረጋገጫ SMS መለክት ይገባሎታል","formii gutanii xumurtanii jirtuu xiqqoo eegee ergaan gabaabee isin ga'aati."
] 
const userIdReply = [
    "student id: ",  "የተማሪው መለያ ቁጥር፡ ", " student id: "
]


const errorReply = [
    "wrong input, please use '/help' to see the command list","የተሳሳተ መርጃ እባኮት '/help'በመጫን የሚተከሟቸወን ትዕዛዛት የመልከቱ ",""
] 

const gradesInLanguageNew=["grade of the new student","የአዲስ ተማሪው/ዋ ክፍል፡", "kutaa barataa haaraa"];
const gradesInLanguageCurrent=["grade of the current student","የነባር ተማሪው/ዋ ክፍል", "kutaa barataa duraa"];
const languages = ["English", "አማርኛ", "Afaan Oromoo"]
const studentStatusQuestions = [
    {
        question:"choose status",
        choice1:"new student",
        choice2:"current student"
    },
    {
        question:"ለትምህርት ቤታችን፡",
        choice1:"አዲስ ተማሪ",
        choice2:"ነባር ተማሪ"
    },
    {
        question:"mana barumsaa keegnaaf:",
        choice1:"barataa haraa",
        choice2:"barataa duranii"
    }
] 




dotenv.config(); //to start using the dotenv package

//to connect to mongodb atlas
// mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true, useUnifiedTopology:true},(err)=>{
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("connected to mongodb")
//     }
// })


//to connect to local mongodb
mongoose.connect("mongodb://localhost:27017/usersDB",{useNewUrlParser:true, useUnifiedTopology:true},(err)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("connected to mongodb")
        }
})


////////////////helper functions//////////////////////
//start helper: responds the start page
startHelper = (ctx)=>{
    bot.telegram.sendMessage(ctx.chat.id,'choose language/ ቋንቋ ይምረጡ። / afaan filadhaa.',   
    {
        reply_markup:{
            inline_keyboard:[
                [
                    {text:'English',callback_data:'languageOne'},
                    {text:'አማርኛ',callback_data:'languageTwo'}
                ],
                [
                    {text:'Afaan oromoo',callback_data:'languageThree'}
                ]
            ]
        }
    })
}
//student status: replies an inline keyboard and checks if the student is new or current
studentStatusHelper = async (ctx, status) =>{
    bot.telegram.sendMessage(ctx.chat.id,status.question,
    {
     reply_markup:{
        inline_keyboard:[
            [      {text:status.choice1,callback_data:'newStudent'},
                   {text:status.choice2,callback_data:'currentStudent'}                    
             ],
              
         ]
      }
   })
}

//user finding helper: finds the user using the chat id passed to it
userFindingHelper= async (ctx)=>{
    const userChatId = ctx.chat.id;
    const query = {userId:userChatId};
    const user = await User.findOne(query);
    return user;
}

//language changing helper: updates the language the user choose using their chat id
languageHelper = async (ctx, languageNum) =>{
    const userChatId = ctx.chat.id;
    const query = {userId:userChatId};
    await User.findOneAndUpdate(query, {language:languageNum});
    const user = await User.findOne({userId: userChatId});
    console.log(user.language);
}

//grade selection helper: responds the grade list based on the language the user chose
gradesInLanguageHelper = (ctx, response) =>{
    bot.telegram.sendMessage(ctx.chat.id,response,
     {
      reply_markup:{
         inline_keyboard:[
             [      {text:'kg-1',callback_data:'-2'},
                    {text:'kg-2',callback_data:'-1'} ,     
                    {text:'kg-3',callback_data:'0'}
                    
              ],
              [
                 
                {text:'1',callback_data:'1'},
                {text:'2',callback_data:'2'}, 
                {text:'3',callback_data:'3'}
                
              ],
              [
                {text:'4',callback_data:'4'},
                {text:'5',callback_data:'5'},
                {text:'6',callback_data:'6'}
              ],
              [
                {text:'7',callback_data:'7'},
                {text:'8',callback_data:'8'},
                {text:'9',callback_data:'9'}
              ],
              [
                {text:'10',callback_data:'10'},
                {text:'11',callback_data:'11'},
                {text:'12',callback_data:'12'}
              ]
          ]
       }
    })
}

//questions in language helper: returns 





//////////////////////////// using the bot ////////////////////////////

///////commands///////
//start: when the user clicks the '/start' command
bot.start(async (ctx)=>{
    //assign the chat id of a user to a variable
    let userChatId = ctx.chat.id;

    const user = await userFindingHelper(ctx);
    if(user){
    console.log("User exists, replaced");
    const query = {userId:userChatId}
    await User.findOneAndReplace(query, {userId:userChatId});    
    console.log(user);
    startHelper(ctx);
}
    else{
    const newUser = new User({userId:userChatId});
    await newUser.save();
    console.log("User saved.");
    console.log(newUser);
    startHelper(ctx);
    }   
    }
)   

//register: when the user clicks the /register command
 bot.command('register', async ctx=>{
    //find the user and the language the user chose using their id
    const userChatId = ctx.chat.id;
    const user = await userFindingHelper(ctx);
    const language = user.language;
    const query = {userId:userChatId}
    const studentIdTemp = "s-" + Date.now();
    await User.findOneAndReplace(query, {userId:userChatId, language:language, studentId:studentIdTemp});
    if(language === 0){
    //if the user chooses the first(English) language
    studentStatusHelper(ctx,studentStatusQuestions[0])
    }
    else if (language === 1){
        //if the user chooses the second(Amharic) language
    studentStatusHelper(ctx,studentStatusQuestions[1])
    }
    else if(language === 2){
        //if the user chooses the third(afaan oromo) language
    studentStatusHelper(ctx,studentStatusQuestions[2])
    }
})

//payment confirmation













//////////actions//////////

//language actions
bot.action('languageOne', async ctx=>{
    languageHelper(ctx,0);
    ctx.answerCbQuery();
    ctx.reply(" to start registering use the '/register'.");
})

bot.action('languageTwo', async ctx=>{
    languageHelper(ctx,1);
    ctx.answerCbQuery();
    ctx.reply("ምዝገባ ለመጀመር ይህን ይንኩ'/register'።");
})
bot.action('languageThree', async ctx=>{
    languageHelper(ctx,2);
    ctx.answerCbQuery();
    ctx.reply("Galmee jalqabuuf ajaja kana xuqi '/register'።");
})  

//student status action
bot.action('newStudent',async ctx=>{
    const user = await userFindingHelper(ctx);
    const language = user.language;
    user.newStudentRegistering = true;
    user.currentStudentRegistering = false;
    //new
    user.newStudent = true;
    user.currentStudent = false;
    //new
    await user.save();
    console.log(user);
    if(language===0){
        gradesInLanguageHelper(ctx, gradesInLanguageNew[0]);
        ctx.answerCbQuery();
    }

     else if(language === 1){
        //if the user chooses the second(Amharic) language
        gradesInLanguageHelper(ctx, gradesInLanguageNew[1]); 
        ctx.answerCbQuery();
    }
    else if(language === 2){
        //if the user chooses the third(afaan oromo) language
        gradesInLanguageHelper(ctx,gradesInLanguageNew[2]);
        ctx.answerCbQuery();
    }
})

    bot.action('currentStudent', async ctx=>{
        const user = await userFindingHelper(ctx);
        const language = user.language;
        user.currentStudentRegistering = true;
        user.newStudentRegistering = false;
        //new
        user.newStudent = false;
        user.currentStudent = true;
        //new
        await user.save();
        console.log(user); 
        ctx.answerCbQuery();
        if(language===0){
            gradesInLanguageHelper(ctx, gradesInLanguageCurrent[0]);
        }
         else if(language === 1){
            //if the user chooses the second(Amharic) language
            gradesInLanguageHelper(ctx, gradesInLanguageCurrent[1]); 
        }
        else if(language === 2){
            //if the user chooses the third(afaan oromo) language
            gradesInLanguageHelper(ctx,gradesInLanguageCurrent[2]);
        }}
    )

bot.action(['-2','-1','0','1','2','3','4','5','6','7','8','9','10','11','12'] , async ctx=>{
    const grade = Number(ctx.match[0]);
    const user = await userFindingHelper(ctx);
    const language = user.language;
    const currentStudentRegistering = user.currentStudentRegistering;
    const newStudentRegistering = user.newStudentRegistering;
    let studentQuestionCounter = user.studentQuestionCounter;
    let parentQuestionCounter = user.parentQuestionCounter;
    //updating the user grade and save
    user.studentGrade = grade;
    await user.save();
    if(newStudentRegistering){
        //starter
        await user.save();
        if( user.studentGrade === -2){ //new
            user.questionType = 1;
            await user.save();
            const questions = studentQuestionNew.find( question => question.type === 1).questions;
            const questionsInLanguage = questions[language];
            ctx.reply(questionsInLanguage[studentQuestionCounter]); 
            user.studentQuestionCounter = studentQuestionCounter + 1;
            await user.save();
            ctx.answerCbQuery();    
        }
        else if(user.studentGrade >=-1 && user.studentGrade<=8){ //new
            user.questionType=2;
            await user.save();
            const questions = studentQuestionNew.find( question => question.type === 2).questions;
            const questionsInLanguage = questions[language];
            ctx.reply(questionsInLanguage[studentQuestionCounter]); 
            user.studentQuestionCounter = studentQuestionCounter + 1;
            await user.save();
            ctx.answerCbQuery();    
         }
        else if(user.studentGrade >=9 && user.studentGrade<=12){ //new
            user.questionType=3;
            await user.save();
            const questions = studentQuestionNew.find( question => question.type === 3).questions;
            const questionsInLanguage = questions[language];
            ctx.reply(questionsInLanguage[studentQuestionCounter]); 
            user.studentQuestionCounter = studentQuestionCounter + 1;
            await user.save();
            ctx.answerCbQuery();    
         }
    }
    else if(currentStudentRegistering){
        user.studentQuestionCurrent;
        await user.save();
        const questionsInLanguage =studentQuestionCurrent[language];
        ctx.reply(questionsInLanguage[studentQuestionCounter]); 
        user.studentQuestionCounter = studentQuestionCounter + 1;
        await user.save();
        ctx.answerCbQuery();    
    }
    
})

bot.on("text",async (ctx)=>{
    
    const user = await userFindingHelper(ctx);
    const grade = user.studentGrade;
    const language = user.language;
    const currentStudentRegistering = user.currentStudentRegistering;
    const newStudentRegistering = user.newStudentRegistering;
    const parentRegistering=user.parentRegistering;
    let studentQuestionCounter = user.studentQuestionCounter;
    let parentQuestionCounter = user.parentQuestionCounter;
    let questionType=user.questionType;
    //updating the user grade and save
    if(newStudentRegistering){
        //starter
        const questions = studentQuestionNew.find( question => question.type === questionType).questions;
        const questionsInLanguage = questions[language];
            //new
            if(studentQuestionCounter <= questionsInLanguage.length-1){
                ctx.reply(questionsInLanguage[studentQuestionCounter]); 
                user.studentQuestionCounter = studentQuestionCounter + 1;
                user.studentInfo.push(ctx.message.text);
                await user.save();
                console.log(user);
            }
            else{
                ctx.reply(errorReply[language]);
            }
            //new
    }
    else if(currentStudentRegistering){
        //new
        const questionsInLanguage = studentQuestionCurrent[language];
        if(studentQuestionCounter <= questionsInLanguage.length - 2){
            ctx.reply(questionsInLanguage[studentQuestionCounter]); 
            user.studentQuestionCounter = studentQuestionCounter + 1;
            user.studentInfo.push(ctx.message.text);
            await user.save();
        }
        else{
            ctx.reply(errorReply[language]);
        }
        //new
    }
    else if(parentRegistering){
        const questionsInLanguage =parentQuestion[language];
        if(parentQuestionCounter <= questionsInLanguage.length - 1){
            ctx.reply(questionsInLanguage[parentQuestionCounter]); 
            user.parentQuestionCounter = parentQuestionCounter + 1;
            user.parentInfo.push(ctx.message.text);
            await user.save();
            console.log(user);
        }
        else{
            ctx.reply(errorReply[language]);
        }
     }
     else{
        ctx.reply(errorReply[language]);
     }
   }
)



bot.on("photo",async (ctx)=>{
    const user = await userFindingHelper(ctx);
    const newStudentRegistering = user.newStudentRegistering;
    const currentStudentRegistering = user.currentStudentRegistering;
    const studentQuestionCounter=user.studentQuestionCounter;
    const parentQuestionCounter=user.parentQuestionCounter;
    const parentRegistering= user.parentRegistering;
    const questionType=user.questionType;
    const language =user.language;
    const studentGrade = Number(user.studentGrade);
    if(newStudentRegistering === true){
        if(questionType === 1 ){
            const questions = studentQuestionNew.find( question => question.type === 1).questions;
            const questionsInLanguage = questions[language];
            if(studentQuestionCounter === questionsInLanguage.length){
                user.newStudentRegistering = false;
                user.parentRegistering=true;
                ctx.reply(transitionQuestion[language]);
                const parentQuestionInLanguge = parentQuestion[language]; 
                ctx.reply(parentQuestionInLanguge[parentQuestionCounter]);
                user.parentQuestionCounter = parentQuestionCounter + 1;
                console.log(ctx.message);
                user.studentInfo.push(ctx.message.photo[0].file_id);
                await user.save();
                console.log(user);
            }
            else{
                errorReply[language];
            }
        }
        else if (questionType===2){
            const questions = studentQuestionNew.find( question => question.type === 2).questions;
            const questionsInLanguage = questions[language];
            if(studentQuestionCounter === 4){
                ctx.reply(questionsInLanguage[studentQuestionCounter])
                user.studentQuestionCounter = studentQuestionCounter + 1;
                user.studentInfo.push(ctx.message.photo[0].file_id);
                await user.save();
                console.log(user);
            } 
            if(studentQuestionCounter === 5 ){
                user.newStudentRegistering = false;
                user.parentRegistering=true;
                ctx.reply(transitionQuestion[language]);
                const parentQuestionInLanguge = parentQuestion[language]; 
                ctx.reply(parentQuestionInLanguge[parentQuestionCounter]);
                user.parentQuestionCounter = parentQuestionCounter + 1;
                user.studentInfo.push(ctx.message.photo[0].file_id);
                await user.save();
                console.log(user);
            }
            else{
                errorReply[language];
            }
        }
        else if(questionType===3){
            const questions = studentQuestionNew.find( question => question.type === 3).questions;
            const questionsInLanguage = questions[language];
            if(studentQuestionCounter===4||studentQuestionCounter===5){
                ctx.reply(questionsInLanguage[studentQuestionCounter])
                user.studentQuestionCounter = studentQuestionCounter + 1;
                user.studentInfo.push(ctx.message.photo[0].file_id);
                await user.save();
                console.log(user);
            }
            else if(studentQuestionCounter === 6){
                user.newStudentRegistering = false;
                user.parentRegistering=true;
                ctx.reply(transitionQuestion[language]);
                const parentQuestionInLanguge = parentQuestion[language]; 
                ctx.reply(parentQuestionInLanguge[parentQuestionCounter]);
                user.parentQuestionCounter = parentQuestionCounter + 1;
                user.studentInfo.push(ctx.message.photo[0].file_id);
                await user.save();
                console.log(user);  
            }
            else{
                ctx.reply(errorReply[language]);
            }
        }
    }
    else if(currentStudentRegistering){
        const questionsInLanguage = studentQuestionCurrent[language];
        if(studentQuestionCounter === questionsInLanguage.length -1){
            ctx.reply(questionsInLanguage[studentQuestionCounter]); 
            user.studentQuestionCounter = studentQuestionCounter + 1;
            user.studentInfo.push(ctx.message.photo[0].file_id);
            await user.save();
        }
        else if(studentQuestionCounter === questionsInLanguage.length){
            //new
            user.currentStudentRegistering = false;
            user.parentRegistering=true;
            ctx.reply(transitionQuestion[language]);
            const parentQuestionInLanguge = parentQuestion[language]; 
            ctx.reply(parentQuestionInLanguge[parentQuestionCounter]);
            user.parentQuestionCounter = parentQuestionCounter + 1;
            user.studentInfo.push(ctx.message.photo[0].file_id);
            await user.save();
            console.log(user);
            //new
        }
        else{
            ctx.reply(errorReply[language]);
        }
    }

    else if(parentRegistering){
        const questionsInLanguage = parentQuestion[language];
        if(parentQuestionCounter === questionsInLanguage.length){
            user.parentInfo.push(ctx.message.photo[0].file_id);
            ctx.reply(successfulRegistrationReply[language]);
            await user.save();
            if(user.newStudent){
                //new
                ctx.reply(userIdReply[language] + user.studentId);
                if(studentGrade === -2){
                    const registeredStudent = new RegisteredStudent({
                        studentName: user.studentInfo[0],
                        studentId: user.studentId,
                        studentGrade: user.studentGrade,
                        yearOfBirth: user.studentInfo[1],
                        studentSex: user.studentInfo[2],
                        studentPicture: user.studentInfo[3],
                        parentName: user.parentInfo[0],
                        parentPhoneNumber: user.parentInfo[1],
                        address: user.parentInfo[2],
                        parentPicture: user.parentInfo[3]
                    });
                    await registeredStudent.save();
                    console.log(registeredStudent);}
            else if(studentGrade >= -1 && studentGrade <=8){
                const registeredStudent = new RegisteredStudent({
                    studentName: user.studentInfo[0],
                    studentId: user.studentId,
                    studentGrade: user.studentGrade,
                    yearOfBirth: user.studentInfo[1],
                    studentSex: user.studentInfo[2],
                    studentPicture: user.studentInfo[3],
                    reportCard: user.studentInfo[4], 
                    parentName: user.parentInfo[0],
                    parentPhoneNumber: user.parentInfo[1],
                    address: user.parentInfo[2],
                    parentPicture: user.parentInfo[3]
                });
                await registeredStudent.save();
                console.log(registeredStudent);
            }
            else if(studentGrade >= 9 && studentGrade <=12){
                const registeredStudent = new RegisteredStudent({
                    studentName: user.studentInfo[0],
                    studentId: user.studentId,
                    studentGrade: user.studentGrade,
                    yearOfBirth: user.studentInfo[1],
                    studentSex: user.studentInfo[2],
                    studentPicture: user.studentInfo[3],
                    reportCard: user.studentInfo[4], 
                    transcript: user.studentInfo[5],
                    parentName: user.parentInfo[0],
                    parentPhoneNumber: user.parentInfo[1],
                    address: user.parentInfo[2],
                    parentPicture: user.parentInfo[3]
                });
                await registeredStudent.save();
                console.log(registeredStudent);
            }    
        }      
        else if(user.currentStudent){
            const registeredStudent = new RegisteredStudent({
                studentId: user.studentInfo[0],
                studentGrade: user.studentGrade,
                studentPicture: user.studentInfo[1],
                reportCard: user.studentInfo[2],
                parentName: user.parentInfo[0],
                parentPhoneNumber: user.parentInfo[1],
                address: user.parentInfo[2],
                parentPicture: user.parentInfo[3], 
            });
            await registeredStudent.save();
            console.log(registeredStudent);
        }      
    }
        else{
            ctx.reply(errorReply[language]);
        }
    }
    else{
        ctx.reply(errorReply[language]);
    }
 }
) 

//bot
bot.launch();
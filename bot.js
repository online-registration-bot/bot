//packages
const {Telegraf} = require("telegraf") //initializing the telegraf package
const bot= new Telegraf("5708836919:AAGFsob53vwt5YN9MeTI535rHUaydCzlNi0"); //our bot token
const express = require("express"); //initializing the express package
const axios = require("axios"); //to send http requests(to connect to hahucloud)
const app = express(); //our node application
const fs = require("fs"); //to intereact with files on the computer
const mongoose = require('mongoose'); //to have easier connection with our mongodb database
const dotenv = require("dotenv"); //to store sensitive information like api keys
const User = require("./models/User")
const RegisteredStudent = require("./models/RegisteredStudent");
const { brotliCompress } = require("zlib");
const { response } = require("express");

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
    }
    {
        
        questions:[["fullname","year of birth","sex"," picture of student","picture of report kard","picture of transcript"],
        ["ሙሉ ስም","የትውልድ ዘመን", "ጾታ" ,"የተማሪው ፎቶ" ,"የሪፖርት ካርድ በፎቶ","ትራንስክሪብት በፎቶ"],
        ["Maqaa","waggaa dhalootaa","salla","suura barataa","suura riipoort kaardii","suura tiraaniskiriipti"]]
    }    
]
const studentQuestionCurrent=[{
    questions:[["fullname","picture of student","pictureof report kard"],
    ["ሙሉ ስም","የተማሪው ፎቶ","የውጤት ካርድ ፎቶ"],
    ["maqaa","suura barataa","suura riipoort kaardii"]]
}





]
const parentQuestionCurrent=[{
    question:[["fullname", "phone numeber of parent","address","picture of parent"],
    ["ሙሉ ስም", "የወላጅ ሰልክ" ,"አድራሻ" ,"የወላጅ ፎቶ"],
    ["maqaa","lakkoofsa bilbila maatii","teessoo","suura matii"]]
}]


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
             [      {text:'kg-1',callback_data:'kg1'},
                    {text:'kg-2',callback_data:'kg2'} ,     
                    {text:'kg-3',callback_data:'kg3'}
                    
              ],
              [
                 
                {text:'1',callback_data:'one'},
                {text:'2',callback_data:'two'}, 
                {text:'3',callback_data:'three'}
                
              ],
              [
                {text:'4',callback_data:'four'},
                {text:'5',callback_data:'five'},
                {text:'6',callback_data:'six'}
              ],
              [
                {text:'7',callback_data:'seven'},
                {text:'8',callback_data:'eight'},
                {text:'9',callback_data:'nine'}
              ],
              [
                {text:'10',callback_data:'ten'},
                {text:'11',callback_data:'eleven'},
                {text:'12',callback_data:'twelve'}
              ]
          ]
       }
    })
}







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
    const user = await userFindingHelper(ctx);
    const language = user.language;

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
    ctx.reply("Galmee jalqabuuf ajaja kana xuqi'/register'።");
})  

//student status action
bot.action('newStudent',async ctx=>{
    const user = await userFindingHelper(ctx);
    const language = user.language;
    user.newStudentRegistering = true;
    user.currentStudentRegistering = false;
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

bot.action(['kg1','kg2','kg3','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'] , async ctx=>{
    const user = await userFindingHelper(ctx);
    const language = user.language;
    console.log (language);
    ctx.answerCbQuery();
    if (language===0){
        bot.telegram.sendMessage(ctx.chat.id,'fullName')
    }
    if (language===1){
        bot.telegram.sendMessage(ctx.chat.id,'ሙሉ ስም')
    }
    if (language===2){
        bot.telegram.sendMessage(ctx.chat.id,'Maqaa guutuu')
    }
})
        
bot.launch()  ; 
    
 

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
let questionsKg=["fullName "," year of birth"," picture","parent/guardian fullName","phoneNumber"," Address","picture"];
let kg2_12Questions = [ "fullName "," year of birth"," picture","transcript","report kard","parent/guardian fullName","phoneNumber"," Address","picture"];
let questionsKgCOUNTER= 0;
let kg2_12QuestionCounter = 0;
let registration= false;
let payment = false;
let studentQuestionsKgCOUNTER=0;
let parentQuestionsKgCOUNTER=0;

// const clearUser = {
//     language:0,
//     newStudentRegistering:false,
//     currentStudentRegistering:false,
//     studentGrade:"",
//     quesitonType:null,
//     studentQuestionCounter:null,
//     parentQuestionCounter:null,
//     studentName:null,
//     studentSex:"",
//     yearOfBirth:"",
//     studentPicture:"",
//     reportCard:"",
//     transcript:"",
//     parentName:"",
//     parentSex:"",
//     parentPhoneNumber:"",
//     address:"",
//     parentPicture:"",
//     finishedRegistering:false
// }

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




//helper functions
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

//language helper
IdAndLanguageConfirmationHelper= async (ctx)=>{
    const userChatId = ctx.chat.id;
    const query = {userId:userChatId};
    const user = await User.findOne(query);
    const language=user.language;
    ctx.answerCbQuery();
    return language;
}
//bot
//when the user clicks the '/start' command
bot.start(async (ctx)=>{
    //assign the chat id of a user to a variable
    let userChatId = ctx.chat.id;
    //
    const user = await User.findOne({userId:userChatId});
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

//commands
//git commit bot.js -m "we added this feature, and faced this problem and solved by doing this and t"
//When the user clicks the '/register' command   
 bot.command('register', async ctx=>{

    //find the user chat id
   const userchatId = ctx.chat.id;
    
    //find the user on the database(using the chat id=> userId:chatId)
    const query={userId:userchatId };
const user =await User.findOne(query); 

    //look at the language the user chose
const language = user.language;

    //set the language variable to the language the user chose



    if(language === 0){
    //if the user chooses the first(English) language
    bot.telegram.sendMessage(ctx.chat.id,'choose status ',
     {
      reply_markup:{
         inline_keyboard:[
             [      {text:'new student',callback_data:'newStudent'},
                    {text:'current student',callback_data:'currentStudent'}                    
              ],
               
          ]
       }
    })}

    else if (language === 1){
        //if the user chooses the second(Amharic) language
        bot.telegram.sendMessage(ctx.chat.id,'ለትምህርት ቤታችን',
        {
         reply_markup:{
            inline_keyboard:[
                [      {text:'አዲስ',callback_data:'newStudent'},
                       {text:'ነባር',callback_data:'currentStudent'}
                       
                 ],
                  
             ]
          }
       }) 
    }
    else if(language === 2){
        //if the user chooses the third(afaan oromo) language
        bot.telegram.sendMessage(ctx.chat.id,'mana barumsaa keengaaf ',
        {
         reply_markup:{
            inline_keyboard:[
                [      {text:'barata haaraa',callback_data:'newStudent'},
                       {text:'barata duraanii',callback_data:'currentStudent'}
                 ],
                  
             ]
          }
       })
    }
})
// bot.command('reg1ster',ctx=>{
    
// })
// bot.command('galmee',ctx=>{
    
// })


//actions
bot.action('languageOne', async ctx=>{
    const userChatId = ctx.chat.id;
    const query = {userId:userChatId};
    await User.findOneAndUpdate(query, {language:0});
    const user = await User.findOne({userId: userChatId});
    console.log(user.language);
    ctx.answerCbQuery();
    ctx.reply(" to start registering use the '/register'.");
})

bot.action('languageTwo', async ctx=>{
    const userChatId = ctx.chat.id;
    const query = {userId:userChatId}
    await User.findOneAndUpdate(query, {language:1});
    const user = await User.findOne({userId: userChatId});
    console.log(user.language);
    ctx.answerCbQuery();
    ctx.reply("ምዝገባ ለመጀመር ይህን ይንኩ'/register'።");
})
bot.action('languageThree', async ctx=>{
    const userChatId = ctx.chat.id;
    const query = {userId:userChatId}
    await User.findOneAndUpdate(query, {language:2});
    const user = await User.findOne({userId: userChatId});
    console.log(user.language);
    ctx.answerCbQuery();
    ctx.reply("Galmee jalqabuuf ajaja kana xuqi'/register'።");
})  


///new or current student choice
bot.action('newStudent',async ctx=>{
    const language = await IdAndLanguageConfirmationHelper(ctx);
    registeration =true;
    console.log(language);
    if(language===0){
    bot.telegram.sendMessage(ctx.chat.id,'grade',
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
    })}

     else if(language === 1){
        //if the user chooses the second(Amharic) language
        bot.telegram.sendMessage(ctx.chat.id,'ክፍል',
        {
         reply_markup:{
            inline_keyboard:[
                [      {text:'ኬጂ-1',callback_data:'kg1'},
                       {text:'ኬጂ-2',callback_data:'kg2'},
                       {text:'ኬጂ-3',callback_data:'kg3'}
                 ],
                [
                    {text:'1',callback_data:'one'} ,
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
    else if(language === 2){
        //if the user chooses the third(afaan oromo) language
        bot.telegram.sendMessage(ctx.chat.id,'kutaa',
        {
         reply_markup:{
            inline_keyboard:[
                [      {text:'kg-1',callback_data:'kg1'},
                       {text:'kg-2',callback_data:'kg2'},
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
                    {text:'5',callback_data:'six'}
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
})

    bot.action('currentStudent', async ctx=>{
        const language = await IdAndLanguageConfirmationHelper(ctx);
        registration 
        ctx.answerCbQuery();
        if(language===0){
        bot.telegram.sendMessage(ctx.chat.id,'grade',
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
        })}
    
         else if(language === 1){
            //if the user chooses the second(Amharic) language
            bot.telegram.sendMessage(ctx.chat.id,'ክፍል',
            {
             reply_markup:{
                inline_keyboard:[
                    [      {text:'ኬጂ-1',callback_data:'kg1'},
                           {text:'ኬጂ-2',callback_data:'kg2'},
                           {text:'ኬጂ-3',callback_data:'kg3'}
                     ],
                    [
                        {text:'1',callback_data:'one'} ,
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
        else if(language === 2){
            //if the user chooses the third(afaan oromo) language
            bot.telegram.sendMessage(ctx.chat.id,'kutaa',
            {
             reply_markup:{
                inline_keyboard:[
                    [      {text:'kg-1',callback_data:'kg1'},
                           {text:'kg-2',callback_data:'kg2'},
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
                        {text:'5',callback_data:'six'}
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
        }})
    
bot.action(['kg1','kg2','kg3','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'] , async ctx=>{
    const language = await IdAndLanguageConfirmationHelper(ctx)
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
    
 

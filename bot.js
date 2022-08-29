const {Telegraf} = require("telegraf") //initializing the telegraf package
const bot= new Telegraf("5708836919:AAGFsob53vwt5YN9MeTI535rHUaydCzlNi0"); //our bot token
const express = require("express"); //initializing the express package
const axios = require("axios"); //to send http requests(to connect to hahucloud)
const app = express(); //our node application
const fs = require("fs"); //to intereact with files on the computer
const mongoose = require('mongoose'); //to have easier connection with our mongodb database
const dotenv = require("dotenv"); //to store sensitive information like api keys
const User = require("./models/User")
const RegisteredStudent = require("./models/RegisteredStudent")
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

//bot
//when the user clicks the '/start' command
bot.start(async (ctx)=>{
    let userChatId = ctx.chat.id;
    const user = await User.findOne({userId:ctx.chat.id});
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
 bot.command('register',ctx=>{
    if(language === 1){
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

    else if (language === 2){
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
    else if(language === 3){
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
    const query = {userId:userChatId}
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
bot.action('newStudent',ctx=>{
    ctx.answerCbQuery();
    if(language===1){
    
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

     else if(language === 2){
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
    else if(language === 3){
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
    bot.action('currentStudent',ctx=>{
        ctx.answerCbQuery();
        if(language==1){
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
    
         else if(language === 2){
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
        else if(language === 3){
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
    







bot.launch()  ; 
    
    

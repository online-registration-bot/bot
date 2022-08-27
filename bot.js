const {Telegraf} = require("telegraf") //initializing the telegraf package
const bot= new Telegraf("5708836919:AAGFsob53vwt5YN9MeTI535rHUaydCzlNi0"); //our bot token
const express = require("express"); //initializing the express package
const axios = require("axios"); //to send http requests(to connect to hahucloud)
const app = express(); //our node application
const fs = require("fs"); //to intereact with files on the computer
let language;  //this identifies the language the user chooses


//when the user clicks the '/start' command
bot.start((ctx)=>{

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
})   

//commands
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
bot.action('languageOne',ctx=>{
    language = 1;
    ctx.answerCbQuery();
    ctx.reply(" to start registering use the '/register'.");
})

bot.action('languageTwo',ctx=>{
    
    language=2;
    ctx.answerCbQuery();
    ctx.reply("ምዝገባ ለመጀመር ይህን ይንኩ'/register'።");
})
bot.action('languageThree',ctx=>{
    language=3;
    ctx.answerCbQuery();
    ctx.reply("Galmee jalqabuuf ajaja kana xuqi'/register'።");
})  
bo






bot.launch()  ; 
    
    

const Discord = require('discord.js');
const client = new Discord.Client();
var message= [
  "It is certain.",
  "It is decidedly so.",
  "Without a doubt.",
  "Yes - definitely.",
  "You may rely on it.",
  "As I see it, yes.",
  "Most likely.",
  "Outlook good.",
  "Yes.",
  "Signs point to yes.",
  "Reply hazy, try again.",
  "Ask again later.",
  "Better not tell you now.",
  "Cannot predict now.",
  "Concentrate and ask again.",
  "Don't count on it.",
  "My reply is no.",
  "My sources say no.",
  "Outlook not so good.",
  "Very doubtful."
];
var fs=require('fs');
var token=require('./token.json');
var data=require('./data.json');
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
var today;
client.on('message', msg => {
  today=new Date();
  var args=msg.content.split(' ');
  msg.channel.send("ok");
  if(!data.servers.hasOwnProperty(msg.guild.id)){
    setupServer(msg.guild);
  
  }
  if(!data.servers[msg.guild.id].hasOwnProperty(msg.author.id)){
    setupAcc(msg.guild, msg.author);
  }
  if(args[0].charAt(0)=='!'){
    // setupServer(msg.guild);
    
    switch(args[0].substring(1)){
       case "8ball":
       var next=Math.random()*20;
       next=Math.floor(next);
       // msg.reply(next);
       msg.channel.send(message[next]);
       break;
       case "bet":
       if(!isNaN(args[1])){
         var amount=Number(args[1]);
         if(amount<1){
           msg.reply("....... no");
          break;
          }

         var compare=data.servers[msg.guild.id][msg.author.id].betItem;
         if(amount>compare){
           msg.reply("You don't have that much! Your current balance: "+compare+".");
         }
         else{
          var next=Math.random()*2;
          if(next>1){
            compare-=amount;
            msg.reply("You lost! You now have "+compare+". :grimacing:");
          }
          else{
            compare+=amount;
            msg.reply("You won! You now have "+compare+". :grin:");
          }
          data.servers[msg.guild.id][msg.author.id].betItem=compare;
         }
        //  msg.reply("good "+msg.author.username);
        
      }
      break;
      case "set":
      if(!isNaN(args[2])){
        var target=msg.mentions.members.first();

        if(target!=undefined){
          msg.reply(target.id);
          data.servers[msg.guild.id][target.id].betItem=Number(args[2]);
          break;
        }
      }
      msg.reply("fail");
      break;
      case "balance":
      msg.reply("You currently have "+data.servers[msg.guild.id][msg.author.id].betItem+".");
      break;
      
    }
    
  }
  fs.writeFile('./data.json', JSON.stringify(data), function(err, buf){
    console.log(err);
  });
});

function setupAcc(server, user ){
  data.servers[server.id][user.id]={
    betItem:0,
    lastMessage:0
  };
  console.log("new user");
}
function setupServer(server){
  data.servers[server.id]={};
  server.members.forEach(member => setupAcc(server, member));
  console.log("new server");
}
function getUser(id, username){
  // if(username==)

}
client.login(token.token);
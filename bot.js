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

client.on('guildMemberAdd', member=>{
  setupAcc(member.guild, member);
  backupData();
});
client.on('guildMemberRemove', member=>{
  wipeAcc(member.guild, member);
  backupData();
});
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.guilds.forEach(guild=>{
    if(!data.servers.hasOwnProperty(guild.id)){
      setupServer(guild);
    }
    else{
      updateServer(guild);
    }
  });
  backupData();
});
var today;
client.on('message', msg => {
  today=new Date();
  var args=msg.content.split(' ');
  // msg.channel.send("ok");
  if(!data.servers.hasOwnProperty(msg.guild.id)){
    setupServer(msg.guild);
  }
  if(!data.servers[msg.guild.id].hasOwnProperty(msg.author.id)){
    setupAcc(msg.guild, msg.author);
  }
  if(args[0].charAt(0)=='!'){
    // setupServer(msg.guild);
    act(args, msg);

  }
  backupData();
});
function act(args,msg){
  switch(args[0].substring(1)){
    case "dice":
    if(args.length==1){
      
      msg.channel.send(getRndInteger(1,8));
    }
    else{
      if(!isNaN(args[1])){
        var next=Number(args[1]);
        msg.channel.send(getRndInteger(1,next));
      }
    }
    break;
    case "8ball":
    var next=Math.random()*20;
    next=Math.floor(next);
    // msg.reply(next);
    msg.channel.send(message[next]);
    break;
    case "bet":
    if(!isNaN(args[1])||args[1].toLocaleLowerCase('en-US').trim()==='all'){
      
     var compare=data.servers[msg.guild.id][msg.author.id].betItem;
     var amount; 
     if(args[1].toLocaleLowerCase('en-US').trim()==='all'){
        amount=compare;
      }
      else{
       amount=Number(args[1]);
      
      }
      if(amount<1){
        msg.reply("....... no");
       break;
       }

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
   if(!msg.member.hasPermission('KICK_MEMBERS')){
     msg.reply("not allowed");
     break;
   }
   if(!isNaN(args[2])){
     var target=msg.mentions.members.first();

     if(target!=undefined){
       msg.channel.send(target.displayName +" now has "+args[2]);
       // msg.reply(target.id);
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
function setupAcc(server, user ){
  data.servers[server.id][user.id]={
    betItem:0,
    lastMessage:0
  };
  console.log("new user");
}
function wipeAcc(server, user){
  data.servers[server.id][user.id]=undefined;
}
function setupServer(server){
  data.servers[server.id]={};
  updateServer(server);
  console.log("new server");
}
function updateServer(server){
  server.members.forEach(member=>{
    if(!data.servers[server.id].hasOwnProperty(member.id)){
      setupAcc(server, member);
    }
  })
}
function backupData(){
  fs.writeFile('./data.json', JSON.stringify(data), function(err, buf){
    console.log(err);
  });
}
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
client.login(token.token);
const Discord = require('discord.js');
var auth = require('./auth.json');
var conf = require('./conf.json');
const bot = new Discord.Client();

var ex=Array("oui", "non","oui", "non","oui", "non","oui", "non","oui", "non","oui", "non","oui", "non","oui", "non", "roger", "robert", "niveau ?", "leader ?", "equipe ?");
			
			

bot.on('message', msg => {
	if (msg.content=="ok"||msg.author.id=="625988662454386698"){
			setTimeout(function(){
			test(msg);
		}, 5000);
	}
});

function test(msg){
	var str = ex[Math.floor(Math.random()*ex.length)];
	msg.channel.send(str);
}

bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));
//bot.on("debug", (e) => console.info(e));
  
bot.login(auth.token);
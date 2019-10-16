var fs = require('fs');
const Discord = require('discord.js');
var auth = require('./auth.json');
var conf = require('./conf.json');
const bot = new Discord.Client();
const readline = require('readline');

var t1 = require('./t-adv.json');
var t2 = require('./t-nom.json');
var sf = require('./s-adj.json');
var s="";
var t="";

bot.on('message', msg => {
	if (msg.content=="!ts"){
		r=Math.random();
		if(r<0.5){
			t = t2["adj"][Math.floor(Math.random()*t2["adj"].length)];
		} else {
			t = t1["adv"][Math.floor(Math.random()*t1["adv"].length)];
		}
			s = sf["s"][Math.floor(Math.random()*sf["s"].length)];
		msg.channel.send(t.toUpperCase()+" "+s.toUpperCase()+" !");
	}	
	
	if (msg.content=="!Snul"){
		var pos= sf["s"].indexOf(s);
		if (pos>0){
		sf["s"].splice(pos, 1);
		msg.channel.send(s+" supprimé.");
		}
	}
	if (msg.content=="!Tnul"){
		var pos= t1["adv"].indexOf(s);
		if (pos>0){
			t1["adv"].splice(pos, 1);
			msg.channel.send(t+" supprimé.");
		}else{
			var pos= t2["adj"].indexOf(s);
			if (pos>0)
				t2["adj"].splice(pos, 1);
				msg.channel.send(t+" supprimé.");
			}
		}
		
	
});

bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));
bot.on("debug", (e) => console.info(e));
  
bot.login(auth.token);
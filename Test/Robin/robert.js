const Discord = require('discord.js');
var auth = require('./auth.json');
var conf = require('./conf.json');
const bot = new Discord.Client();

var ex=Array("truc",
			"machin",
			"tete",
			"non",
			"roger",
			"caca",
			"leader ?",
			"air",
			"eau",
			"équipe ?",
			"terre",
			"feu",
			"pisser debout",
			"j'aime la bière",
			"robert est parti",
			"poubelle",
			"voiture",
			"am",
			"stream",
			"ultime",
			"decathlon",
			"chausson",
			"nonono",
			"atchoum",
			"jardin de babylone",
			"toiture",
			"caleçon",
			"janvier",
			"dodo",
			"poissson",
			"citron",
			"slip",
			"djodjino",
			"voiture",
			"merde",
			"foperzjfzer f,eozpfkze",
			"!!!dz",
			"!help",
			"levelup",
			"jardin",
			"canasson",
			"vitriol",
			"poivre",
			"asteric",
			"idem",
			"lorem ispum",
			"cartogenère",
			"voiture de course",
			"petite bite",
			"janvier",
			"lundi",
			"3291840°1238",
			"*-*-*-",
			"88",
			"\\",
			"123144231342",
			"&é\"é&(_ç\"é",
			"deiodeioedi",
			"9932è_'è",
			"kdelzkdlmze",
			"^^^^^",
			"²²²²",
			"+++",
			"}}}",
			"!!!",
			"!robert",
			"tatata",
			"ALLEZ");
			
			

bot.on('message', msg => {
	if (msg.content=="okkk"||msg.author.id=="625993776397287424"){
			setTimeout(function(){
			test(msg);
		}, 5000);
	}
	var r=Math.random();
});

function test(msg){
	var str = ex[Math.floor(Math.random()*ex.length)];
	msg.channel.send(str);
}

bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));
//bot.on("debug", (e) => console.info(e));
  
bot.login(auth.token);
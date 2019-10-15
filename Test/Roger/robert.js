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
			"je suis le roi du monde");
			
			

bot.on('message', msg => {
	if (msg.content=="okk"||msg.author.id=="625993043606110208"){
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
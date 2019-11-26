const Discord = require('discord.js');
var auth = require('./auth_relay.json');
var conf = require('./conf_relay.json');
const bot = new Discord.Client();
var fs = require('fs');
var runners_fr=["Djodjino","Djodjino","Djodjino","Djodjino","Djodjino"];
var runners_us=["Twyn","Twyn","Twyn","Twyn","Twyn"];
var current_runner_fr;
var current_runner_us;
var us_i=0;
var fr_i=0;
var start_time;
var started=false;
var blocked=false;

//https://discordapp.com/oauth2/authorize?client_id=648845529647808512&scope=bot&permissions=2048

bot.on('message', msg => {
	console.log("start");
	if(msg.content=="reset"&&msg.author.id==98810512950726656){
		 current_runner_fr;
 current_runner_us;
 us_i=0;
 fr_i=0;
 start_time;
 started=false;
 blocked=false;

	}
	if(msg.content.startsWith("register_us ")){
		register_team_us(msg);
	}
	if(msg.content.startsWith("register_fr ")){
		register_team_fr(msg);
	}
	if(msg.content=="team fr"){
		print_team_fr(msg);
	}
	if(msg.content=="team us"){
		print_team_us(msg);
	}
	if(msg.channel.name=="relay-race"){
		if(msg.content=="!!start"&&!started){
			started=true;
			console.log("start");
			current_runner_fr=bot.users.find("username",runners_fr[fr_i]);
			current_runner_us=bot.users.find("username",runners_us[us_i]);
			msg.channel.send(current_runner_fr+" "+current_runner_us+" - LAWN MOWER USA vs FRANCE Match is starting in 30s !");
			countdown(msg,30,true);
		}
		if((msg=="!done"||msg==".done"||msg=="done"||msg=="don")&&blocked){
			if(msg.author.username==current_runner_fr.username){
				fr_i++;
				if(fr_i==5){
					current_runner_fr="";
					finish=new Date();
					diff=finish-start_time;
					finish_s=Math.round((diff/1000)%60);
					finish_m=Math.round((diff/1000-finish_s)/60);
					msg.channel.send("FRANCE FINISHED IN "+finish_m+":"+finish_s);
					
				}else if (fr_i>5){}
				else{
					current_runner_fr=bot.users.find("username",runners_fr[fr_i]);
					msg.channel.send(current_runner_fr+" You start in 10s !");
					countdown_user(msg,10,current_runner_fr,true);
				}
			}
			if(msg.author.username==current_runner_us.username){
				us_i++;
				if(us_i==5){
					current_runner_us="";
					finish=new Date();
					diff=finish-start_time;
					finish_s=(diff/1000)%60;
					finish_m=(diff/1000-finish_s)/60;
					msg.channel.send("USA FINISHED IN "+finish_m+":"+finish_s);
					
				}
				else if (us_i>5){}
				else{
					current_runner_us=bot.users.find("username",runners_us[us_i]);
					msg.channel.send(current_runner_us+" You start in 10s !");
					countdown_user(msg,10,current_runner_us,true);
				}
			}
		}
	}
});

function countdown(msg,counter,reset, count){
	if(reset){
	var i=counter;}
	else {var i = count};
  if(i > 0){
    setTimeout(function(){
      i--;
	  if(i==0){
		  start_time=new Date();
		  blocked=true;
	  msg.channel.send("...GO!...");
	  }
	  if(i==2||i==5||i==9||i==15||i==20||i==25||i==30){
		msg.channel.send("..."+i+"...");
	  }
	  
      countdown(msg,counter,false,i);
    }, 1000);
  }
}

function countdown_user(msg,counter,user,reset,count){
	if(reset){
	var i=counter;}
	else {var i = count};
  if(i > 0){
    setTimeout(function(){
      i--;
	  if(i==0){
		msg.channel.send(user+"...GO!...");
	  }
	  if(i==2||i==5||i==9||i==15||i==20||i==25||i==30){
		msg.channel.send(user+"..."+i+"...");
	  }
	  
      countdown_user(msg,counter,user,false,i);
    }, 1000);
  }
}

function register_team_us(msg){
	//msg = @user1 @user2 @user3 @user4 @user5
	var toparse = msg.cleanContent;
	table=toparse.replace(" ","").split("@");
	table.shift();
	runners_us=table;
}

function print_team_us(msg){
	toprint="";
	runners_us.forEach(function(element){
		toprint=toprint+element+"\n";
	});
	msg.reply(toprint);
}

function register_team_fr(msg){
	//msg = @user1 @user2 @user3 @user4 @user5
	var toparse = msg.cleanContent;
	table=toparse.replace(" ","").split("@");
	table.shift();
	runners_fr=table;
}

function print_team_fr(msg){
	toprint="";
	runners_fr.forEach(function(element){
		toprint=toprint+element+"\n";
	});
	msg.reply(toprint);
}


bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));
bot.on("debug", (e) => console.info(e));

bot.login(auth.token);
const Discord = require('discord.js');
var auth = require('./auth_relay.json');
var conf = require('./conf_relay.json');
const bot = new Discord.Client();
var fs = require('fs');
var runners_fr=["GHOSTDEATH","JyKin","Seij","Moliman"];
var runners_us=["NickBMowYard","jimmypoopins"];
var current_runner_fr;
var current_runner_us;
var us_i=0;
var fr_i=0;
var start_time;

bot.on('message', msg => {
	if(msg.channel.name=="relay-race"){
		if(msg=="!!start"){
			current_runner_fr=bot.users.find("username",runners_fr[fr_i]);
			current_runner_us=bot.users.find("username",runners_us[us_i]);
			msg.channel.send(current_runner_fr+" "+current_runner_us+"Race is starting in 30s !");
			countdown(msg,31,[current_runner_fr,current_runner_us]);
		}
		if(msg=="!done"||msg==".done"||msg=="done"||msg=="don"){
			if(msg.author.username==current_runner_fr.username){
				fr_i++;
				if(i==5){
					current_runner_fr="";
					finish=new Date();
					diff=finish-start_time;
					finish_s=(diff/1000)%60;
					finish_m=(diff/1000-finish_s)/60;
					msg.channel.send("FRANCE FINISHED IN "+finish_m+":"+finish_s);
					
				}
				else{
					current_runner_fr=bot.users.find("username",runners_fr[fr_i]);
					msg.channel.send(current_runner_fr+" You start in 10s !");
					countdown_user(msg,10,current_runner_fr);
				}
			}
			if(msg.author.username==current_runner_us.username){
				us_i++;
				if(i==5){
					current_runner_us="";
					finish=new Date();
					diff=finish-start_time;
					finish_s=(diff/1000)%60;
					finish_m=(diff/1000-finish_s)/60;
					msg.channel.send("USA FINISHED IN "+finish_m+":"+finish_s);
					
				}
				else{
					current_runner_us=bot.users.find("username",runners_us[us_i]);
					msg.channel.send(current_runner_us+" You start in 10s !");
					countdown_user(msg,10,current_runner_us);
				}
			}
		}
	}
});

function countdown(msg,counter){
	i=counter;
  if(i > 0){
    setTimeout(function(){
      i--;
	  if(i==0){
	  msg.channel.send("...GO!...");
	  }
	  if(i==2||i==5||i==9||i==15||i==20||i==25||i==30){
		msg.channel.send("..."+i+"...");
	  }
	  
      countdown(msg,counter);
    }, 1000);
  }
}

function countdown_user(msg,counter,user){
	i=counter;
  if(i > 0){
    setTimeout(function(){
      i--;
	  if(i==0){
		  start_time=new Date();
		msg.channel.send(user+"...GO!...");
	  }
	  if(i==2||i==5||i==9||i==15||i==20||i==25||i==30){
		msg.channel.send(user+"..."+i+"...");
	  }
	  
      countdown(msg,counter);
    }, 1000);
  }
}

function register_team_us(msg){
	//msg = @user1 @user2 @user3 @user4 @user5
	var toparse = msg.cleanContent;
	table=toparse.replace(" ","").split("@");
	runners_us=table.shift();
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
	runners_fr=table.shift();
}

function print_team_fr(msg){
	toprint="";
	runners_us.forEach(function(element){
		toprint=toprint+element+"\n";
	});
	msg.reply(toprint);
}
bot.login(auth.token);
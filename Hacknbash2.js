const Discord = require('discord.js');
var auth = require('./auth.json');
var conf = require('./conf.json');
const bot = new Discord.Client();
var fs = require('fs');
var install = false;
var start = false;
var event_classe = false;
var id_classe = 0;
var event_race = false;
var id_race = [];
var spes = require('./spes.json');
var races = require('./races.json');
var teams = require('./teams.json');
//var miniboss = require('./miniboss.json');
var names = require('./names.json');
var miniboss = names["miniboss"];
var adj = names["adj-masc"];
var dieu = names["dieux"];
var god=[];
var pieges = names["pieges"];
var adj_pieg = names["adj-fem"];
var items = require('./items.json');
var boss = require('./boss.json');
var piege_safe;
var msg_precedent;
var minijeu_status=false;
var prison=false;
var day_light=true;
//reserve levels
var bank_levels=0;
var bank_folie=0;
var prison_id=0;
var prison_msg;
var day=0;
var players=[];
var levels=[];
var folies=[];
var floor=0;
var minijeu_type="";
var minijeu_status=false;
var miniboss_nom="";
var n_dealdevil = -1;
var boss_id=0;
var boss_name="";
//factions
var chaos=[]; //agents du chaos
var heros=[]; //heros
var fous=[]; //lunatiques
var dieu_id=0; //envoyé divin
var dechu=[];//pour les id des envoyés déchus
var dieu_username; //envoyé divin
var MP=[]; //channelID/authorID
var chaos_decided=false; //devient vrai quand l'event chaos/divin est arrivé. Permet de ne pas double drop.
var combo_id=0;
var combo_count=0;
var highest_floor=0;
var event_floor_up=false;
var event_floor_down=false;
var event_team=false;
var coef=1;
var leader_id=0;
var leader_name="tous";
var event_leader=false//pour etre sur que le leader change
var diff=5;
var msg_count=1;
var curse=0;
var camisole_id=0; //le user qui peut utiliser une camisole
var muets=[];
var nopotion=500;
var channel_id=0;

//trahison
//event monter/descendre
//commandes
//drop items
//choix race
//calculproba
//event_spécialisation
function debug(msg){
	msg.guild.channels.find("name","niveau-ni-cochon").send("install "+install+"\n"+
"start "+start+"\n"+
"event_classe "+event_classe+"\n"+
"id_classe "+id_classe+"\n"+
"event_race "+event_race+"\n"+
"id_race "+id_race+"\n"+
"god "+god+"\n"+
"piege_safe "+piege_safe+"\n"+
"msg_precedent "+msg_precedent+"\n"+
"minijeu_status "+minijeu_status+"\n"+
"prison "+prison+"\n"+
"day_light "+day_light+"\n"+
"bank_levels "+bank_levels+"\n"+
"bank_folie "+bank_folie+"\n"+
"prison_id "+prison_id+"\n"+
"prison_msg "+prison_msg+"\n"+
"day "+day+"\n"+
"players "+players+"\n"+
"levels "+levels+"\n"+
"folies "+folies+"\n"+
"floor "+floor+"\n"+
"minijeu_type "+minijeu_type+"\n"+
"minijeu_status "+minijeu_status+"\n"+
"miniboss_nom "+miniboss_nom+"\n"+
"n_dealdevil "+n_dealdevil+"\n"+
"boss_id "+boss_id+"\n"+
"boss_name "+boss_name+"\n"+
"chaos "+chaos+"\n"+
"heros "+heros+"\n"+
"fous "+fous+"\n"+
"dieu_id "+dieu_id+"\n"+
"dechu "+dechu+"\n"+
"dieu_username "+dieu_username+"\n"+
"MP "+MP+"\n"+
"chaos_decided "+chaos_decided+"\n"+
"combo_id "+combo_id+"\n"+
"combo_count "+combo_count+"\n"+
"highest_floor "+highest_floor+"\n"+
"event_floor_up "+event_floor_up+"\n"+
"event_floor_down "+event_floor_down+"\n"+
"event_team "+event_team+"\n"+
"coef "+coef+"\n"+
"leader_id "+leader_id+"\n"+
"leader_name "+leader_name+"\n"+
"event_leader "+event_leader+"\n"+
"diff "+diff+"\n"+
"msg_count "+msg_count+"\n"+
"curse "+curse+"\n"+
"camisole_id "+camisole_id+"\n"+
"muets "+muets+"\n"+
"nopotion "+nopotion+"\n"
															,{code:true});
}

bot.on('message', msg => {
	if(!install&&msg.content=="install"){
		install_(msg);
		install=true;
		msg.channel.send("Hack'n'Bash est un jeu d'aventure discord, basé sur la chance et les décisions. Chaque événement est basé sur de l'aléatoire et il n'y a aucun moyen de manipuler ceci par le contenu des messages. Certains événements demandent aux joueurs (membres du discord) de répondre à des questions. Ces moments sont les seuls pendant lesquels le contenu du message est analysé. Il n'existe pas de commande cachée et il n'y a aucun moyen d'arrêter l'aventure avant la victoire ou la défaite du groupe. Il existe 3 fins différentes, et il est possible de bien jouer, ou de faire n'importe quoi. Les décisions importantes personnelles (choix de classe ou de race par exemple) ne pourront être répondues que par le joueur concerné. Si vous acceptez ces règles, et que vous concevez que l'anarchie règnera, que tout le monde peut prendre les décisions pour tout le monde, tapez 'start'.");
	}
	if(!install) return;
	if(!start&&msg.content=="start"){
		start=true;
		msg.channel.send("Votre groupe d'aventuriers se retrouve au bas d'une tour. Il est dit que toutes les réponses se trouvent en haut de la tour. Mais pour trouver les réponses que vous êtes venus chercher, il faudra traverser 100 étages. Les pieges sont peu nombreux, et les monstres quasiment inexistants... Qu'est ce qui rendait alors le périple si difficile ? Est-ce... vous même ? En tous cas, il est temps de se mettre en route !");
		msg.guild.channels.find("name","niveau-ni-cochon").send("CHOIX DES CLANS : \n\n"+
																"[Humain] : Habile et robuste, il ne perd pas ce qu'il a acquis, l'humain est l'opposé de l'ours, ses nombreux talents le tireront de nombreuses situations. \n\n"+
																"[Elfe] : Combatif, il ne succombe que rarement aux tentations, et saura être chanceux lors qu'il le faudra. \n\n"+
																"[Gnome] : Intelligent, le gnome est la créature qui progresse le plus vite, quelque soit la situation. Il sera aussi difficile de le réduire au silence. \n\n"+
																"[Ours] : C'est LE combattant par excellence. Attention, cela dit, car sa soif de sang le fait vite tomber dans une rage inarretable. \n\n"+
																"[Cultiste] : Dévoué, c'est les cultistes qui ont monté cette expedition pour trouver des réponses. Il est très sensible aux appels divins, mais aussi chaotiques... \n\n"+
																"[Nain] : Orfèvre délicat, le nain forge les meilleurs équipement, sait rester intègre, et ne garde pas sa langue dans sa poche. \n\n"+
																"[Rat] : Furtif et rusés, les rats sont les créatures les plus solides, les plus sournoises, et la meilleure chance de succès dans la mission."
																,{code:true});
	return;
	}
	if(!start) return;
	if(day_light){
		day_night(msg);
		day_light=false;
	}
	if(msg.author.id=="625993776397287424") return;//le bot ne joue pas.
	if(msg_precedent==null) msg_precedent=msg;//just in case.
	msg_count++;
	if(msg_count%10==0){
		debug(msg);
	}
	nopotion--;
	if (event_race_(msg)){
		return;
	}
	add_player(msg);
	//quand un meme joueur spam, le coef diminue jusqu'a atteindre 0.
	//toutes les probas sont x coef.
	if(msg.author.id==msg_precedent.author.id||msg.author.bot||msg_precedent.author.bot){
		coef-=0.01;
	} else {
		coef=1;
	}
	if(dm(msg)){
		return;
	}
	if(msg_count%500==0){
		curse++;
		if (curse == 10){
			msg.channel.send("GAME OVER : Le groupe tourne en rond depuis des jours et des jours, le chaos reignant dans la tour a enfin eu raison de tous. Seul l'envoyé du chaos s'en sort, corrompu jusqu'au bout de son âme !");
			msg.guild.channels.find("name","niveau-ni-cochon").send("GAME OVER : WINNER : "+winnerchaos(),{code:true});
			gameover();
			return;
		}
		msg.channel.send("La malédiction se renforce... Il est peut-être temps d'utiliser une potion ? ["+chiffre_rom(curse)+"]");
	}
	if(msg.author.id==prison_id&&!msg_precedent.author.bot){
		var r=Math.random();
		if(r<proba_sortie_prison(msg)){
			if(prison_msg!=null&&prison_msg!=0){
				msg.channel.send(prison_msg.author.username+" fini par sortir de la cage. Un autre lui aurait-il ouvert, ou alors la porte était-elle juste mal fermée ?");
				r=Math.random();
				if (r<0.20){
					mod_align(-10,msg);
				}
			}
			prison_id=0;
		}
		return;
	}
	if(msg.member==null) return;//les gens offline ne jouent pas.
	if(commande(msg)){
		return;
	}
	if(event_leader){
		if(msg.author.id!=leader_id){
			// setleader(msg);
		}
	}
	if(prison){
		event_prison(msg);
		return;
	}
	if(event_floor_up){
		event_floor_up_res(msg);
		return;
	}
	if(event_floor_down){
		event_floor_down_res(msg);
		return;
	}
	if(event_team_(msg)){
		return;
	}
	if (event_specialization(msg)){
		msg_precedent=msg;
		return;
	}
	r=Math.random();
	if(r<proba_spe(msg)){
		id_classe=msg.author.id;
		msg.reply("Dans un éclair de lucidité, "+msg.author.username+" voit un bref instant la nature véritable du donjon. De cet enseignement il monte en compétence et choisi une affinité élémentaire ! [eau/feu/air/terre]");
		msg_precedent=msg;
		return;
	}	
	if(boss_id==msg.author.id){
		fight_boss(msg);
		msg_precedent=msg;
		return;
	}
	if(minijeu_status){
		minijeu(msg);
		msg_precedent=msg;
		return;
	}
	if(floor_(msg)){
		msg_precedent=msg;
		return;
	}
	if(dé(msg)){
		msg_precedent=msg;
		return;
	}
	if(trahison(msg)){
		msg_precedent=msg;
		return;
	}
	r=Math.random();
	if(r<proba_boss(msg)){
		boss_(msg);
		msg_precedent=msg;
		return;
	}
	if(startminijeu(msg)){
		msg_precedent=msg;
		return;
	}
	if(team(msg)){
		msg_precedent=msg;
		return;
	}
	r=Math.random();
	if(r<proba_levelup(msg)){
		levelup(msg);
		msg_precedent=msg;
		return;
	}
	r=Math.random();
	if(r<proba_folieup(msg)){
		folieup(msg);
		msg_precedent=msg;
		return;
	}
	if(attaque(msg)){
		msg_precedent=msg;
		return;
	}
	//EN AVANT DERNIER, LE DROP D'UNE CAMISOLE
	if((highest_floor-floor)>10){
		if(get_faction(msg)=="heros"){
			if(camisole_id==0){
				r=Math.random();
				if(r<(5*proba_drop(msg))){
					drop_camisole(msg);
				}
			}
		}
	}	
	//EN DERNIER : REJOINDRE UNE FACTION
	//LUNATICS-HEROS
	if(highest_floor>19&&!msg.author.bot){
		if(players.length>fous.length/(2.4)){
			if(get_faction(msg)=="neutre"){
				offer_join_lunatics(msg);
			}
		}
	}
	//DIEU-CHAOS
	if(msg_precedent.author.id!=msg.author.id&&highest_floor>49&&!msg.author.bot&&!msg_precedent.author.bot){
		if(dieu_id==0){
			if((get_faction(msg)=="neutre")&&(get_faction(msg_precedent)=="neutre")&&!dechu.includes(msg_precedent.author.id)){
				offer_join_chaos(msg);
				join_dieu(msg_precedent);
			}
		}
	}
	
	msg_precedent=msg;
	
});

function load(){
}

function save(){
}

function drop_camisole(msg){
	msg.author.createDM().then(function(channel){
		join_chaos(msg);
		channel.send("Dans le plus grand secret, tu réussis à fabriquer un sortilège qui empechera les plus fous de s'exprimer. Avec l'invocation [Par les esprits, ta folie nous mène à la perte !] tu maudiras le joueur qui s'est exprimé avant toi. Il ne pourra plus faire de choix pour monter ou descendre d'étage dans le donjon.");
	}).catch(error);
	camisole_id=msg.author.id;
}

//fonction principale
function commande(msg){
	//boire potion
	if(msg.content.includes("boire")&&msg.content.includes("potion")){
		if(nopotion<0){
			if(get_faction(msg)=="chaos"){
				msg.channel.send(msg.author.username + " boit une gorgée de potion, mais celle ci n'a aucun effet.");
				nopotion=333;
				return true;
			}else {
				r=Math.random();
				if(r<0.25){
					msg.channel.send(msg.author.username + " boit une gorgée de potion, mais celle ci n'a aucun effet.");
					return true;
				} else if(r<0.75){
					msg.channel.send(msg.author.username + " boit une gorgée de potion, et au prix de sa santé mentale et d'un peu d'experience, la malédiction se dissipe un peu.");
					curse--;
					folieup(msg);
					leveldown(msg);
					return true;
				} else if(r<0.99){
					msg.channel.send(msg.author.username + " boit une gorgée de potion, concentre une importante energie autour de lui, et dissipe la malédiction.");
					curse--;
					levelup(msg);
					return true;
				} else{
					msg.channel.send(msg.author.username + " conjure la puissance cachée du clan des "+raceplayer(msg)+" et lève toute la malédiction qui freinait le groupe dans sa progression.");
					levelup(msg);
					folieup(msg);
					bank_levels++;
					return true;
				}
			}
		}
		msg.channel.send("La source de la malédiction est pour l'instant intraçable. Même en augmentant leurs capacités magiques, le groupe ne parvient pas à la contenir.");
	}
	//leader
	if(msg.cleanContent.toLowerCase().includes("leader") && msg.content.includes("?")){
		msg.channel.send("N'oubliez pas que "+leader_name+" est votre guide pour cet étage ("+floor+"). Sa mission est de vous mener jusqu'à l'étage suivant. En échange, vous lui devez admiration et respect.");
		return true;
	}
	//prison
	if(msg.cleanContent.toLowerCase().includes("prison") && msg.content.includes("?")){
		if(prison_id!="0"){
			msg.channel.send(prison_msg.author.username +" tourne en rond dans la petite cellule. Il maugrée en boucle ces paroles qui lui méritèrent le cachot : "+prison_msg.cleanContent);
		}
		else{
			msg.channel.send("L'étroite cellule est vide. Pour l'instant.");
		}
		return true;
	}
	//niveau
	if(msg.cleanContent.toLowerCase().includes("niveau") && msg.content.includes("?")){
		msg.channel.send(msg.author.username +" - Niveau : " +levelplayer(msg)+" - Folie : " +folieplayer(msg));
		return true;
	}
	//équipe
	if(msg.content.includes("équipe ?")){
		for(var exKey in teams){
			if(msg.member.roles.some(r=>[exKey].includes(r.name))){
				msg.channel.send(teams[exKey][0]+" et "+teams[exKey][1]+" forment l'équipe "+exKey+"(niveau :"+teams[exKey][2]+") et ne peuvent pas s'attaquer l'un l'autre.");
			}
		}
		msg.channel.send(msg.author.username+" n'est dans aucune équipe. Peut-être que quelqu'un s'alliera avant que la solitude ne le plonge dans la folie.");
		return true;
	}
	//camisole
	if(msg.content=="Par les esprits, ta folie nous mène à la perte !"){
		if(camisole_id==msg.author.id){
			muets.push(msg_precedent.author.id);
			if(muets.length>(players.length/10+1)){
				folieup_noreply(muets.shift());
				msg.channel.send("Les langues ne sont pas gelées indéfiniement, l'un devient muet, mais un autre récupère la parole...");
			}
			folieup(msg_precedent);
			levelup(msg);
			camisole_id=0;
			return true;
		}
	}
	//couroux divin
	if(msg.content=="Couroux divin!"){
		if(dieu_id==msg.author.id){
			//SUCCES
			if(get_faction(msg_precedent)=="chaos"){
				msg.channel.send("Un éclair jailli du sol, et frappe "+msg_precedent.author.username+" ! Une voix qui n'est pas la sienne jailli de sa bouche, et des convulsions l'agitent dans tous les sens. Au bout d'un long moment son corps retombe. Le démon l'avait quitté. Le chaos s'était infiltré parmis vous, mais grâce à "+msg.author.username+" tout le monde est sauf. La route doit reprendre jusqu'au sommet de la tour !");
				reset_level(msg_precedent);
				reset_folie(msg_precedent);
				levelup(msg);
				reset_folie(msg);
				bank_folie-=3*diff;
				bank_levels+=3*diff;
			} else {
				msg.channel.send(msg.author.username+" lève le bras et implore que le couroux divin tombe sur "+msg_precedent.author.username+" mais rien ne se passe... L'erreur est fatale : au rang d'envoyé divin, "+msg.author.username +" est maintenant dans la triste caste des déchus. Tous ses levels sont perdus, et son destin c'est l'errance spirituelle éternelle. Mais l'envie de grimper jusqu'en haut de la tour pour en finir reste quelque part présente...");
				dechu.push(msg.author.id);
				reset_level(msg);
				dieu_id=0;
			}
		}
		return true;
	}
	return false;
}

function setleader(msg){
	leader_id=msg.author.id;
	leader_name=msg.author.username;
	msg.channel.send("Sur ces mots, "+msg.author.username+" gagne l'admiration de tous, et devient le nouveau LEADER... Jusqu'à ce que la couronne lui soit reprise...");
	msg.guild.channels.find("name","niveau-ni-cochon").send("LEADER : "+msg.author.username,{code:true});
	event_leader=false;
}

//fonction principale
function floor_(msg){
	r=Math.random();
	if(r<0.01){
		if(day<0){// c'est la nuit, on propose de redescendre.
			if(bank_folie>diff&&highest_floor>20){
				msg.channel.send("Avec le manque de lumière en cette sombre nuit, le groupe appeuré considère la possibilité de redescendre d'un étage... Pensez-vous que c'est la solution ? [oui/non]");
				event_floor_down=true;
				return true;
			}
		} else{
			if(bank_levels>diff){
				msg.channel.send("A force d'exploration dans cette immense tour, et à la faveur de la lumière du jour, le groupe trouve enfin de progresser. Vous engagez vous dans les escaliers sinueux qui semblent vous emmener vers le sommet ? [oui/non]");
				event_floor_up=true;
				return true;
			}
		}
	}
	return false;
}

function event_floor_up_res(msg){
	if(muets.includes(msg.author.id)){
		return;
	}
	if(msg.content.toLowerCase()=="oui"){
		floorup(msg);
		bank_levels-=diff;
		event_floor_up=false;
	}
	if(msg.content.toLowerCase()=="non"){
		event_floor_up=false;
	}
	return;
}

function event_floor_down_res(msg){
	if(muets.includes(msg.author.id)){
		return;
	}
	if(msg.content.toLowerCase()=="oui"){
		floordown(msg);
		bank_levels-=diff;
		event_floor_down=false;
	}
	if(msg.content.toLowerCase()=="non"){
		event_floor_down=false;
	}
	return;
}

//fonction principale : return true si qqch se passe, false sinon.
function trahison(msg){
	r=Math.random();
	if (r<proba_event_team(msg)){
		for(var exKey in teams){
			if(teams[exKey][0]==msg.author.id&&teams[exKey][1]==msg_precedent.author.id||teams[exKey][1]==msg.author.id&&teams[exKey][0]==msg_precedent.author.id){
				offer_trahison(msg,msg_precedent.author.username,exKey);
				return true;
			}
		}
	}
	return false;
}

function offer_trahison(msg,autre,nom){
	var offer={};
	msg.author.createDM().then(function(channel){
		offer={
			"channelid":channel.id,
			"Type":"trahison",
			"authorid":msg.author.id
		};
		MP.push(offer);
		channel.send("Votre voix intérieure vous murmure une proposition dérangeante... Voulez vous trahir votre alliance des \""+nom+"\" avec "+autre+" pour votre gain personnel ? [oui/non]");
	}).catch(function(error) {
		console.error(error);
	});
}

//fonction principale : return true si qqch se passe, false sinon.
function drop(msg){
	var index=0;
	var size = 0;
	r=Math.random();
	if(r<proba_drop(mes,"leg")){
		leg=items["leg"];
		for(var exKey in leg) {
			size+=1;
		}
		size+=1;
		for(var exKey in leg) {
			droprate=Math.random();
			if(droprate<1/size){
				if(att_role(exKey,"8E44AD",msg)){
					msg.channel.send("[OBJET LEGENDAIRE] "+msg.author.username+" trouve : "+ exKey+" ("+leg[exKey][desc]+")");
					drop_count+=1;
				}
				return;
			}
			size=size-1;
		}
	} 
	r=Math.random();
	if (r<proba_drop(mes,"rar")){
		rar=items["rar"];
		for(var exKey in rar) {
			size+=1;
		}
		size+=1;
		for(var exKey in rar) {
			droprate=Math.random();
			if(droprate<1/size){
				if(att_role(exKey,"F1C40F",msg)){
					msg.channel.send("[OBJET RARE] "+msg.author.username+" trouve : "+ exKey+" ("+rar[exKey][desc]+")");
					drop_count+=1;
				}
				return;
			}
			size=size-1;
		}
	} 
	r=Math.random();
	if (r<proba_drop(mes,"mag")){
		mag=items["mag"];
		for(var exKey in mag) {
			size+=1;
		}
		size+=1;
		for(var exKey in mag) {
			droprate=Math.random();
			if(droprate<1/size){
				if(att_role(exKey,"3498DB",msg)){
					msg.channel.send("[OBJET MAGIQUE] "+msg.author.username+" trouve : "+ exKey+" ("+mag[exKey][desc]+")");
					drop_count+=1;
				}
				return;
			}
			size=size-1;
		}
	} 
	r=Math.random();
	if (r<proba_drop(mes,"com")){
		com=items["com"];
		for(var exKey in com) {
			size+=1;
		}
		size+=1;
		for(var exKey in com) {
			droprate=Math.random();
			if(droprate<1/size){
				if(att_role(exKey,"BDC3C7",msg)){
					msg.channel.send("[OBJET COMMUN] "+msg.author.username+" trouve : "+ exKey+" ("+com[exKey][desc]+")");
					drop_count+=1;
				}
				return;
			}
			size=size-1;
		}
	}
	return false;
}

function drop_unique(msg,nom){//nom de l'item unique à attribuer
	unique=items["unique"];
	if (unique[nom]!=undefined){
		att_role(nom,"F39C12",msg);
		msg.channel.send("[OBJET UNIQUE] "+msg.author.username+" trouve : "+ nom+" ("+unique[nom][desc]+")");
	}
	return;
}

function att_role(nom,couleur,msg){
	if(msg.member.roles.some(r=>[nom].includes(r.name))){
		return false;
	}
	myRole = msg.guild.roles.find(role => role.name === nom);
	if(myRole==null){
		botRole = msg.guild.roles.find(role => role.name === "Hack'n'Bash");
		msg.guild.createRole({
			name: nom,
			color: couleur,
			position: 0,
			})
			.then(role => msg.member.addRole(role))
			.catch(console.error);	
	}else{
		msg.member.addRole(myRole);
	}
	return true;
}

//fonction principale : return true si qqch se passe, false sinon.
function boss_(msg){
	size=0;
	for(var exKey in boss) {
		size+=1;
	}
	console.log(size);
	for(var exKey in boss) {
		droprate=Math.random();
		if(droprate<1/size){
			boss_name=exKey;
			break;
		}
		size=size-1;
	}
	boss_id=msg.author.id;
	msg.channel.send(boss[boss_name]["Apparition"].replace("%username%",msg.author.username));
	return true;
}

function fight_boss(msg){
	r=Math.random();
	proba_victoire = proba_attaque(msg)/(proba_attaque(msg)+proba_def(msg));
	proba_défaite = proba_def(msg)/(proba_attaque(msg)+proba_def(msg));
	race=raceplayer(msg);
	if (r<(proba_attaque/10)){
		msg.channel.send(boss[boss_name][race]["Victoire"]["critique"].replace("%username%",msg.author.username));
		levelup(msg);
		drop_boss(boss[boss_name][race]["loot"],msg);
	} else if (r<proba_attaque){
		msg.channel.send(boss[boss_name][race]["Victoire"]["normal"].replace("%username%",msg.author.username));
		levelup(msg);
	} else if (r<(proba_défaite/10)){
		msg.channel.send(boss[boss_name][race]["Défaite"]["critique"].replace("%username%",msg.author.username));
		folieup(msg);
		drop_boss(boss[boss_name][race]["loot"],msg);
	} else {
		msg.channel.send(boss[boss_name][race]["Défaite"]["normal"].replace("%username%",msg.author.username));
		folieup(msg);
	}
	boss_name="";
	boss_id=0;
}

function drop_boss(name,msg){//name of the reward, in string
	switch (name){
		case "lose_all_items":
			lose_all_items(msg);
			break;
		default:
			drop_unique(msg,name);
			break;
	}
	return;
}

function lose_all_items(msg){
	for (var exKey in items){
		for (var it in items[exKey]){
			if(msg.member.roles.some(r=>[it].includes(r.name))){
				myRole = msg.guild.roles.find(role => role.name === it);
				msg.member.removeRole(myRole);
			}
		}
	}
}

function reset_level(msg){
	levels[msg.author.id]=0;
}

function reset_folie(msg){
	levels[msg.author.id]=0;
}

function day_night(msg){
	r=Math.random();
	if (day<0){
		setTimeout(function(){ 
			day=Math.random(); 
			day_night(msg);
			msg.guild.channels.find(function(channel){
				return channel.name=="niveau-ni-cochon";
				}).send("C'est la nuit",{code:true});
		}, 800000*r+100000);
	} else {
			setTimeout(function(){ 
			day=-Math.random(); 
			day_night(msg);
			msg.guild.channels.find(function(channel){
				return channel.name=="niveau-ni-cochon";
				}).send("C'est le jour",{code:true});
		}, 800000*r+100000);
	}
	
}

//fonction principale : return true si qqch se passe, false sinon.
function attaque(msg){
	var r=Math.random();
	if(r<proba_attaque(msg)){
		for(var exKey in teams){
			if(teams[exKey][0]==msg.author.id&&teams[exKey][1]==msg_precedent.author.id||teams[exKey][1]==msg.author.id&&teams[exKey][0]==msg_precedent.author.id){
				txt="";
				if(get_faction(msg)==get_faction(msg_precedent)){
					if(get_faction(msg)=="lunatiques"){
						txt="Le groupe entier plonge un peu plus dans la folie.";
						bank_folie++;
						folieup_noreply(msg.author.id);
						folieup_noreply(msg_precedent.author.id);
					}		
					if(get_faction(msg)=="heros"){
						txt="Le groupe entier gagne en confiance et progresse plus vite !";
						levelup_noreply(msg.author.id);
						levelup_noreply(msg_precedent.author.id);
						bank_levels++;
					}						
				}
				msg.channel.send("L'équipe des "+exKey+" entre "+msg.author.username+" et "+msg_precedent.author.username+" se renforce sur ces sages paroles." + txt);
				team_level_up(exKey);
				if(msg.author.id==msg_precedent.author.id){
					folieup(msg);
				}
				return true;
			}
		}
		if(msg.author.id!=msg_precedent.author.id){
			msg.channel.send("Sur ces paroles, "+msg.author.username+" s'empare de son arme et attaque "+msg_precedent.author.username);
			//roll pour le vol
			r=Math.random();
			arc=msg;
			if(r<proba_def(msg)){
				msg.channel.send("Tu oses me dire : \""+msg_precedent.toString()+ "\" ?" +" s'écrie "+msg.author.username+" !"+" Puisque c'est ainsi, meurs !");
				msg_precedent = mirroir(msg,msg_precedent);
				arc = arc_fleche(msg,msg_precedent);
				if(arc!=msg){
					msg_precedent=msg;
					msg=arc;
					arc=msg_precedent;
				}
				leveldown(msg_precedent);
				if(msg!=msg_precedent){
					msg.channel.send(msg_precedent.author.username+ " prend un serieux coup au visage, et tombe dans les pommes. Grace à cet exploit, "+msg.author.username +" gagne un niveau");
					levelup(msg);
				}else{
					msg.channel.send(msg_precedent.author.username+ " trébuche et manque de se trancher son propre pied.");
				}
				defense_div(msg,msg_precedent);
			} else {
				msg.channel.send("Protégé par sa magie, "+msg_precedent.author.username+" évite l'attaque.");
			}
			msg=arc;
			msg.channel.send("Le groupe s'arrête après cet incident et doit décider s'il est temps de prendre des mesures. Voulez-vous mettre "+msg.author.username+" en prison ?");  
			prison=true;
		} else{
			r=Math.random();
			if(r<proba_folieup(msg)){
				msg.channel.send("Confus et désorienté, "+msg.author.username+" se met à s'attaquer lui même en criant.");
				folieup(msg);
				if(r<0.25){
					msg.channel.send(msg.author.username+" se met un violent coup de massue sur le crâne, et tombe K.O");
					leveldown(msg);
				}
			}
		}
		return true;	
	}
	return false;
}

function mirroir(x,y){
	if(y.member.roles.some(r=>["Miroir magique"].includes(r.name))){
		myRole = y.guild.roles.find(role => role.name === "Miroir magique");
		y.member.removeRole(myRole);
		x.channel.send(y.author.username+" utilise son miroir magique et rend confus "+x.author.username+" qui se frappe à la jambe de toutes ses forces !");
		return x;
	}
	return y;
}

function arc_fleche(x,y){
	if(y.member.roles.some(r=>["Arc Elfique"].includes(r.name))&&y.member.roles.some(r=>["Carreau Elfique"].includes(r.name))){
		var tmp_a=x;
		x=y;
		y=tmp_a;
		myRole = x.guild.roles.find(role => role.name === "Carreau Elfique");
		x.channel.send(x.author.username+" anticipant l'attaque, riposte et crible "+y.author.username+ " de flèches.");
		x.member.removeRole(myRole);
		return x;
	}
	return x;
}

function defense_div(x,y){
	if(levelplayer(x)<40){
		return false;
	}
	if(y.member.roles.some(r=>["Bouclier Divin"].includes(r.name))){
		myRole = y.guild.roles.find(role => role.name === "Bouclier Divin");
		y.member.removeRole(myRole);
		x.channel.send("La bénédiction qui enveloppe "+y.author.username+" se change en malédiction qui frappe "+x.author.username+" !"); 
		reset_level(x,x);
		return true;
	}
	return false;
}

//fonction principale : return true si qqch se passe, false sinon.
function team(msg){
	var r = Math.random();
	if(msg.author.id==msg_precedent.author.id){
		//if tres fou, team tout seul.
		if ((folieplayer(msg)>30)&&(r<proba_team(msg))){
			for(var exKey in teams){
				if(msg.member.roles.some(r=>[exKey].includes(r.name))){
					return false;
				}
			}
			msg.channel.send("Sombrant toujours plus bas dans la folie, "+msg.author.username+" décide de s'allier avec une de ses autres personnalités... Quel nom allait-il donner à cette équipe ?");
			event_team=true;
			msg_team_a=msg;
			msg_team_b=msg_precedent;
			return true;
		}
		else {
			return false;
		}
	}
	if (r<proba_team(msg)){
		for(var exKey in teams){
			if(msg.member.roles.some(r=>[exKey].includes(r.name))||msg_precedent.member.roles.some(r=>[exKey].includes(r.name))){
				return false;
			}
		}
		msg.channel.send("Ces paroles étaient de bonne augure pour créer une alliance entre "+msg.author.username+" et "+msg_precedent.author.username+". Quel nom allait-on à cette équipe ?");
		msg_team_a=msg;
		msg_team_b=msg_precedent;
		event_team=true;
		return true;
	}
	return false;
}

//fonction principale : return true si qqch se passe, false sinon.
function event_team_(msg){
	if(event_team&&(msg.author.id==msg_team_a.author.id||msg.author.id==msg_team_b.author.id)){
		nom_team=msg.cleanContent.substring(0,98).replace(/[^a-zA-Z ]/g, "");
		//test nom équipe déjà pris
		for(var exKey in teams){
			if(exKey==nom_team){
				msg.channel.send("l'équipe des "+nom_team+" voit d'un très mauvais oeil cette tentative d'usurpation de nom...");
				return false;
			}
		}
		if(nom_team==""){
			return;
		}
		team_role(nom_team,msg_team_a,msg_team_b);
		msg.channel.send(msg_team_a.author.username+" et "+msg_team_b.author.username+" créent une entente amicale, et nomment leur équipe : "+nom_team);
		event_team=false;
		return true;
	}
	else {
		return false;
	}
}

//fonction principale : return true si qqch se passe, false sinon.
function event_prison(msg){
	if(msg.content.toLowerCase()=="oui"){
		if(prison_id!=0){
			msg.channel.send("La sentence est tombée : " +msg_precedent.author.username+" prend la place de "+prison_name+" en prison !");
		}else {
			msg.channel.send("La sentence est tombée : " +msg_precedent.author.username+" doit aller en prison.");
				folieup(msg);
		}
		to_prison(msg_precedent);
		prison=false;
	} else if(msg.content.toLowerCase()=="non"){
		msg.channel.send("Après moult délibérations, le groupe décide de ne pas mettre "+msg_precedent.author.username+" en prison.");
		prison=false;
	} else {
		return false;
	}
	return true;
}

function team_role(nom,msg_a, msg_b){
	botRole = msg_a.guild.roles.find(role => role.name === "Hack'n'Bash");
	msg_a.guild.createRole({
		name: nom,
		})
		.then(role => doubleadd(msg_a,msg_b,role))
		.catch(console.error);	
	//ajouter nom à teams.json
	teams[nom] = [msg_a.author.id,msg_b.author.id,0];
	fs.writeFile('./teams.json', JSON.stringify(teams), function (err) {
	if (err) return console.log(err);
	});
	return true;
}

function doubleadd(a,b,myRole){
	a.member.addRole(myRole);
	b.member.addRole(myRole);
}

function team_level_up(nom){
	teams[nom][2]++;
	fs.writeFile('./teams.json', JSON.stringify(teams), function (err) {
	if (err) return console.log(err);
	});
}

function event_race_(msg){
	index = id_race.findIndex(element=>element==msg.author.id);
	var msg_clean=msg.cleanContent.toLowerCase();
	if(index>=0){
		if(msg.author.bot){
			msg_clean="humain";
		}
		switch (msg_clean){
			case "humain":
				give_race("Humain",msg);
				event_race=false;
				id_race.splice(index,1);
				break;
			case "elfe":
				give_race("Elfe",msg);
				event_race=false;
				id_race.splice(index,1);
				break;
			case "gnome":
				give_race("Gnome",msg);
				event_race=false;
				id_race.splice(index,1);
				break;
			case "ours":
				give_race("Ours",msg);
				event_race=false;
				id_race.splice(index,1);
				break;
			case "cultiste":
				give_race("Cultiste",msg);
				event_race=false;
				id_race.splice(index,1);
				break;
			case "nain":
				give_race("Nain",msg);
				event_race=false;
				id_race.splice(index,1);
				break;
			case "rat":
				give_race("Rat",msg);
				event_race=false;
				id_race.splice(index,1);
				break;
			default :
				return false;
		}
		return true;
	} else {
		return false;
	}
}

function raceplayer(msg){
	for (var exKey in races){
		if(msg.member.roles.some(r=>[exKey].includes(r.name))){
			return exKey;
		}
	}
}

//fonction principale : return true si qqch se passe, false sinon.
function event_specialization(msg){
	var msg_clean=msg.cleanContent.toLowerCase();
	if(msg.author.id==id_classe){
		if(msg.author.bot){
			r=Math.random;
			if(r<0.25){
				msg_clean="feu";
			}else if(r<0.50){
				msg_clean="eau";
			}else if(r<0.75){
				msg_clean="air";
			}else {
				msg_clean="terre";
			}
		}
		switch (msg_clean){
			case "feu":
				spe=get_spe(msg);
				spe=add_spe(1,spe);
				give_spe(spe,msg);
				event_classe=false;
				if_classe=0;
				return true;
				break;
			case "eau":
				spe=get_spe(msg);
				spe=add_spe(2,spe);
				give_spe(spe,msg);
				event_classe=false;
				if_classe=0;
				return true;
				break;
			case "air":
				spe=get_spe(msg);
				spe=add_spe(3,spe);
				give_spe(spe,msg);
				event_classe=false;
				if_classe=0;
				return true;
				break;
			case "terre":
				spe=get_spe(msg);
				spe=add_spe(4,spe);
				give_spe(spe,msg);
				event_classe=false;
				if_classe=0;
				return true;
				break;
			default :
				return false;
		}
	}
	return false;
}

function add_spe(x,spe){
	if (spe==""){
		return x;
	} else{
		if(parseInt(x)<=parseInt(spe.substring(0,1))){
			return x+spe;
		}
		else {
			return spe.substring(0,1)+add_spe(x,spe.substring(1));
		}
	}	
}

function give_race(race,msg){
	myRole = msg.guild.roles.find(function(role){
		return role.name == race
	});
	if(myRole==undefined){
		botRole = msg.guild.roles.find(role => role.name === "Hack'n'Bash");
		msg.guild.createRole({
			name: race,
			position: (botRole.position-1),
			})
			.then(role => msg.member.addRole(role))
			.catch(console.error);	
	}else{
		msg.member.addRole(myRole);
	}
	msg.reply("choix de clan : "+race);
	log_race(msg,race);
}

function give_spe(spe,msg){
	var old_spe = get_spe(msg);
	if (old_spe!=""){
		oldRole = msg.guild.roles.find(function(role){
			return role.name == spes[spe]
		});
		msg.member.removeRole(oldRole);
	}
	myRole = msg.guild.roles.find(function(role){
		return role.name == spes[spe]
	});
	if(myRole==undefined){
		botRole = msg.guild.roles.find(role => role.name === "Hack'n'Bash");
		msg.guild.createRole({
			name: spes[spe].nom,
			color: spes[spe].couleur,
			position: (botRole.position),
			})
			.then(role => msg.member.addRole(role))
			.catch(console.error);	
	}else{
		msg.member.addRole(myRole);
	}
	msg.reply("amélioration de classe : "+spes[spe].nom);
	log_spe(msg,spes[spe].nom);
}

function get_spe(msg){
	for(var exKey in spes){
		if(msg.member.roles.some(r=>[spes[exKey].nom].includes(r.name))){
			return exKey;
		}
	}
	return "";
}

function offer_join_chaos(msg){
	msg.author.createDM().then(function(channel){
		join_chaos(msg);
		channel.send("Le chaos t'a désigné comme agent du désordre au sein du groupe. Ta mission est désormais de faire monter la malédiction jusqu'au niveau maximal. Sache que tu es devenu immunisé à la potion, et qu'en consommer fera perdurer la malédiction, l'empêchant de redescendre pendant un moment. Attention à l'envoyé divin qui fera tout pour te tuer.");
	}).catch(error);
}

function chaostotal(){
	var total=0;
	for (var exKey in chaos){
		total++;
	}
	return total;
}

//si raté = devenir agent du chaos
function join_dieu(msg){
	msg.author.createDM().then(function(channel){
		dieu_id=msg.author.id;
		dieu_id=msg.author.username;
		channel.send("Les dieux t'ont désigné comme agent divin. Un traitre s'est glissé dans le groupe, et ta mission est de l'empecher de nuire, et de le tuer le plus vite possible. Pour cela, tu peux utiliser ton pouvoir divin en écrivant [Couroux divin!] et cela frappera l'auteur du message précédent. Attention de ne pas frapper la mauvaise personne, le couroux des dieux ne sera pas tendre devant l'échec. Une dernière information : ne prête pas attention à la guilde des fous, ceux-ci ont perdu la raison et ne sont pas important dans ta quête.");
	}).catch(function(error) {
		console.error(error);
	});
}

function offer_join_lunatics(msg){
	var offer={};
	msg.author.createDM().then(function(channel){
		offer={
			"channelid":channel.id,
			"Type":"fou",
			"authorid":msg.author.id
		};
		MP.push(offer);
		channel.send("Une étrange voix intérieure commence à suggérer des idées étranges. La folie vous a atteint bien plus que vous ne le croyiez. Voulez vous y succomber et rejoindre le culte des fanatiques ? [oui/non]");
	}).catch(function(error) {
		console.error(error);
	});
}

function join_lunatics(msg){
	for (var exKey in fous){
		if (fous[exKey]["id"]==msg.author.id){
			return;
		}
	}
	fous.push({"id":msg.author.id,
			"username":msg.author.username});
}

function join_chaos(msg){
	for (var exKey in chaos){
		if (chaos[exKey]["id"]==msg.author.id){
			return;
		}
	}
	chaos.push({"id":msg.author.id,
		"username":msg.author.username});
	
}

function winnerchaos(){
	toReturn="";
	chaos.forEach(function(element){
		toReturn=toReturn+element.username+" ";
	});
	return toReturn;
}

function winlunatics(){
	result="";
	fous.forEach(function(element){
		result=result+element.username+"\n";
	});
	msg.channel.send("GAME OVER : Le groupe a sombré dans la folie et a totalement oublié quelle était sa quête... Pendant que les héros essayaient vaillamment de monter d'autres fondaient un culte, et ils réussirent finalement à prendre le pouvoir !");
	msg.guild.channels.find("name","niveau-ni-cochon").send("GAME OVER : SECTE DES LUNATIQUES :\n"+result,{code:true});
	gameover();
}

function winheros(){
	result="";
	heros.forEach(function(element){
		result=result+element.username+"\n";
	});
	msg.channel.send("GAME OVER : Le groupe a sombré dans la folie et a totalement oublié quelle était sa quête... Pendant que les héros essayaient vaillamment de monter d'autres fondaient un culte, et ils réussirent finalement à prendre le pouvoir !");
	msg.guild.channels.find("name","niveau-ni-cochon").send("GAME OVER : Tous ceux qui n'étaient pas dans la secte des fous ou des envoyés du chaos gagnent ! Mention honorable :\n",{code:true});
	gameover();
}

function lunaticstotal(){
	var total=0;
	for (var exKey in fous){
		total++;
	}
	return total;
}

function join_heros(msg){
	for (var exKey in heros){
		if (heros[exKey]["id"]==msg.author.id){
			return;
		}
	}
	heros.push({"id":msg.author.id,
		"username":msg.author.username});
}

//heros, fanatique, chaos, dieu, neutre
function get_faction(msg){
	for (var exKey in heros){
		if (heros[exKey]["id"]==msg.author.id){
			return "heros";
		}
	}
	for (var exKey in fous){
		if (fous[exKey]["id"]==msg.author.id){
			return "fanatique";
		}
	}
	for (var exKey in chaos){
	if (chaos[exKey]["id"]==msg.author.id){
			return "chaos";
		}
	}
	if(dieu_id==msg.author.id){
		return "dieu";
	}
	for (var exKey in dechu){
	if (dechu[exKey]==msg.author.id){
			return "déchu";
		}
	}
	return "neutre";
}

//fonction principale : return true/false
function dm(msg){
	if(msg.channel.type=="dm"){
		check_dm(msg);
		return true;
	} else{
		return false;
	}	
}

function check_dm(msg){
	var index=0;
	offer = MP.find(function(offer){
		return offer.channelid==msg.channel.id;
	});
	if(offer!=undefined){
		index = MP.findIndex(function(offer){
			return offer.channelid==msg.channel.id;
		});
		if(msg.cleanContent.toLowerCase()=="oui"){
			switch (offer.Type){
				case 'fou':
					join_lunatics(msg);
					msg.channel.send("Bienvenue chez les lunatiques ! Votre objectif est de refaire descendre le groupe le plus vite possible à l'entrée du donjon ! Clairement c'est la meilleure solution. Mélanger les éléments sera votre meilleure solution : Eau avec Feu et Air avec Terre. Conservez cette information pour vous et restez cachés ! Seuls les lunatiques comme toi ont accès à ce discord : https://discord.gg/86MfDSF");
					MP=MP.splice(index,1);
				break;
				case 'deal_devil':
					bank_levels-=5;
					bank_folie+=5;
					msg.channel.send("Qu'il en soit ainsi !");
					MP=MP.splice(index,1);
				break;
				case 'trahison':
					levels[offer.authorid]++;
					folies[offer.authorid]++;
					msg.channel.send("Très bien, le chaos t'offre un niveau dans le plus grand secret... Mais attention peut-être que ton partenaire prendra la même décision.");
				break;
			}
		} else if(msg.cleanContent.toLowerCase()=="non"){
			switch (offer.Type){
				case 'fou':
					join_heros(msg);
					msg.channel.send("Bienvenue chez les heros ! Votre mission reste la même : guider le groupe d'aventuriers jusqu'au sommet de la tour. Attention, les lunatiques qui se cachent parmis vous vont tout faire pour saboter la mission. Vous gagnez un important bonus de levelup, drop ainsi que la possibilité de récupérer des camisoles de force pour empêcher les fous de prendre des décisions !");
					MP=MP.splice(index,1);
				break;
				case 'deal_devil':
					bank_levels+=5;
					bank_folie-=5;
					msg.channel.send("Qu'il en soit ainsi !");
					MP=MP.splice(index,1);
				break;
				case 'trahison':
					bank_levels++;
					bank_folie--;
					msg.channel.send("Sage décision ! Le groupe tout entier en est récompensé !");
				break;
			}
		}
	}
	else{
		return;
	}
}

function dé(msg){
	r=Math.random();
	if (msg.author.id==msg_precedent.author.id){
		if(folieplayer(msg)<30){
			return false;
		}
	}
	if(r<proba_dé(msg)){
		typ="com";
		r=Math.random();
		if(r<0.2){
			typ="unique";
		} else if(r<0.4){
			typ="leg";
		} else if(r<0.6){
			typ="rar";
		} else if(r<0.8){
			typ="mag";
		}
		for(var exKey in items[typ]) {
			if(msg.member.roles.some(r=>[exKey].includes(r.name))){
				r=Math.random();
				if(r<0.5){
					msg.channel.send(msg.author.username +" décide avec "+ msg_precedent.author.username+" de jouer un équipement : "+exKey+ ", aux dés");
					r=Math.random();
					r=Math.floor(r*6)+1;
					t=Math.random();
					t=Math.floor(t*6)+1;
					msg.channel.send(msg.author.username +" lance un "+ r + " ...");
					msg.channel.send(msg_precedent.author.username +" lance un "+ t + " !");
					if(r>t){
						msg.channel.send("Victoire ! " +msg.author.username +" gagne un niveau !");
						levelup(msg);
					} else if (r<t){
						msg.channel.send("Défaite, "+msg.author.username +" perd son "+exKey+" !");
						myRole = msg.guild.roles.find(role => role.name === exKey);
						msg.member.removeRole(myRole);
						msg_precedent.member.addRole(myRole);
					} else {
						msg.channel.send("Egalité, le jeu s'arrête sur ce résultat décevant...");
						
					}
					return true;
				}
			}
		}
	}
	return false;
}

function add_player(msg){
	if(!find_player(msg)){
		players.push([msg.author.id,msg.author.username]);
		id_race.push(msg.author.id);
		msg.reply("Bienvenue dans l'aventure! A quel clan souhaitez vous appartenir ?");
	}
}

function find_player(msg){
	var found = players.find(function(player){
		return player[0]==msg.author.id;
	});
	return found!=undefined;
}

function levelup(msg){
	bank_levels++;
	if(levels[msg.author.id]==undefined){
		levels[msg.author.id]=1;
	}else{
		levels[msg.author.id]+=1;
	}
	log_levelup(msg);
	msg.reply("gagne un niveau !");
	if(combo_id==msg.author.id){
		combo_count++;
		switch (combo_count){
			case 3:
				msg.reply("TRIPLE LEVELUP !");
				break;
			case 4:
				msg.reply("QUAD LEVELUP !");
				break;
			case 5:
				msg.reply("ULTRA LEVELUP !");
				break;
			case 6:
				msg.reply("DOMINATION !");
				folieup(msg);
				break;
			case 7:
				msg.reply("DIVIN !");
				folieup(msg);
				break;
			case 8:
				msg.reply("BENI PAR LE DIEU DU CHAOS!");
				folieup(msg);
				bank_folie+=5;
				break;
			case 9:
				msg.reply("SE RAPPROCHE DE LA CORRUPTION !");
				folieup(msg);
				bank_folie+=5;
				break;
			case 10:
				msg.reply("DEPASSE LES LIMITES DU DIVIN ET DU CHAOS!");
				folieup(msg);
				bank_folie+=10;
				bank_levels-=5;
				leveldown(msg);
				break;
		}
	} else {
		combo_count=0;
	}
	combo_id=msg.author.id;
}

function levelup_noreply(id){
	bank_levels++;
	if(levels[id]==undefined){
		levels[id]=1;
	}else{
		levels[id]+=1;
	}
	if(combo_id==id){
		combo_count++;
	} else {
		combo_count=0;
	}
	combo_id=id;
}

function leveldown(msg){
	r=Math.random();
	if(r<proba_leveldown(msg)){
		return;
	}
	bank_levels--;
	if(levels[msg.author.id]==undefined){
		levels[msg.author.id]=0;
	}else{
		levels[msg.author.id]-=1;
	}
	log_leveldown(msg);
	msg.reply("perd un niveau !");
}

function levelplayer(msg){
	if(levels[msg.author.id]==undefined){
		return 0;
	}else{
		return levels[msg.author.id];
	}
}

function leveltotal(){
	var total=0;
	for (var exKey in levels){
		total+=levels[exKey];
	}
	return total;
}

function folieup(msg){
	bank_folie++;
	if(folies[msg.author.id]==undefined){
		folies[msg.author.id]=1;
	}else{
		folies[msg.author.id]+=1;
	}
	log_folieup(msg);
	msg.reply("sombre un peu plus dans la folie");
}

function folieup_noreply(id){
	bank_folie++;
	if(folies[id]==undefined){
		folies[id]=1;
	}else{
		folies[id]+=1;
	}
}

function foliedown(msg){
	bank_folie--;
	if(folies[msg.author.id]==undefined){
		folies[msg.author.id]=0;
	}else{
		folies[msg.author.id]-=1;
	}
	log_foliedown(msg);
	msg.reply("reprend un peu ses esprits !");
}

function folieplayer(msg){
	if(folies[msg.author.id]==undefined){
		return 0;
	}else{
		return folies[msg.author.id];
	}
}

function folietotal(){
	var total=0;
	for (var exKey in folies){
		total+=folies[exKey];
	}
	return total;
}

function floorup(msg){
	floor++;
	msg.channel.send("Le groupe décide de monter d'un étage, et de progresser vers le sommet de la tour.");
	log_floorup(msg);
	if(floor>highest_floor){
		highest_floor=floor;
	}
	if(leader_id!=0){
		levelup_noreply(leader_id);
	}
	event_leader=true;
}

function floordown(msg){
	floor--;
	msg.channel.send("Le groupe, prudent, décide de redescendre d'un étage.");
	if(floor==0){
		winlunatics();
	}else{
	log_floordown(msg);
	if(leader_id!=0){
		folieup_noreply(leader_id);
	}
	event_leader=true;
	}
}

function log_levelup(msg){
	msg.guild.channels.find(function(channel){
		return channel.name=="niveau-ni-cochon";
	}).send(msg.author.username+" gagne un niveau : "+levelplayer(msg)+"\n\""+msg.cleanContent+"\"",{code:true});
}

function log_leveldown(msg){
	msg.guild.channels.find(function(channel){
		return channel.name=="niveau-ni-cochon";
	}).send(msg.author.username+" perd un niveau : "+levelplayer(msg)+"\n\""+msg.cleanContent+"\"",{code:true});
}

function log_spe(msg,spe){
	msg.guild.channels.find(function(channel){
		return channel.name=="niveau-ni-cochon";
	}).send(msg.author.username+" devient : "+spe+"\n\""+msg.cleanContent+"\"",{code:true});
}

function log_race(msg,race){
	msg.guild.channels.find(function(channel){
		return channel.name=="niveau-ni-cochon";
	}).send(msg.author.username+" fait partie du clan : "+race+"\n\""+msg.cleanContent+"\"",{code:true});
}

function log_folieup(msg){
	msg.guild.channels.find(function(channel){
		return channel.name=="niveau-ni-cochon";
	}).send(msg.author.username+" tombe un peu plus profond dans la folie : "+folieplayer(msg)+"\n\""+msg.cleanContent+"\"",{code:true});
}

function log_foliedown(msg){
	msg.guild.channels.find(function(channel){
		return channel.name=="niveau-ni-cochon";
	}).send(msg.author.username+" regagne un petit peu ses esprits : "+folieplayer(msg)+"\n\""+msg.cleanContent+"\"",{code:true});
}

function log_floorup(msg){
	if (leader_name=="tous"){
		msg.guild.channels.find(function(channel){
		return channel.name=="niveau-ni-cochon";
	}).send("Le groupe parvient enfin à grimper un étage : "+floor+"\n",{code:true});
	} else {
	msg.guild.channels.find(function(channel){
		return channel.name=="niveau-ni-cochon";
	}).send("Le groupe parvient enfin à grimper un étage : "+floor+"\nGrace à l'incroyable leadership de "+leader_name + "! Sa sagesse est récompensée par un niveau durement acquis !",{code:true});
	}
}

function log_floordown(msg){
	msg.guild.channels.find(function(channel){
		return channel.name=="niveau-ni-cochon";
	}).send("Perdu, le groupe décide qu'il est plus sage de revenir en arrière : "+floor+"\nLe leadership douteux de "+leader_name+" est remis en question par le reste du groupe, leurs reproches le font tomber un peu plus dans la folie...",{code:true});
}

function install_(msg){
	//création du channel niveau-ni-cochon
	chan = msg.guild.channels.find(function(channel){
		return channel.name=="niveau-ni-cochon";
	});
	if (chan==undefined){
		msg.guild.createChannel('niveau-ni-cochon',  'text' )
			.then(channel=>channel.send(str+"\n"+msg.cleanContent,{code:true}))
		.catch(error);
	}
	//initialisation du cycle jour nuit.
	day_night(msg);
	day_light=false;
}

function minijeu(msg){
	if(minijeu_type=="Piege"){
		if(msg.channel.id==channel_id){
			msg.delete();
			var r=Math.random();
			if (r<proba_eviter_piege(msg)){
				msg.reply("évite la "+miniboss_nom);
				piege_safe.push(msg.author.id);
			} else if (r>0.95){
				msg.reply("échec critique ! "+msg.author.username+ " se prend la "+ miniboss_nom +" en essayant de l'éviter, et perd un niveau !");
				leveldown(msg);
			}
		} else {
			if(piege_safe.indexOf(msg.author.id)<0){
				leveldown(msg);
				try{
					msg.channel.send(msg.author.username + " se prend la "+ miniboss_nom +" de plein fouet et perd un niveau");
					msg.guild.channels.get(channel_id).delete();
					channel_id=0;
					piege_safe=Array();
					minijeu_status=false;		
					minijeu_type="";				
				}catch(error){
				}	
			}
		}
	}
	else if(minijeu_type=="Mini-boss"){
		alive=true;
		if(msg.channel.id==channel_id){
			r=Math.random();
			if (r<proba_killminiboss(msg)){
				p=Math.random();
				if (p<0.05){
					msg.reply("échec critique ! "+msg.author.username+ " perd un niveau !");
					leveldown(msg);
					return;
				}
				msg.reply("frappe le "+miniboss_nom + " et le tue");
				levelup(msg);
				alive=false;
				setTimeout(function(){
					try{
						msg.guild.channels.get(channel_id).delete();
					}catch(error){
					}
					minijeu_status=false;
					channel_id=0;
				},10000);
				minijeu_type="";
			}
			else {
				msg.reply("frappe le "+miniboss_nom + " mais le rate");
			}
		}
	} else if(minijeu_type=="Dieu"){
		if(msg.channel.id==channel_id){
		var id_msg=undefined;
			var go_msg=undefined;
			for(var exKey in god){
				if(god[exKey]["id"]==msg.author.id){
					id_msg=god[exKey]["id"];
					go_msg=god[exKey]["d"];
				}
			}
			if(msg.cleanContent.toLowerCase=="prier"){
				if (id_msg!=undefined){
					if (go_msg==miniboss_nom){
						msg.channel.send(msg.author.username+", fidèlement, s'agenouille devant l'avatar de "+nom+".");
						if(get_faction(msg)=="lunatiques"){
							folieup(msg);
						} else {
							levelup(msg); 
						}
						//5% de chances de drop item benediction divine
					}
					else {
						msg.channel.send("Les cieux se déchirèrent et la voix de "+go_msg+"retenti : \"Tu oses t'agenouiller devant "+nom+" ? Puisque c'est ainsi, souffre mon couroux !");
						if(get_faction(msg)=="lunatiques"){
							leveldown();
						} else {
							folieup(msg);
							leveldown(msg);
						}	
					}
				}
				else{
					god.push({
						"id":msg.author.id,
						"d":miniboss_nom
					});
					msg.channel.send("Bienvenue parmi mes fidèles "+msg.author.username+" dit "+nom+" d'une voix bienveillante");
					levelup(msg);
					folieup(msg);
				}
			} else {
				if (go_msg==miniboss_nom){
					msg.channel.send("Et bien, "+msg.author.username+" tu ne te prosternes pas devant ton dieu ?");
					leveldown(msg);
				}
			}
		} 
	}else if(minijeu_type=="deal_devil"){
		n_dealdevil-=1;
		if(n_dealdevil==0){
			var offer={};
			msg.reply("sans un son, l'envoyé du chaos disparait...");
			msg.author.createDM().then(function(channel){
				offer={
					"channelid":channel.id,
					"Type":"deal_devil",
					"authorid":msg.author.id
				};
				MP.push(offer);
				channel.send("Le chaos vous propose deux choix : voulez vous faire perdre au groupe des niveaux et plonger tout le monde dans la folie ? [oui/non]");
			}).catch(error);
		}
	}
}

function initminijeu(msg){
	piege_safe=Array();
		//type de mini jeu
		var r=Math.random();
		if(r<0.05){
			later_minijeu_type="Dieu";
			var nom = dieu[Math.floor(Math.random()*dieu.length)];
			miniboss_nom = nom;
			msg.channel.send("Une apparition divine de "+nom+" vous frappe tous. Vous agenouillez-vous ?");
		}else if(r<0.06){
			later_minijeu_type="deal_devil";
			n_dealdevil=3+r*3700;
			nom = "Pacte avec le chaos";
			msg.channel.send("Je suis l'agent du chaos qui reigne dans cette tour. Le "+n_dealdevil+"ème à s'exprimer recevra une faveur unique.");
		}else if(r<0.41){
			later_minijeu_type="Mini-boss";
			var nom = miniboss[Math.floor(Math.random()*miniboss.length)];
			var adject = adj[Math.floor(Math.random()*adj.length)];
			miniboss_nom = nom + " " + adject;
			msg.channel.send("Un "+miniboss_nom+" apparait !");
		}else{
			later_minijeu_type="Piege";
			var nom = pieges[Math.floor(Math.random()*pieges.length)];
			var adject = adj_pieg[Math.floor(Math.random()*adj_pieg.length)];
			miniboss_nom = nom + " " + adject;
			msg.channel.send("Une "+miniboss_nom+" prend "+msg.author.username+" par surprise !");
		}
		msg.guild.createChannel(miniboss_nom,'text').then(function(result){
			channel_id = result.id;
			msg.guild.channels.get(result.id).send("Qui osera défier le péril ?");
			minijeu_type=later_minijeu_type;
		});
		minijeu_status=true;
		r=Math.random();
		setTimeout(function(){
			try{	
				msg.guild.channels.get(channel_id).delete();
				}catch(error){
				}
				channel_id=0;
				minijeu_status=false;
				minijeu_type="";
			},r*300000);
}

function startminijeu(msg){
	var r = Math.random();
	if(r<proba_minijeu(msg)){
		initminijeu(msg);
		return true;
	}
	return false;
}

function proba_team(msg){
	console.log("team");
	console.log((1+levelplayer(msg))/100);
	return ((1+levelplayer(msg))/100);
}

function proba_attaque(msg){
	var att=0;
	for (var exKey in items){
		for (var it in items[exKey]){
			if(msg.member.roles.some(r=>[it].includes(r.name))){
				att=it.atk+att;
			}
		}
	}
	if(races[raceplayer(msg)]!=undefined)
		att=att+races[raceplayer(msg)].atk;
	console.log("att");
	console.log((att/100));
	return (att/100);
}

function proba_def(msg){
	var def=0;
	for (var exKey in items){
		for (var it in items[exKey]){
			if(msg.member.roles.some(r=>[it].includes(r.name))){
				def=it.def+def;
			}
		}
	}
	if(races[raceplayer(msg)]!=undefined)
		def=def+races[raceplayer(msg)].def;
	console.log("def");
	console.log((def/100));
	return (1-def/100);
}

function proba_minijeu(msg){
	console.log("minijeu");
	console.log((1/100+folieplayer(msg)/1000));
	return (1/100+folieplayer(msg)/1000);
}

function proba_killminiboss(msg){
	return 5/100+proba_attaque(msg)+1-proba_def(msg);
}

function proba_eviter_piege(msg){
	return proba_def(msg)+(levelplayer(msg)/100);
}

function proba_drop(msg, rarete){ //rareté = "leg", "rar", "mag", "com"
	var dr=0;
	for (var exKey in items){
		for (var it in items[exKey]){
			if(msg.member.roles.some(r=>[it].includes(r.name))){
				dr=it.drop+dr;
			}
		}
	}
	if(races[raceplayer(msg)]!=undefined)
		dr=dr+races[raceplayer(msg)].drop;
	switch (rarete){
		case "leg":
			return dr/10000; 
			break;
		case "rar":
			return dr/2000
			break;
		case "mag":
			return dr/333;
			break;
		case "com":
			return 1/100;
			break;
	}
	return 0;
}

function proba_event_team(msg){
	console.log("eventteam");
    console.log(0.005+folieplayer(msg)/1000)+(folieplayer(msg_precedent)/1000);
	return (0.005+folieplayer(msg)/1000)+(folieplayer(msg_precedent)/1000);
}

function proba_dé(msg){
	return (folieplayer(msg)/2000)+(folieplayer(msg_precedent)/2000);
}

function proba_spe(msg){
	var spekey = get_spe(msg);
	switch(spekey.length){
		case 0:
			if(levelplayer<5){
				return 0;
			} else if(levelplayer>15){
				return 5/100;
			} else {
				return (levelplayer(msg)-5)/200;
			}
			break;
		case 1:
			if(levelplayer<20){
				return 0;
			} else if(levelplayer>35){
				return 4/100;
			} else {
				return (levelplayer(msg)-20)/375;
			}
			break;
		case 2:
			if(levelplayer<30){
				return 0;
			} else if(levelplayer>60){
				return 3/100;
			} else {
				return (levelplayer(msg)-30)/1000;
			}
			break;
		case 3:
			if(levelplayer<45){
				return 0;
			} else if(levelplayer>80){
				return 2/100;
			} else {
				return (levelplayer(msg)-45)/1750;
			}
			break;
	}
	return 0;
}

function proba_boss(msg){
	if(folieplayer(msg)>100){
		return 0;
	}
	if(folieplayer(msg)>50){
		return 1/1000;
	}
	if(folieplayer(msg)>25){
		return 1/250;
	}
	return (1/100);
}

function proba_levelup(msg){
	var up=0;
	for (var exKey in items){
		for (var it in items[exKey]){
			if(msg.member.roles.some(r=>[it].includes(r.name))){
				up=it.levelup+up;
			}
		}
	}
	if(races[raceplayer(msg)]!=undefined)
		up=up+races[raceplayer(msg)].levelup;
	console.log("levelup");
	console.log((3+up)/100+day/100);
	return (3+up)/100+day/100;
}

function proba_folieup(msg){
	var mad=0;
	for (var exKey in items){
		for (var it in items[exKey]){
			if(msg.member.roles.some(r=>[it].includes(r.name))){
				mad=it.mad+mad;
			}
		}
	}
	if(races[raceplayer(msg)]!=undefined)
		mad=mad+races[raceplayer(msg)].mad;
	n1=0;
	n2=0;
	n3=0;
	n4=0;
	for (exKey in get_spe(msg)){
		if(spes[exKey]=="1"){
			n1++;
		}
		if(spes[exKey]=="2"){
			n2++;
		}
		if(spes[exKey]=="3"){
			n3++;
		}
		if(spes[exKey]=="4"){
			n4++;
		}
	}
	return (mad/100)-day/100+(n1*n2*n3*n4+n1*n2+n3*n4)/100;
}

function proba_leveldown(msg){
	var dw=0;
	for (var exKey in items){
		for (var it in items[exKey]){
			if(msg.member.roles.some(r=>[it].includes(r.name))){
				dw=it.leveldown+dw;
			}
		}
	}
	if(races[raceplayer(msg)]!=undefined)
		dw=dw+races[raceplayer(msg)].leveldown;
	return dw/100;
}

function proba_sortie_prison(msg){
	var pr=0;
	for (var exKey in items){
		for (var it in items[exKey]){
			if(msg.member.roles.some(r=>[it].includes(r.name))){
				pr=it.prison+pr;
			}
		}
	}
	if(races[raceplayer(msg)]!=undefined)
		pr=pr+races[raceplayer(msg)].prison;
	return (1+pr)/100;
}

function chiffre_rom(curs){
	switch(curs){
		case 1 : 
			return "I";
		case 2 : 
			return "II";
		case 3 : 
			return "III";
		case 4 : 
			return "IV";
		case 5 : 
			return "V";
		case 6 : 
			return "VI";
		case 7 : 
			return "VII";
		case 8 : 
			return "VIII";
		case 9 : 
			return "IX";
		case 10 :
			return "X";
		case 11 : 
			return "XI";
		case 12 : 
			return "XII";
		case 13 : 
			return "XIII";
		case 14 : 
			return "XIV";
		case 15 : 
			return "XV";
		case 16 : 
			return "XVI";
		case 17 : 
			return "XVII";
		case 18 : 
			return "XVIII";
		case 19 : 
			return "XIX";
		case 20 :
			return "XX";
	}
}

function to_prison(msg){
	prison_msg=msg;
	prison_id=msg.author.id;
}

//TODO
function gameover(){
}

bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));
bot.on("debug", (e) => console.info(e));
  
bot.login(auth.token);
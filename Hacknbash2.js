const Discord = require('discord.js');
var auth = require('./auth.json');
var conf = require('./conf.json');
const bot = new Discord.Client();
var fs = require('fs');
var install = false;
var init = false;
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
var folies=[]
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
var dieu_id; //envoyé divin
var dieu_username; //envoyé divin
var MP=[]; //channelID/authorID
var chaos_decided=false; //devient vrai quand l'event chaos/divin est arrivé. Permet de ne pas double drop.
var combo_id=0;
var combo_count=0;
var highest_floor=0;
var event_floor_up=false;
var event_floor_down=false;
var event_team=false;

//trahison
//event monter/descendre
//commandes
//drop items
//choix race
//calculproba
//event_spécialisation

bot.on('message', msg => {
	if(!install){
		if(msg.content=="install"){
			install(msg);
			install=true;
		}
	}
	if(day_light){
		day_night(msg);
		day_light=false;
	}
	if(msg.author.id=="625988662454386698") return;//le bot ne joue pas.
	if(msg_precedent==null) msg_precedent=msg;//just in case.
	add_player(msg);
	if(msg.author.id==prison_id){
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
	if(dm(msg)){
		return;
	}
	if(msg.member==null) return;//les gens offline ne jouent pas.
	if(event_floor_up){
		event_floor_up_res(msg);
		return;
	}
	if(event_floor_down){
		event_floor_down_res(msg);
		return;
	}
	if(event_team(msg){
	}
	if (event_specialization(msg){
	}
	if(boss_id==msg.author.id){
		fight_boss(msg);
	}
	if(minijeu_status){
		minijeu(msg);
	}
	msg_precedent=msg;
	
});

function load(){
}

function save(){
}

//fonction principale
function floor(msg){
	r=Math.random();
	if(r<0.01){
		if(day<0){// c'est la nuit, on propose de redescendre.
			if(bank_folie>5&&highest_floor>20){
				msg.channel.send("Avec le manque de lumière en cette sombre nuit, le groupe appeuré considère la possibilité de redescendre d'un étage... Pensez-vous que c'est la solution ? [oui/non]");
				event_floor_down=true;
				return true;
			}
		} else{
			if(bank_levels>5){
				msg.channel.send("A force d'exploration dans cette immense tour, et à la faveur de la lumière du jour, le groupe trouve enfin de progresser. Vous engagez vous dans les escaliers sinueux qui semblent vous emmener vers le sommet ? [oui/non]");
				event_floor_up=true;
				return true;
			}
		}
	}
	return false;
}

function event_floor_up_res(msg){
	if(msg.member.roles.some(r=>["Camisole"].includes(r.name))){
		return;
	}
	if(msg.content.toLowerCase()=="oui"){
		floorup(msg);
		bank_levels-=5;
		event_floor_up=false;
	}
	if(msg.content.toLowerCase()=="non"){
		event_floor_up=false;
	}
	return;
}

function event_floor_down_res(msg){
	if(msg.member.roles.some(r=>["Camisole"].includes(r.name))){
		return;
	}
	if(msg.content.toLowerCase()=="oui"){
		floordown(msg);
		bank_levels-=5;
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
function boss(msg){
	size=0;
	for(var exKey in boss) {
		size+=1;
	}
	size+=1;
	for(var exKey in boss) {
		droprate=Math.random();
		if(droprate<1/size){
			boss_name=exKey;
			break;
		}
		size=size-1;
	}
	boss_name=boss
	boss_id=msg.author.id;
	msg.channel.send(boss[boss_name]["Apparition"].replace("%username%",msg.author.username));
	return true;
}

function fight_boss(msg){
	r=Math.random();
	proba_victoire = proba_attaque(msg)/(proba_attaque(msg)+proba_def(msg));
	proba_défaite = proba_def(msg)/(proba_attaque(msg)+proba_def(msg));
	race=raceplayer(msg);
	if (r<(proba_attaque/10){
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
	r=math.random();
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
					}		
					if(get_faction(msg)=="lunatiques"){
						txt="Le groupe entier gagne en confiance et progresse plus vite !";
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
			if(r<proba_folie(msg)){
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
	if(what_level(x)<40){
		return false;
	}
	if(y.member.roles.some(r=>["Bouclier Divin"].includes(r.name))){
		myRole = y.guild.roles.find(role => role.name === "Bouclier Divin");
		y.member.removeRole(myRole);
		x.channel.send("La bénédiction qui enveloppe "+y.author.username+" se change en malédiction qui frappe "+x.author.username+" !"); 
		levelreset(x,x);
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
				if(msg.member.roles.some(r=>[exKey].includes(r.name))||msg_precedent.member.roles.somes(r=>[exKey].includes(r.name))){
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
			if(msg.member.roles.some(r=>[exKey].includes(r.name))||msg_precedent.member.roles.somes(r=>[exKey].includes(r.name))){
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
function event_team(msg){
	if(event_team&&(msg.author.id==msg_team_a.author.id||msg.author.id==msg_team_b.author.id)){
		nom_team=msg.cleanContent.substring(0,98).replace(/[^a-zA-Z ]/g, "");
		//test nom équipe déjà pris
		for(var exKey in teams){
			if(exKey==nom_team){
				msg.channel.send("l'équipe des "+nom_team+" voit d'un très mauvais oeil cette tentative d'usurpation de nom...");
				return false;
			}
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

function event_race(msg){
	index = id_race.findIndex(msg.author.id);
	if(index>=0){
		switch (msg.cleanContent.toLowerCase()){
			case humain:
				give_race("Humain",msg);
				event_race=false;
				id_race.splice(index,1);
				break;
			case elfe:
				give_race("Elfe",msg);
				event_race=false;
				id_race.splice(index,1);
				break;
			case gnome:
				give_race("Gnome",msg);
				event_race=false;
				id_race.splice(index,1);
				break;
			case ours:
				give_race("Ours",msg);
				event_race=false;
				id_race.splice(index,1);
				break;
			case cultiste:
				give_race("Cultiste",msg);
				event_race=false;
				id_race.splice(index,1);
				break;
			case nain:
				give_race("Nain",msg);
				event_race=false;
				id_race.splice(index,1);
				break;
			case rat:
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
		if(msg.member.roles.some(r=>[spes[exKey].nom].includes(r.name))){
			return exKey;
		}
	}
}

//fonction principale : return true si qqch se passe, false sinon.
function event_specialization(msg){
	if(msg.author.id==id_classe){
		switch (msg.cleanContent.toLowerCase()){
			case feu:
				spe=get_spe(msg);
				spe=add_spe(1,spe);
				give_spe(spe,msg);
				event_classe=false;
				if_classe=0;
				return true;
				break;
			case eau:
				spe=get_spe(msg);
				spe=add_spe(2,spe);
				give_spe(spe,msg);
				event_classe=false;
				if_classe=0;
				return true;
				break;
			case air:
				spe=get_spe(msg);
				spe=add_spe(3,spe);
				give_spe(spe,msg);
				event_classe=false;
				if_classe=0;
				return true;
				break;
			case terre:
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
		if(parseInt(x)<=parseInt(spe.subString(0,1))){
			return x+spe;
		}
		else {
			return spe.subString(0,1)+add_spe(x,spe.subString(1));
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

function join_chaos(msg){
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
		channel.send("Les dieux t'ont désigné comme agent divin. Un traitre s'est glissé dans le groupe, et ta mission est de l'empecher de nuire, et de le tuer le plus vite possible. Pour cela, tu peux utiliser ton coup divin en écrivant [utiliser coup divin] et cela frappera l'auteur du message précédent. Attention de ne pas frapper la mauvaise personne, le couroux des dieux ne sera pas tendre devant l'échec. Une dernière information : ne prête pas attention à la guilde des fous, ceux-ci ont perdu la raison et ne sont pas important dans ta quête.");
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
		if exKey["id"]==msg.author.id{
			return;
		}
	}
	fous.push({"id":msg.author.id,
			   "username":msg.author.username);
	
}

function join_chaos(msg){
	for (var exKey in chaos){
		if exKey["id"]==msg.author.id{
			return;
		}
	}
	chaos.push({"id":msg.author.id,
			   "username":msg.author.username);
	
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
		if exKey["id"]==msg.author.id{
			return;
		}
	}
	heros.push({"id":msg.author.id,
			   "username":msg.author.username);
}

function get_faction(msg){
	for (var exKey in heros){
		if exKey["id"]==msg.author.id{
			return "heros";
		}
	}
	for (var exKey in fous){
		if exKey["id"]==msg.author.id{
			return "fanatique";
		}
	}
	for (var exKey in chaos){
		if exKey["id"]==msg.author.id{
			return "chaos";
		}
	}
	if(dieu_id==msg.author.id){
		return "dieux";
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
					msg.channel.send("Bienvenue chez les lunatiques ! Votre objectif est de refaire descendre le groupe le plus vite possible à l'entrée du donjon ! Clairement c'est la meilleure solution. Mélanger les éléments sera votre meilleure solution : Eau avec Feu et Air avec Terre. Conservez cette information pour vous et restez cachés !");
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
					msg.channel.send("Bienvenue chez les heros ! Votre mission reste la même : guider le groupe d'aventuriers jusqu'au sommet de la tour. Attention, les lunatiques qui se cachent parmis vous vont tout faire pour saboter la mission.");
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
	}
}

function find_player(msg){
	var found = players.find(function(player){
		return player[0]==msg.author.id;
	});
	return found!=undefined;
}

function levelup(msg){
	bank_folie++;
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
			3:
				msg.reply("TRIPLE LEVELUP !");
				break;
			4:
				msg.reply("QUAD LEVELUP !");
				break;
			5:
				msg.reply("ULTRA LEVELUP !");
				break;
			6:
				msg.reply("DOMINATION !");
				folieup(msg);
				break;
			7:
				msg.reply("DIVIN !");
				folieup(msg);
				break;
			8:
				msg.reply("BENI PAR LE DIEU DU CHAOS!");
				folieup(msg);
				bank_folie+=5;
				break;
			9:
				msg.reply("SE RAPPROCHE DE LA CORRUPTION !");
				folieup(msg);
				bank_folie+=5;
				break;
			10:
				msg.reply("DEPASSE LES LIMITES DU DIVIN ET DU CHAOS!");
				folieup(msg);
				bank_folie+=10;
				bank_levels-=5;
				leveldown(msg);
				break;
		}
	}
	combo_id=msg.author.id;
}

function leveldown(msg){
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
	log_floorup(msg);
	if(floor>highest_floor){
		highest_floor=floor;
	}
}

function floordown(msg){
	floor--;
	log_floordown(msg);
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
	msg.guild.channels.find(function(channel){
		return channel.name=="niveau-ni-cochon";
	}).send("Le groupe parvient enfin à grimper un étage : "+floor,{code:true});
}

function log_floordown(msg){
	msg.guild.channels.find(function(channel){
		return channel.name=="niveau-ni-cochon";
	}).send("Perdu, le groupe décide qu'il est plus sage de revenir en arrière : "+floor,{code:true});
}

function install(msg){
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
	return 0;
}

function proba_attaque(msg){
	return 0;
}

function proba_def(msg){
	return 0;
}

function proba_minijeu(msg){
	return 0;
}

function proba_killminiboss(msg){
	return 0;
}

function proba_eviter_piege(msg){
	return 0;
}

function proba_drop(msg, rarete){ //rareté = "leg", "rar", "mag", "com"
	return 0;
}

function proba_event_team(msg){
	return (0.005+folieplayer(msg)/1000)+folieplayer(msg_precedent)/1000)+;
}

function proba_dé(msg){
	return folieplayer(msg)/2000)+folieplayer(msg_precedent)/2000;
}
bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));
bot.on("debug", (e) => console.info(e));
  
bot.login(auth.token);
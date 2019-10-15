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
var id_race = 0;
var spes = require('./spes.json');
var races = require('./races.json');
var teams = require('./teams.json');
var miniboss = require('./miniboss.json');
var adj = require('./adjectif_masc.json');
var pieges = require('./pieges.json');
var adj_pieg = require('./adjectif_fem.json');
var piege_safe;
var msg_precedent;
var minijeu_status=false;

//reserve levels
var bank_levels=0;
var bank_folie=0;

var day=0;
var players=[];
var levels=[];
var folies=[]
var floor=0;
//factions
var chaos=[]; //agent du chars
var heros=[]; //heros
var fous=[]; //lunatiques
var dieu=[]; //envoyé divin
var MP=[]; //channelID/authorID
var chaos_decided=false; //devient vrai quand l'event chaos/divin est arrivé. Permet de ne pas double drop.

//miniboss
//event monter/descendre
//commandes
//drop items
//choix race
//calculproba
//event_spécialisation

bot.on('message', msg => {
	if(msg.author.id=="618500337707515904") return;//le bot ne joue pas.
	if(msg.member==null) return;//les gens offline ne jouent pas.
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
	
	if(minijeu_status){
		minijeu(msg);
		return;
	}
	
});

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
		//alliés ?
		for(var exKey in teams){
			if(teams[exKey][0]==msg.author.id&&teams[exKey][1]==msg_precedent.author.id||teams[exKey][1]==msg.author.id&&teams[exKey][0]==msg_precedent.author.id){
				msg.channel.send("L'équipe des "+exKey+" entre "+msg.author.username+" et "+msg_precedent.author.username+" se renforce sur ces sages paroles.");
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
	if(msg.author.id==msg_team_a.author.id||msg.author.id==msg_team_b.author.id){
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
	if(msg.content=="Oui"||msg.content=="oui"){
		if(prison_id!=0){
			msg.channel.send("La sentence est tombée : " +msg_precedent.author.username+" prend la place de "+prison_name+" en prison !");
		}else {
			msg.channel.send("La sentence est tombée : " +msg_precedent.aut
				folieup(msg);
			
		}
		to_prison(msg_precedent);
		prison=false;
	} else if(msg.content=="Non"||msg.content=="non"){
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
	if(msg.author.id==id_race){
		switch msg.cleanContent.toLowerCase(){
			case humain:
				give_race("Humain",msg);
				event_race=false;
				id_race=0;
				break;
			case elfe:
				give_race("Elfe",msg);
				event_race=false;
				id_race=0;
				break;
			case gnome:
				give_race("Gnome",msg);
				event_race=false;
				id_race=0;
				break;
			case ours:
				give_race("Ours",msg);
				event_race=false;
				id_race=0;
				break;
			case cultiste:
				give_race("Cultiste",msg);
				event_race=false;
				id_race=0;
				break;
			case nain:
				give_race("Nain",msg);
				event_race=false;
				id_race=0;
				break;
			case rat:
				give_race("Rat",msg);
				event_race=false;
				id_race=0;
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
		switch msg.cleanContent.toLowerCase(){
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
		chaos.push(msg.author.id);
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

function join_dieu(msg){
	msg.author.createDM().then(function(channel){
		dieu.push(msg.author.id);
		channel.send("Les dieux t'ont désigné comme agent divin. Un traitre s'est glissé dans le groupe, et ta mission est de l'empecher de nuire, et de le tuer le plus vite possible. Pour cela, tu peux utiliser ton coup divin en écrivant [utiliser coup divin] et cela frappera l'auteur du message précédent. Attention de ne pas frapper la mauvaise personne, le couroux des dieux ne sera pas tendre devant l'échec. Une dernière information : ne prête pas attention à la guilde des fous, ceux-ci ont perdu la raison et ne sont pas important dans ta quête.");
	}).catch(error);
}

function offer_join_lunatics(msg){
	var offer={};
	msg.author.createDM().then(function(channel){
		offer={
			channelid=id,
			Type="fou",
			authorid=msg.author.id
		};
		MP.push(offer);
		channel.send("Une étrange voix intérieure commence à suggérer des idées étranges. La folie vous a atteint bien plus que vous ne le croyiez. Voulez vous y succomber et rejoindre le culte des fanatiques ? [oui/non]");
	}).catch(error);
}

function join_lunatics(msg){
	if(fous[msg.author.id]==undefined){
		fous.push(msg.author.id);
	}
}

function lunaticstotal(){
	var total=0;
	for (var exKey in fous){
		total++;
	}
	return total;
}

function join_heros(msg){
	if(heros[msg.author.id]==undefined){
		heros.push(msg.author.id);
	}
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
			switch offer.Type{
				case 'Fou':
					join_lunatics(msg);
					msg.channel.send("Bienvenue chez les lunatiques ! Votre objectif est de refaire descendre le groupe le plus vite possible à l'entrée du donjon ! Clairement c'est la meilleure solution. Mélanger les éléments sera votre meilleure solution : Eau avec Feu et Air avec Terre. Conservez cette information pour vous et restez cachés !");
					MP=MP.splice(index,1);
				break;
			}
		} else if(msg.cleanContent.toLowerCase()=="non"){
			switch offer.Type{
				case 'Fou':
					join_heros(msg);
					msg.channel.send("Bienvenue chez les heros ! Votre mission reste la même : guider le groupe d'aventuriers jusqu'au sommet de la tour. Attention, les lunatiques qui se cachent parmis vous vont tout faire pour saboter la mission.");
					MP=MP.splice(index,1);
				break;
			}
		}
	}
	else{
		return;
	}
}

function add_player(msg){
	if(!find_player(msg)){
		players.push(msg.author.id);
		//offrir race.
	}
}

function find_player(msg){
	var found = players.find(function(player){
		return element==msg.author.id;
	});
	return found!=undefined;
}

function levelup(msg){
	if(levels[msg.author.id]==undefined){
		levels[msg.author.id]=1;
	}else{
		levels[msg.author.id]+=1;
	}
	log_levelup(msg);
	msg.reply("level up!");
}

function leveldown(msg){
	if(levels[msg.author.id]==undefined){
		levels[msg.author.id]=0;
	}else{
		levels[msg.author.id]-=1;
	}
	log_leveldown(msg);
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
	if(folies[msg.author.id]==undefined){
		folies[msg.author.id]=1;
	}else{
		folies[msg.author.id]+=1;
	}
	log_folieup(msg);
	msg.reply("sombre un peu plus dans la folie");
}

function foliedown(msg){
	if(folies[msg.author.id]==undefined){
		folies[msg.author.id]=0;
	}else{
		folies[msg.author.id]-=1;
	}
	log_foliedown(msg);
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
}

function floordown(msg){
	floor--;
	log_floordown(msg);
}

function log_levelup(msg){
	msg.guild.channels.find(function(channel){
		return channel.name=="niveau-ni-cochon";
	}).send(msg.author.username+" gagne un niveau : "+levelplayer(msg)+\n\""+msg.cleanContent+"\"",{code:true});
}

function log_leveldown(msg){
	msg.guild.channels.find(function(channel){
		return channel.name=="niveau-ni-cochon";
	}).send(msg.author.username+" perd un niveau : "+levelplayer(msg)+\n\""+msg.cleanContent+"\"",{code:true});
}

function log_spe(msg,spe){
	msg.guild.channels.find(function(channel){
		return channel.name=="niveau-ni-cochon";
	}).send(msg.author.username+" devient : "+spe+\n\""+msg.cleanContent+"\"",{code:true});
}

function log_race(msg,race){
	msg.guild.channels.find(function(channel){
		return channel.name=="niveau-ni-cochon";
	}).send(msg.author.username+" fait partie du clan : "+race+\n\""+msg.cleanContent+"\"",{code:true});
}

function log_folieup(msg){
	msg.guild.channels.find(function(channel){
		return channel.name=="niveau-ni-cochon";
	}).send(msg.author.username+" tombe un peu plus profond dans la folie : "+folieplayer(msg)+\n\""+msg.cleanContent+"\"",{code:true});
}

function log_foliedown(msg){
	msg.guild.channels.find(function(channel){
		return channel.name=="niveau-ni-cochon";
	}).send(msg.author.username+" regagne un petit peu ses esprits : "+folieplayer(msg)+\n\""+msg.cleanContent+"\"",{code:true});
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
	if(minijeu_type=="Mini-boss"){
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
	}
}

function initminijeu(msg){
	piege_safe=Array();
		//type de mini jeu
		var r=Math.random();
		if(r<0.01){
			
		}else if(r<0.06){
			
		}else if(r<0.41){
			later_minijeu_type="Mini-boss";
			var nom = miniboss[Math.floor(Math.random()*miniboss.length)];
			var adject = adj[Math.floor(Math.random()*adj.length)];
			miniboss_nom = nom + " " + adject;
			msg.channel.send("Un "+miniboss_nom+" apparait !");
			miniboss_count++;
		}else{
			later_minijeu_type="Piege";
			var nom = pieges[Math.floor(Math.random()*pieges.length)];
			var adject = adj_pieg[Math.floor(Math.random()*adj_pieg.length)];
			miniboss_nom = nom + " " + adject;
			msg.channel.send("Une "+miniboss_nom+" prend "+msg.author.username+" par surprise !");
			piege_count++;
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
	if(r<proba_minijeu(msg)){//505
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
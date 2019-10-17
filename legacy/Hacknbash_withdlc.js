const Discord = require('discord.js');
var auth = require('./auth.json');
var conf = require('./conf.json');
const bot = new Discord.Client();
var lieux = require('./lieux.json');
var dialogues = require('./dialogues.json');
var levels = require('./levels.json');
var save = require('./save.json');
var item_stats = require('./table_drop_stats.json');
var leg = require('./table_drop_leg.json');
var rar = require('./table_drop_rar.json');
var mag = require('./table_drop_mag.json');
var com = require('./table_drop_com.json');
var align = require('./align.json');
var teams = require('./teams.json');
var fs = require('fs');

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

//https://discordapp.com/oauth2/authorize?client_id=618500337707515904&scope=bot&permissions=8

//jeu narratif
//progression dans l'aventure avec choix binaire : droite / gauche.
//json de lieux + question "gauche droite"
//variable de progression courante.
//tableau de lieu pour les prompts "on est où" et le message de rencontre de boss.
//la premiere réponse est toujours la bonne, le groupe est débile et anarchiste
//états de progression de bool X qui bloque tout sauf la réponse à l'événement.
//on interagit uniquement avec le précédent. (on peut se faire des dégat à soit meme)
//rencontre de boss
//3 bosses : dragon(mage), chevalier en armure(guerrier), araignée géante(shaman)[vulnérables par classes]
//levelup
//dégat au précédent (vol de niveau ou mort)
//les levelups font 1>2>3...>10 = elements > 1-10 > 2e element > 1-10 = classe
//3 éléments. eau > terre > feu
//double spé eau + terre = shaman
//double spé eau + feu = mage
//double spé teree + feu = guerrier
//peu de commandes, "on est où?" pour le lieu courant, "start" pour démarrer la partie.
//proba de base level up et progression = 1%, degressive pour les levelup
//progression des prios :
//résolution d'événement
//- lieu (droite / gauche)
//- choix de spé/classe
//- choix de mise en prison
//- résolution du combat.
//messages speciaux
//"!cure" pour perdre tous ses levels mais reset la malediction (si curse>0)
//interaction avec le joueur précédent
//rencontre de boss
//tableau de gens volables.

//création de roles.
//systeme de sauvegarde tout est stocké en LVL sauf le lieu et l'état des boss
//teamwipe = mauvais ending : boss de la zone pas tué = baisse des chances ((10-curse)/10)
//good ending : boss de la zone pas tué = boss respawn pas.
//si tous les boss sont morts= fin du jeu.
//si curse = 10, game over.
//pas de notion de channel, tout se fait en reply.

//methode de log = poster dans un chan dédié.

var install = false;
var init = false;
var start = false;//la partie a démarré.
var dragon = false;//le dragon est mort
var knight_nommage = false;
var dragon_nommage = false;
var dragon_combat = false;
var dragon_nom = "";
var knight = false;//le chevalier est mort
var knight_combat = false;
var knight_nom = "";
var spider = false;//l'araignee geante est morte
var spider_nommage = false;
var spider_combat = false;
var spider_nom = "";
var place = "0"; // le lieu où vous etes. 0 = firelink shrine.
var event_classe = false; //on est dans un evenement de choix
var event_classe_id=0;//l'id du joueur a classer
var event_place = false; // on est dans un evenement de déplacement
var prison=false;//on est dans un évémeent de prison
var prison_msg=0;//le message qui a fait mettre la personne en prison
var prison_id=0;//l'id de l'author en prison
var curse =0; //le niveau de malediction, affecte les probas de levelup.
var msg_precedent;//l'id du joueur qui a parlé avant
var coef = 1;//par défaut, 3. Max 10.
var prison_name = "";
var event_leader=false;
var end=false;
var oui=0;
var non=0;
var leader_msg=0;
var event_team=false;
var msg_team_a=0;
var msg_team_b=0;
var nb_msg=0;
var leader_name="";
var count = 0;
//stats
var total_count=0; //OK
var levelup_count=0; //OK
var leveldown_count=0; //OK
var levelreset_count=0; //OK
var atk_count=0; //OK
var drop_count=0; //OK
var miniboss_count=0;
var piege_count=0;
var team_count=0;
var spec=0;
//minijeu
var channel_id=0;
var minijeu_type="";
var minijeu_status=false;
var miniboss_nom="";
var day=0;
var miniboss = Array("Lion",
					"Crapaud",
					"Saumon",
					"Loup-Garou",
					"Chat",
					"Maraudeur",
					"Raton",
					"Voleur",
					"Cavalier",
					"Thaumaturge",
					"Nécromancien",
					"Pirate",
					"Fantôme",
					"Porteur de peste",
					"Parasite",
					"Vendeur d'assurance",
					"Cloporte",
					"Serpentin",
					"Serpent",
					"Allumeur de cigares",
					"Sacripant",
					"Bilboquet",
					"Hobbit",
					"Hibou",
					"Carnassier",
					"Vautour",
					"Viticulteur",
					"Rumatisme",
					"Troubadour",
					"Voyageur",
					"Faquin",
					"Va-nu-pieds",
					"Vandale",
					"Hun",
					"Wisigoth");
var adj = Array("Fanatique",
				"Sans-tête",
				"Suicidaire",
				"Pyromane",
				"Frénétique",
				"Soyeux",
				"Fabuleux",
				"Merveilleux",
				"Farfelu",
				"Bourgeois",
				"Anarchiste",
				"Sans jambes",
				"Sans âme",
				"Sans pitié",
				"Rigolo",
				"Nyctolope",
				"Frileux",
				"Robuste",
				"Vieillissant",
				"Poilu",
				"Pitoyable",
				"Marabout",
				"Accordéoniste",
				"Poilu",
				"Disparu",
				"Sauvage",
				"Affamé",
				"avec un Saucisson dans les mains",
				"avec un oeil de verre",
				"Glapissant",
				"Divertissant",
				"Utopiste",
				"Tonitruant",
				"Tapageur",
				"Nocturne",
				"mal reveillé",
				"à deux têtes",
				"Rouge",
				"Chef de projet pour une compagnie d'assurances",
				"Vert",
				"Pointu");
var pieges = Array("fosse",
					"trappe",
					"statue",
					"piscine",
					"météorite",
					"sorcière",
					"pluie",
					"équipe de danseuses étoiles",
					"jolie souris",
					"guitare",
					"chaise",
					"tartine",
					"poubelle",
					"massive boite",
					"subtile sirène",
					"raclette sans jambon",
					"meule de fromage",
					"seringue",
					"suisse allemande",
					"javanaise",
					"paire de lunettes",
					"ceinture",
					"lampe",
					"tartiflette");
var adj_pieg = Array("aux serpents",
					"de lave",
					"secrète",
					"aux lions",
					"infernale",
					"légendaire",
					"divine",
					"qui marche mal",
					"tordue",
					"poilante",
					"défigurée",
					"ténébreuse",
					"maléfique",
					"empoisonnée",
					"colérique",
					"purulente",
					"qui grince",
					"sectaire",
					"catholique",
					"enfarinée",
					"qui travaille chez Microsoft",
					"qui travaille dans un apple store",
					"qui conduit une Audi A4",
					"qui sort les poubelles",
					"qui nettoie son paillasson",
					"emmêlée",
					"aux escargots venimeux",
					"sirupeuse");
var piege_safe = Array();

load();

bot.on('message', msg => {
	
	if(!install){
		if(msg.content!="install"){
			return;
			} else {
				install=true;
			}
	}
	if(msg.author.id=="618500337707515904") return;//le bot ne joue pas.
	if(msg.member==null) return;//les gens offline ne jouent pas.
	//sauvegarde auto
	if (end){
		return;
	}
	if(spec>0){
		spec=spec-1;
	}
	nb_msg+=1;
	total_count+=1;
	if(spider&&knight&&dragon){
		msg.guild.channels.find("Victoire, vous avez vaincu les 3 fléaux !",{code:true});
		stats(msg);
		leaderboard(msg);
		msg.channel.send("Victoire, vous avez vaincu les 3 fléaux !\n Vous avez fini en "+nb_msg+" messages !");
		end=true;
	}
	if(total_count%250==0){
		if (day >0){
			r=Math.random();
			if(r>0.90){
				msg.channel.send("NUIT EPIQUE !");
				r=5;
			}
			day=-0.01-r/100;
			msg.channel.send("La nuit se couche, les aventuriers sont maintenant plus sur leurs gardes, les attaques peuvent surgir de n'importe où!");
		}
		else{
			r=Math.random();
			if(r>0.90){
				msg.channel.send("JOURNEE EPIQUE !");
				r=5;
			}
			day=0.01+r/100;
			msg.channel.send("Le jour se lève, il sera maintenant plus facile d'aller chasser des petits monstres et les adversaires ne pourront plus nous surprendre !");
		}
	}
	if(total_count%1350==333){
		leaderboard(msg);
		curse+=1;
		if (curse == 11){
			msg.channel.send("La malédiction atteint son paroxysme, le groupe tombe dans la folie.");
		}
		if (curse == 20){
			msg.channel.send("GAME OVER : Le groupe tourne en rond depuis des jours et des jours, incapable de progresser, la malédiction a enfin eu raison de tous.");
			msg.guild.channels.find("name","niveau-ni-cochon").send("GAME OVER : Le groupe tourne en rond depuis des jours et des jours, incapable de progresser, la malédiction a enfin eu raison de tous.",{code:true});
			gameover();
			return;
		}
		msg.channel.send("La malédiction se renforce... Il est peut-être temps d'utiliser une potion ? ["+chiffre_rom(curse)+"]");
	}
	if(total_count%450==0){
		stats(msg);
	}
	if(msg.content.toLowerCase().includes("oui")){
		oui++;
	}
	else if(msg.content.toLowerCase().includes("non")){
		non++;
	}
	if(oui%105==0&&oui>20){
		oui+=1;
		mod_align(1,msg);
		return;
	} else if (non%120==0&&non>20){
		non+=1;
		mod_align(-1,msg);
		return;
	}
	count+=1;
	if (count>100){
		savegame();
		count=0;
	}
	if(msg_precedent==null) msg_precedent=msg;
	if(start&&install&&init&&leader_msg=="0"||leader_msg.author=="undefined"){
		leader_msg=msg;
	}
	if(start&&install&&init&&leader_msg.author.id==msg.author.id&&!msg.member.roles.some(r=>["LEADER"].includes(r.name))){
		myRole = msg.guild.roles.find(role => role.name === "LEADER");
		leader_name==msg.author.username;
		msg.member.addRole(myRole);
	}
	if(start&&install&&init&&msg.member.roles.some(r=>["LEADER"].includes(r.name))&&leader_msg.author.id!=msg.author.id){
		myRole = msg.guild.roles.find(role => role.name === "LEADER");
		msg.member.removeRole(myRole);
	}
	if(msg.author.id==prison_id){
		var r=Math.random();
		if(r<0.05){
			if(prison_msg!=null&&prison_msg!=0){
				msg.channel.send(prison_msg.author.username+dialogues.prison_sortie);
				r=Math.random();
				if (r<0.20){
					mod_align(-10,msg);
				}
			}
			prison_id=0;
		}
		return;
	}
	
	if(minijeu_status){
		minijeu(msg,0);
		return;
	}
	else if(event(msg)){
		return;
	}
	else if(messages_spec(msg)){	
	}
	else if (attaque(msg)){
		atk_count+=1;
		msg_precedent=msg;
	}
	else if (boss(msg)){
		msg_precedent=msg;
	}
	else if (dé(msg)){
		msg_precedent=msg;
	}
	else if (team(msg)){
		msg_precedent=msg;
	}
	else { 
		if(curse<11){
			var r=Math.random();
			startminijeu(msg,r);
			drop(msg,r);
			levelup(msg,r);
			msg_precedent=msg;
		return;
		}
	}
	return;
});

function stats(msg){
	chan = msg.guild.channels.find("name","niveau-ni-cochon");
	if (chan==null){
		msg.guild.createChannel('niveau-ni-cochon',  'text' )
			.then(channel=>channel.send("Nombre de messages envoyés : "+total_count+"\n"+
										"Niveau de malédiction : "+curse+"\n"+
										"Penchant chaotique : "+non+"\n"+
										"Penchant loyal : "+oui+"\n"+
										"Nombre de levelup : "+levelup_count+"\n"+
										"Nombre de leveldown : "+leveldown_count+"\n"+
										"Nombre de reset de niveau : "+levelreset_count+"\n"+
										"Nombre d'attaques : "+atk_count+"\n"+
										"Nombre de drops d'items : " +drop_count+"\n"+
										"Nombre de mini boss rencontrés : " +miniboss_count+"\n"+
										"Nombre de pièges évités : " +piege_count+"\n"+
										"Nombre d'équipes formées : " +team_count+"\n"+
										"\n"+
										meilleure_team()
										,{code:true}))
		.catch(console.error);
	}else{	
		msg.guild.channels.find("name","niveau-ni-cochon")
			.send("Nombre de messages envoyés : "+total_count+"\n"+
										"Niveau de malédiction : "+curse+"\n"+
										"Penchant chaotique : "+non+"\n"+
										"Penchant loyal : "+oui+"\n"+
										"Nombre de levelup : "+levelup_count+"\n"+
										"Nombre de leveldown : "+leveldown_count+"\n"+
										"Nombre de reset de niveau : "+levelreset_count+"\n"+
										"Nombre d'attaques : "+atk_count+"\n"+
										"Nombre de drops d'items : " +drop_count+"\n"+
										"Nombre de mini boss rencontrés : " +miniboss_count+"\n"+
										"Nombre de pièges évités : " +piege_count+"\n"+
										"Nombre d'équipes formées : " +team_count+"\n"+
										"\n"+
										meilleure_team()
										,{code:true});
	}
	return;
}

function event(msg){
	if(!init){
		msg.channel.send(dialogues.init);
		init=true;
		return true;
	}else if(!start){
		if(msg.content=="start"){
			//création du role leader et attribution
			myRole = msg.guild.roles.find(role => role.name === "LEADER");
			botRole = msg.guild.roles.find(role => role.name === "Hack'n'Bash");
			if(myRole==null){
			msg.guild.createRole({
				name: "LEADER",
				position: 0,
				})
				.then(role => msg.member.addRole(role))
				.catch(console.error);
			}
			else {msg.member.addRole(myRole);}
			leader_msg=msg;
			leader_name=msg.author.username;
			msg.channel.send(dialogues.start);
			start=true;
		}
		return true;
	}else if(dragon_nommage){
		if(unSeulMot(msg)){
			dragon_nom=msg.content.replace(/[^a-zA-Z ]/g, "");
			if(dragon_nom==""){
				return true;
			}
			msg.channel.send("Son nom était : " +dragon_nom+","+msg.author+ " s'en souvenait à présent.");
			dragon_nommage=false;
		}
		return true;
	}else if(knight_nommage){
		if(unSeulMot(msg)){
			knight_nom=msg.content.replace(/[^a-zA-Z ]/g, "");
			if(knight_nom==""){
				return true;
			}
			msg.channel.send(knight_nom+" dit "+msg.author+ ", joins toi à nous !");
			knight_nommage=false;
		}
		return true;
	}else if(spider_nommage){
		if(unSeulMot(msg)){
			spider_nom=msg.content.replace(/[^a-zA-Z ]/g, "");
			if(spider_nom==""){
				return true;
			}
			msg.channel.send("Oui..."+spider_nom+" était son nom. Seul un démoniste pourrait venir à bout d'une telle créature");
			spider_nommage=false;
		}
		return true;
	}else if(dragon_combat){
		if(lowlevel(msg)){
			msg.channel.send(msg.author.username + " était largement trop faible et son cri fit juste rire le dragon, qui repris son envol en ricanant");
		}
		else if(msg.member.roles.some(r=>["LEADER"].includes(r.name))){
			msg.channel.send(msg.author.username + " en sa qualité de leader s'était affublé d'une ridicule couronne. Convoitant tout ce qui est d'or, le dragon rugit et d'un violent coup de griffe renversa son adversaire, et s'empara du trésor.");
			leveldown(msg,0);
			event_leader=true;
		}
		else if(msg.member.roles.some(r=>["Druide des arcanes"].includes(r.name))){
			msg.channel.send("Grace à sa puissante magie, "+msg.author.username+" gela les ailes du dragon, le faisant chuter. On entendit au loin le dernier rale de "+dragon_nom+" puis un bruit sourd.");
			log_level(msg.author.username + " accompli son destin de druide des arcanes et tue "+ dragon_nom + " le dragon gardien du donjon.", msg);
			dragon=true;
		}
		else if(msg.member.roles.some(r=>["Démoniste"].includes(r.name))||msg.member.roles.some(r=>["Archimage"].includes(r.name))){
			msg.channel.send("Sa magie permit à "+msg.author.username+" de parer les attaques du dragons. Se rendant compte que ses assauts était vains, "+dragon_nom+" fini par se lasser et pris son envol à la recherche d'une proie plus faible.");
		}
		else {
			msg.channel.send(msg.author.username+" n'avait pas vu l'assaut venir, et son équipement, vêtements et armes prirent feu.");
			leveldown(msg,0);
		}
		dragon_combat=false;
		return true;
	}else if(knight_combat){
		if(lowlevel(msg)){
			msg.channel.send(knight_nom+" continua sa patrouille en ignorant complètement la présence du groupe.");
		}
		else if(msg.member.roles.some(r=>["Archimage"].includes(r.name))){
			msg.channel.send("Sans hésiter, "+msg.author.username+" frappa " + knight_nom + " au coeur. Le coup fut fatal et le géant tomba, mort, tué en un coup.");
			log_level(msg.author.username + " accompli son destin d'Archimage et tue "+ knight_nom + " le chevalier", msg);
			knight=true;
		}
		else if(msg.member.roles.some(r=>["Druide des arcanes"].includes(r.name))||msg.member.roles.some(r=>["Démoniste"].includes(r.name))){
			msg.channel.send("A ces mots, " + knight_nom + " fut pris de terreur et s'inclina devant la puissance de "+msg.author.username+" laissant le groupe poursuivre sa route");
		}
		else {
			msg.channel.send("Sans frémir, "+ knight_nom +" fondit sur " + msg.author.username + " et le transperça de sa lance, manquant de peu de le tuer");
			leveldown(msg,0);
		}
		knight_combat = false;
		return true;
	}else if(spider_combat){
		if(lowlevel(msg)){
			msg.channel.send("Le groupe se mis en formation et était prêt à affronter la bête. Mais l'araignée se désinteressa completement du groupe et parti dans une autre direction.");
		}
		else if(msg.member.roles.some(r=>["Démoniste"].includes(r.name))){
			msg.channel.send("A la vue de "+ spider_nom+", "+msg.author.username+" invoqua un démon. Le combat entre les deux créatures dura ce qui semblait être une éternité... Le démon sorti vainqueur de l'affrontement, l'araignée agonisante pris la fuite.");
			log_level(msg.author.username + " accompli son destin de démoniste et tue "+ spider_nom + " l'araignée géante.", msg);
			spider=true;
		}
		else if(msg.member.roles.some(r=>["Druide des arcanes"].includes(r.name))||msg.member.roles.some(r=>["Archimage"].includes(r.name))){
			msg.channel.send("A ces mots, " + spider_nom + " pris la fuite. La puissance brute de "+msg.author.username+" suffisait à faire fuir la bête, mais pas encore à la tuer.");
		}
		else {
			msg.channel.send(spider_nom +" attrapa " + msg.author.username + " et le jeta au loin tel un fétu de paille, avant de continuer son chemin en ignorant le reste du groupe.");
			leveldown(msg,0);
		}
		spider_combat = false;
		return true;
	}else if(prison){
		if(msg.content=="Oui"||msg.content=="oui"){
			if(prison_id!=0){
				msg.channel.send("La sentence est tombée : " +msg_precedent.author.username+" prend la place de "+prison_name+" en prison !");
			}else {
				msg.channel.send("La sentence est tombée : " +msg_precedent.author.username+" doit aller en prison.");
			}
			to_prison(msg_precedent);
			//dialogue mise en prison.
			prison=false;
		} else if(msg.content=="Non"||msg.content=="non"){
			//dialogue pas prison
			msg.channel.send("Après moult délibérations, le groupe décide de ne pas mettre "+msg_precedent.author.username+" en prison.");
			prison=false;
		}
		return true;
	}else if(event_classe){
		if(msg.content=="feu"||msg.content=="Feu"){
			levelupfeu(msg_precedent);
		} else if(msg.content=="eau"||msg.content=="Eau"){
			levelupeau(msg_precedent);
		} else if(msg.content=="terre"||msg.content=="Terre"){
			levelupterre(msg_precedent);
		}
		return true;
	}else if(event_leader){
		myRole = msg.guild.roles.find(role => role.name === "LEADER");
		if (leader_msg!=null&&leader_msg!=0){
			leader_msg.member.removeRole(myRole);
		}
		msg.member.addRole(myRole);
		msg.channel.send("Sur ces mots, "+msg.author.username+" gagne l'admiration de tous, et devient le nouveau LEADER... Jusqu'a ce que la couronne lui soit reprise...");
		leader_name=msg.author.username;
		leader_msg=msg;
		event_leader=false;
		return true;
	}else if(event_team){
		same_team=false;
		nom_team=msg.cleanContent.substring(0,98);
		lvl=0;
		//supprimer les anciennes teams
		for(var exKey in teams){
			if(msg_team_a.member.roles.some(r=>[exKey].includes(r.name))){
				if(msg_team_b.member.roles.some(r=>[exKey].includes(r.name))){
					//renommage de team
					myRole = msg_team_a.guild.roles.find(role => role.name === exKey);
					myRole.delete('Dissolution de la team')
						.then(deleted => console.log(`Deleted role ${deleted.name}`))
						.catch(console.error);
					lvl=teams[exKey][2];
					same_team=true;

				}
				//msg_a quitte la team
				myRole = msg_team_a.guild.roles.find(role => role.name === exKey);
				myRole.delete('Dissolution de la team')
					.then(deleted => console.log(`Deleted role ${deleted.name}`))
					.catch(console.error);
				msg.channel.send(msg_team_a.author.username+" quitte la team " + exKey);
			} else if (msg_team_b.member.roles.some(r=>[exKey].includes(r.name))){
				myRole = msg_team_b.guild.roles.find(role => role.name === exKey);
				myRole.delete('Dissolution de la team')
					.then(deleted => console.log(`Deleted role ${deleted.name}`))
					.catch(console.error);
				msg.channel.send(msg_team_b.author.username+" quitte la team " + exKey);
				}
			}
		team_role(nom_team,msg_team_a,msg_team_b,lvl);
		if(same_team){
			msg.channel.send(msg_team_a.author.username+" et "+msg_team_b.author.username+" décident de renommer leur team : "+nom_team);
		}else{
			msg.channel.send(msg_team_a.author.username+" et "+msg_team_b.author.username+" créent une entente amicale, et nomment leur équipe : "+nom_team);
		}
		event_team=false;
		return true;
	}else{
		return false;
	}
}

function messages_spec(msg){
	if (spec >0){return false;}
	if(msg.content.includes("leader") && msg.content.includes("?")){
		msg.channel.send("N'oubliez pas que "+leader_name+" est votre guide. Vous lui devez admiration et respect, mais cela ne durera que jusqu'a ce qu'un autre prenne sa place.");
		spec=20;
		return true;
	}
	else if(msg.content.includes("prison") && msg.content.includes("?")){
		if(prison_id!="0"){
			msg.channel.send(prison_name +" tourne en rond dans la petite cellule. Il maugrée en boucle ces paroles qui lui méritèrent le cachot : "+prison_msg.cleanContent);
		}
		spec=20;
		return true;
	}
	else if(msg.content.includes("boire")&&msg.content.includes("potion")){
		if(msg.member.roles.some(r=>["Croisé"].includes(r.name))||msg.member.roles.some(r=>["Destructeur"].includes(r.name))){
			msg.channel.send(msg.author.username + " boit une gorgée de potion, mais celle ci n'a aucun effet.");
			return true;
		}else {
			msg.channel.send(msg.author.username + " décide de se sacrifier pour le groupe, et boit une gorgée de l'étrange potion rouge. Un sort instable le frappe de plein fouet, et crépite autour de tous les membres du groupe.");
		if(place=="0"){
			msg.channel.send("Sur la pierre tombale, l'inscription s'efface magiquement, et tout le monde sait qu'une terrible malédiction vient de se lever.");
		}
		levelreset(msg,msg);
		curse = 0;
		spec=20;
		return true;
		}
	}
	else if(msg.content.includes("équipe ?")){
		for(var exKey in teams){
			if(msg.member.roles.some(r=>[exKey].includes(r.name))||msg.member.roles.some(r=>["Destructeur"].includes(r.name))){
				msg.channel.send(teams[exKey][0]+" et "+teams[exKey][1]+" sont alliés et ne peuvent pas s'attaquer l'un l'autre.");
			}
		}
		spec=20;
		return true;
	}
	return false;
}

function attaque(msg){
	if (msg_precedent.member=="undefined"){
		return false;
	}
	var r=Math.random();
	if(r<(0.007+curse/600)){
		//alliés ?
		for(var exKey in teams){
			if(msg.member.roles.some(r=>[exKey].includes(r.name))&&msg_precedent.member.roles.some(r=>[exKey].includes(r.name))&&(msg.author.id!=msg_precedent.author.id)){
				msg.channel.send("L'équipe des "+exKey+" entre "+msg.author.username+" et "+msg_precedent.author.username+" se renforce sur ces sages paroles.");
				team_level_up(exKey);
				return true;
			}
		}
		//2 dialogues différents.
		if(msg.author.id!=msg_precedent.author.id){
			msg.channel.send("Sur ces paroles, "+msg.author.username+" s'empare de son arme et attaque "+msg_precedent.author.username);
			//roll pour le vol
			r=Math.random();
			arc=msg;
			if((100*r)<(20+what_level(msg_precedent)+bonus_attaque(msg)-bonus_defense(msg_precedent))){
				//attaque réussie : vol de niveau
				msg.channel.send("Tu oses me dire : \""+msg_precedent.toString()+ "\" ?" +" s'écrie "+msg.author.username+" !"+" Puisque c'est ainsi, meurs !");
				msg_precedent = mirroir(msg,msg_precedent);
				arc = arc_fleche(msg,msg_precedent);
				if(arc!=msg){
					msg_precedent=msg;
					msg=arc;
					arc=msg_precedent;
				}
				if(attaque_div(msg,msg_precedent)||leveldown(msg_precedent,0)){
					if(msg!=msg_precedent){
						msg.channel.send(msg_precedent.author.username+ " prend un serieux coup au visage, et tombe dans les pommes. Grace à cet exploit, "+msg.author.username +" gagne un niveau");
						levelup(msg,0);
					}else{
						msg.channel.send(msg_precedent.author.username+ " trébuche et manque de se trancher son propre pied.");
					}
					defense_div(msg,msg_precedent);
					reset_armes(msg);
				}else{
					msg.channel.send("Protégé par sa magie, "+msg_precedent.author.username+" évite l'attaque.");
					r=Math.random();
					if(r<0.75){
						mod_align(10,msg_precedent);
					}
				}
			} else {
				msg.channel.send("...mais rate lamentablement");
			}
			msg=arc;
			msg.channel.send("Le groupe s'arrête après cet incident et doit décider s'il est temps de prendre des mesures. Voulez-vous mettre "+msg.author.username+" en prison ?");  
			prison=true;
		} else{
			r=Math.random();
			if(r<0.5){
				msg.channel.send("Confus et désorienté, "+msg.author.username+" se met à s'attaquer lui même en criant.");
				if(r<0.25){
					msg.channel.send(msg.author.username+" se met un violent coup de massue sur le crâne, et tombe K.O");
					leveldown(msg_precedent,0);
				}
			}
		}
		return true;	
	}
	return false;
}

function what_level(x){
	for(var exKey in levels) {
		if(x.member.roles.some(r=>[levels[exKey].nom].includes(r.name))){
			return parseInt(exKey);
		}
	}
	return 0;
}

function bonus_attaque(x){
	bonus=0;
	for(var exKey in item_stats) {
		if(x.member.roles.some(r=>[exKey].includes(r.name))){
			bonus+=item_stats[exKey].atk;
		}
	}
	return bonus;
}

function bonus_defense(x){
	bonus=0;
	for(var exKey in item_stats) {
		if(x.member.roles.some(r=>[exKey].includes(r.name))){
			bonus+=item_stats[exKey].def;
		}
	}
	return bonus;
}

function reset_armes(x){
	if(x.member.roles.some(r=>["Caillou"].includes(r.name))){
		myRole = x.guild.roles.find(role => role.name === "Caillou");
		x.member.removeRole(myRole);
	}
	return;
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

function attaque_div(x,y){
	if(what_level(y)<40){
		return false;
	}
	if(x.member.roles.some(r=>["Coup Divin"].includes(r.name))){
		myRole = x.guild.roles.find(role => role.name === "Coup Divin");
		x.member.removeRole(myRole);
		levelreset(y,y);
		return true;
	}
	return false;
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

function mirroir(x,y){
	if(y.member.roles.some(r=>["Miroir magique"].includes(r.name))){
		myRole = y.guild.roles.find(role => role.name === "Miroir magique");
		y.member.removeRole(myRole);
		x.channel.send(y.author.username+" utilise son miroir magique et rend confus "+x.author.username+" qui se frappe à la jambe de toutes ses forces !");
		return x;
	}
	return y;
}

function leaderboard(msg){
	var a = "";
	for(var exKey in levels) {
		var b = ""
		myRole = msg.guild.roles.find(role => role.name === (levels[exKey].nom));
		if(myRole!=null){
		membersWithRole = myRole.members;
		if(membersWithRole.size>0){
			b=b+levels[exKey].nom+" :\n"
			membersWithRole.forEach(function(valeur, clé) {
				b=b+ valeur.user.username+ " ";
			});
			b=b+"\n";
		}
		a=b+a;
		}
	}
	chan = msg.guild.channels.find("name","niveau-ni-cochon");
	if (chan==null){
		msg.guild.createChannel('niveau-ni-cochon',  'text' )
		.then(channel=>channel.send(a,{code:true}))
		.catch(console.error);
	}else{	
		msg.guild.channels.find("name","niveau-ni-cochon").send(a,{code:true});
	}
	return;
}

function dé(msg){
	r=Math.random();
	if (r>0.0025||msg.author.id==msg_precedent.author.id){
		return false;
	}
	for(var exKey in item_stats) {
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
						levelup(msg,0);
					} else if (r<t){
						msg.channel.send("Défaite, "+msg.author.username +" perd son "+exKey+" !");
						myRole = msg.guild.roles.find(role => role.name === exKey);
						msg.member.removeRole(myRole);
						msg_precedent.member.addRole(myRole);
					} else {
						if(leveldown(msg_precedent,0)){
							msg.channel.send("Egalité, "+msg_precedent.author.username +" se prend un grand coup de "+exKey+" et perd un niveau !");
						}else {
							msg.channel.send("Egalité, le jeu s'arrête sur ce résultat décevant...");
						}
					}
					return true;
					
				}
		}
	}
	return false;
}

function team(msg){
	var r = Math.random();
	if(msg.author.id==msg_precedent.author.id){
		return false;
	}
	if (r<0.005){
		team_count++;
		msg.channel.send("Ces paroles étaient de bonne augure pour créer une alliance entre "+msg.author.username+" et "+msg_precedent.author.username+". Quel nom allait-on à cette équipe ?");
		msg_team_a=msg;
		msg_team_b=msg_precedent;
		event_team=true;
	}
	return false;
}

function boss(msg){
	var r=Math.random();
	if((r/coef)<(day/10+0.001+curse/1000)){
		r=Math.random();
		if (r<0.33){
			if(!knight){
				if(knight_nom==""){
					msg.channel.send("Soudain, un chevalier en armure interrompt la discussion. Il semble que c'est un ami, et son nom vous est familier.");
					knight_nommage=true;
					return true;
				}
				msg.channel.send("Silencieux depuis qu'il avait rejoint le groupe, "+knight_nom+" décide qu'il est temps de passer à l'action, et défie le groupe en duel !");
				knight_combat=true;
				return true;
			}else{
				msg.channel.send("Sur ces paroles, le groupe se rappelle de leur victoire héroïque contre "+knight_nom+".");
			}
		}
		else if (r<0.66){
			if(!spider){
				if(spider_nom==""){
					msg.channel.send("Au loin, le groupe aperçu une araignée géante, un des trois fléaux de ces lieux. Il s'agit d'une araignée que vous surnommez...");
					spider_nommage=true;
					return true;
				}else{
					msg.channel.send("Alors que le groupe était occupé à se taper dessus, "+spider_nom+" l'araignée géante attaque !");
					if(prison_id!=0 && prison_name!=""){
						msg.channel.send("Pris de terreur et incapable de s'enfuir, "+prison_name+" se heurte la tête contre la porte de la cage et tombe inconscient.");
						leveldown(prison_msg);
					}
					spider_combat=true;
					return true;
				}
			}
		}
		else{
			if(!dragon){
				if(dragon_nom==""){
					msg.channel.send("Les cendres et les cadavres carbonisées sur lesquels le groupe avançait depuis quelques metres ne signifiait qu'une seule chose...");
					dragon_nommage=true;
					return true;
				}else{
					msg.channel.send("Dans un rugissement, "+dragon_nom+ " le dragon tombe sur le groupe, et un torrent de lave les obligent à se replier. Le combat ne fait que commencer.");
					dragon_combat=true;
					return true;
				}
			}
		}
	}
	return false;
}

function drop(msg,r){
	var index=0;
	var size = 0;
	if(r>0.9998){
		for(var exKey in leg) {
			size+=1;
		}
		size+=1;
		for(var exKey in leg) {
			droprate=Math.random();
			if(droprate<1/size){
				if(att_role(exKey,"8E44AD",msg)){
					msg.channel.send("[OBJET LEGENDAIRE] "+msg.author.username+" trouve : "+ exKey+" ("+leg[exKey]+")");
					drop_count+=1;
				}
				return;
			}
			size=size-1;
		}
	} else if (r>0.999){
		for(var exKey in rar) {
			size+=1;
		}
		size+=1;
		for(var exKey in rar) {
			droprate=Math.random();
			if(droprate<1/size){
				if(att_role(exKey,"F1C40F",msg)){
					msg.channel.send("[OBJET RARE] "+msg.author.username+" trouve : "+ exKey+" ("+rar[exKey]+")");
					drop_count+=1;
				}
				return;
			}
			size=size-1;
		}
	} else if (r>0.992){
		for(var exKey in mag) {
			size+=1;
		}
		size+=1;
		for(var exKey in mag) {
			droprate=Math.random();
			if(droprate<1/size){
				if(att_role(exKey,"3498DB",msg)){
					msg.channel.send("[OBJET MAGIQUE] "+msg.author.username+" trouve : "+ exKey+" ("+mag[exKey]+")");
					drop_count+=1;
				}
				return;
			}
			size=size-1;
		}
	} else if (r>0.982){
		for(var exKey in com) {
			size+=1;
		}
		size+=1;
		for(var exKey in com) {
			droprate=Math.random();
			if(droprate<1/size){
				if(att_role(exKey,"BDC3C7",msg)){
					msg.channel.send("[OBJET COMMUN] "+msg.author.username+" trouve : "+ exKey+" ("+com[exKey]+")");
					drop_count+=1;
				}
				return;
			}
			size=size-1;
		}
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

function mod_align(i,msg){
	for(var exKey in align) {
		if(msg.member.roles.some(r=>[align[exKey]].includes(r.name))){
			if(align[(parseInt(exKey)+i)+""]!=undefined){
				align_role(align[(parseInt(exKey)+i)+""],msg);
				myRole = msg.guild.roles.find(role => role.name === align[exKey]);
				msg.member.removeRole(myRole);
				log_align(align[(parseInt(exKey)+i)+""],msg);
				return;
			}
			else{
				return;
			}
		}
	}
	if(align[i+""]!=undefined){
		align_role(align[""+i],msg);
		log_align(align[""+i],msg);
		return;
	}
	return;
}

function align_role(nom,msg){
	if(msg.member.roles.some(r=>[nom].includes(r.name))){
		return false;
	}
	myRole = msg.guild.roles.find(role => role.name === nom);
	if(myRole==null){
		botRole = msg.guild.roles.find(role => role.name === "Hack'n'Bash");
		msg.guild.createRole({
			name: nom,
			})
			.then(role => msg.member.addRole(role))
			.catch(console.error);	
	}else{
		msg.member.addRole(myRole);
	}
	return true;
}

function team_role(nom,msg_a, msg_b,lvl){
	myRole = msg_a.guild.roles.find(role => role.name === nom);
	if(myRole==null){
		botRole = msg_a.guild.roles.find(role => role.name === "Hack'n'Bash");
		msg_a.guild.createRole({
			name: nom,
			})
			.then(role => doubleadd(msg_a,msg_b,role))
			.catch(console.error);	
	}else{
		doubleadd(msg_a,msg_b,myRole);
	}
	//ajouter nom à teams.json
	teams[nom] = [msg_a.author.username,msg_b.author.username,lvl];
	fs.writeFile('./teams.json', JSON.stringify(teams), function (err) {
	if (err) return console.log(err);
	});
	return true;
}

function team_level_up(nom){
	teams[nom][2]++;
	fs.writeFile('./teams.json', JSON.stringify(teams), function (err) {
	if (err) return console.log(err);
	});
}

function meilleure_team(){
	meilleurA="";
	meilleurB="";
	nom="";
	lvl=-1;
	for (var exKey in teams){
		if (teams[exKey][2]>lvl){
			lvl=teams[exKey][2];
			meilleurA = teams[exKey][0];
			meilleurB = teams[exKey][1];
			nom=exKey;
		}
	}
	if (lvl>-1){
		return("- Meilleure équipe : \n"+nom+"\nAvec : "+meilleurA+" et "+meilleurB+"\nNiveau : "+lvl+"");
	}else {return ""; 
	}
}

function doubleadd(a,b,myRole){
	a.member.addRole(myRole);
	b.member.addRole(myRole);
}

function levelup(msg,r){
	var trouve = false;
	if((r/coef)<(day/10+0.025*(15-curse)/15)){
		//levelup
		//vérifier si le role existe.
		for(var exKey in levels) {
			if(msg.member.roles.some(r=>[levels[exKey].nom].includes(r.name))){
				//si on est 9, décision
				if(levels[exKey].nom.includes("9")){
					event_classe=true;
					msg.reply("level up!");
					msg.channel.send(dialogues.choix_element);
					levelup_count+=1;
					return true;
				}else if(levels[exKey].nom=="Archimage"||levels[exKey].nom=="Druide des arcanes"||levels[exKey].nom=="Démoniste"){//Archimage; Druide des arcanes; Démoniste
					return true;
				}else{
					var trouve = true;
					//si roberto à le role X, on lui enleve et on lui donne X+1
					var i=Math.random();
					if(i<(1-(parseInt(exKey))/230)){
						myRole = msg.guild.roles.find(role => role.name === levels[(parseInt(exKey)+1)+""].nom);
						if(myRole==null){
							botRole = msg.guild.roles.find(role => role.name === "Hack'n'Bash");
							msg.guild.createRole({
								name: levels[(parseInt(exKey)+1)+""].nom,
								color: levels[(parseInt(exKey)+1)+""].couleur,
								position: (botRole.position-1),
								})
							.then(function(role){
								msg.member.addRole(role);
								msg.reply("level up!");
								log_level(msg.author.username + " devient : " + myRole.name,msg);
							})
							.catch(console.error);
						}
						else{
							msg.member.addRole(myRole);
							log_level(msg.author.username + " devient : " + myRole.name,msg);
							msg.reply("level up!");
						}
						myRole = msg.guild.roles.find(role => role.name === levels[exKey].nom);
						msg.member.removeRole(myRole);
						levelup_count+=1;
						return true;
					}
					else {
					}
				}
			}
		}
		if(!trouve){
			//premier level
			myRole = msg.guild.roles.find(role => role.name === levels[1].nom);
			if(myRole==null){
				botRole = msg.guild.roles.find(role => role.name === "Hack'n'Bash");
				msg.guild.createRole({
					name: levels[1].nom,
					color: levels[1].couleur,
					//position: (botRole.position-1),
					})
				.then(function(role){
					console.log("prout");
					msg.member.addRole(role);
					msg.reply("level up!");
					log_level(msg.author.username + " devient : " + myRole.name,msg);
				})
				.catch(console.error);
				levelup_count+=1;
			}
			else{
				levelup_count+=1;
				msg.member.addRole(myRole);
				msg.reply("level up!");
				log_level(msg.author.username + " devient : " + myRole.name,msg);
			}
		}
		return true;
	}
	return false;
}

function lvlupgen(a,b,msg){
	myRole = msg.guild.roles.find(role => role.name === levels[a].nom);
	if(myRole==null){
		botRole = msg.guild.roles.find(role => role.name === "Hack'n'Bash");
		msg.guild.createRole({
			name: levels[a].nom,
			color: levels[a].couleur,
			position: (botRole.position-1),
			})
			.then(role => add_log(msg,role))
			.catch(console.error);	
	}else{
		msg.member.addRole(myRole);
		log_level(msg.author.username + " devient : " + myRole.name,msg);
	}
	msg.reply("level up majeur !");
	oldRole = msg.guild.roles.find(role => role.name === levels[b].nom);
	msg.member.removeRole(oldRole);
}

function add_log(msg,role){
	msg.member.addRole(role);
	log_level(msg.author.username + " devient : " + role.name,msg);
}

function levelupfeu(msg){
	if(msg.member.roles.some(r=>[levels["9"].nom].includes(r.name))){
		lvlupgen("10","9",msg);
		event_classe=false;
	}
	else if(msg.member.roles.some(r=>[levels["29"].nom].includes(r.name))){
		lvlupgen("50","29",msg);
		event_classe=false;
	}
	else if(msg.member.roles.some(r=>[levels["39"].nom].includes(r.name))){		
		lvlupgen("40","39",msg);
		event_classe=false;
	}
	else if(msg.member.roles.some(r=>[levels["69"].nom].includes(r.name))){		
		lvlupgen("71","69",msg);
		event_classe=false;
	}
	else{
		//dialogue qque chose d'horrible s'est passé, reset all level de msg_precedent
		msg.channel.send(dialogues.horrible_experience);
		levelreset(msg,msg_precedent);
		event_classe=false;
	}
	return false;
}

function levelupterre(msg){
	if(msg.member.roles.some(r=>[levels["9"].nom].includes(r.name))){
		lvlupgen("20","9",msg);
		event_classe=false;
	}
	else if(msg.member.roles.some(r=>[levels["19"].nom].includes(r.name))){
		lvlupgen("50","19",msg);
		event_classe=false;
	}
	else if(msg.member.roles.some(r=>[levels["39"].nom].includes(r.name))){		
		lvlupgen("60","39",msg);
		event_classe=false;
	}
	else if(msg.member.roles.some(r=>[levels["49"].nom].includes(r.name))){		
		lvlupgen("70","49",msg);
		event_classe=false;
	}
	else{
		//dialogue qque chose d'horrible s'est passé, reset all level de msg_precedent
		msg.channel.send(dialogues.horrible_experience);
		levelreset(msg,msg_precedent);
		event_classe=false;
	}
	return false;
}

function levelupeau(msg){
	if(msg.member.roles.some(r=>[levels["9"].nom].includes(r.name))){
		lvlupgen("30","9",msg);
		event_classe=false;
	}
	else if(msg.member.roles.some(r=>[levels["19"].nom].includes(r.name))){
		lvlupgen("40","19",msg);
		event_classe=false;
	}
	else if(msg.member.roles.some(r=>[levels["29"].nom].includes(r.name))){		
		lvlupgen("60","29",msg);
		event_classe=false;
	}
	else if(msg.member.roles.some(r=>[levels["59"].nom].includes(r.name))){		
		lvlupgen("72","59",msg);
		event_classe=false;
	}
	else{
		//dialogue qque chose d'horrible s'est passé, reset all level de msg_precedent
		msg.channel.send(dialogues.horrible_experience);
		levelreset(msg,msg_precedent);
		event_classe=false;
	}
	return false;
}

function leveldown(msg,r){
	//on boucle sur les niveaux
	for(var exKey in levels) {
		//si on a trouvé notre role
		if(msg.member.roles.some(r=>[levels[exKey].nom].includes(r.name))){
			var regex = /.*[1-9]/;
			var found = levels[exKey].nom.match(regex);
			if(found!=null){
				if(exKey!=1){
					myRole = msg.guild.roles.find(role => role.name === levels[(parseInt(exKey)-1)+""].nom);
					msg.member.addRole(myRole);
				}
				myRole = msg.guild.roles.find(role => role.name === levels[exKey].nom);
				msg.member.removeRole(myRole);
				leveldown_count+=1;
				log_level(msg.author.username + " perd un niveau",msg);
				return true;
			}
		}
	}
	return false;
}

function levelreset(msg,msg_precedent){
	var r=Math.random();
	if(r>0.5){
		reset(msg);
		log_level(msg.author.username +" repart au niveau 0",msg);
	}else{
		reset(msg_precedent);
		log_level(msg_precedent.author.username +" repart au niveau 0",msg);
	}
}

function reset(msg){
	for(var exKey in levels) {
		if(msg.member.roles.some(r=>[levels[exKey].nom].includes(r.name))){
			myRole = msg.guild.roles.find(role => role.name === levels[exKey].nom);
			msg.member.removeRole(myRole);
			levelreset_count+=1;
			return true;
				
		}
	}
}

function to_prison(msg){
	prison_msg=msg;
	prison_id=msg.author.id;
	prison_name=msg.author.username;
	if(msg.member.roles.some(r=>["LEADER"].includes(r.name))){
		event_leader=true;
	}
	
}

function log_level(str,msg){
	chan = msg.guild.channels.find("name","niveau-ni-cochon");
	if (chan==null){
		msg.guild.createChannel('niveau-ni-cochon',  'text' )
			.then(channel=>channel.send(str+"\n"+msg.cleanContent,{code:true}))
		.catch(console.error);
	}else{	
		msg.guild.channels.find("name","niveau-ni-cochon").send(str+"\n\""+msg.cleanContent+"\"",{code:true});
	}
	return;
}

function log_align(str,msg){
	chan = msg.guild.channels.find("name","niveau-ni-cochon");
	if (chan==null){
		msg.guild.createChannel('niveau-ni-cochon',  'text' )
			.then(channel=>channel.send(str+"\n"+msg.cleanContent,{code:true}))
		.catch(console.error);
	}else{	
		msg.guild.channels.find("name","niveau-ni-cochon").send(msg.author.username+" devient : "+str+"\n\""+msg.cleanContent+"\"",{code:true});
	}
	return;
}

function lowlevel(msg){
	for (i = 1; i < 10; i++) {
		if(msg.member.roles.some(r=>[levels[""+i].nom].includes(r.name))){
			return true;
		}
	}
	for(var exKey in levels) {
		if(msg.member.roles.some(r=>[levels[exKey].nom].includes(r.name))){
			return false;
		}
	}
	return true;
}

function unSeulMot(msg){
	var mots = msg.content.split(' ');
	if(mots.length==1){
		return true;
	}
	return false;
}

function load(){
	install = save["install"];
	init = save["init"];
	start = save["start"];
	dragon_nom = save["dragon_nom"];
	knight = save["knight"];
	knight_nom = save["knight_nom"];
	spider = save["spider"];
	spider_nom = save["spider_nom"];
	place = save["place"];
	prison_id = save["prison_id"];
	prison_name = save["prison_name"];
	leader_name=save["leader_name"];
	total_count=save["total_count"];
	oui=save["oui"];
	non=save["non"];
	end=save["end"];
	nb_msg=save["nb_msg"];
	levelup_count=save["levelup_count"];
	leveldown_count=save["leveldown_count"];
	levelreset_count=save["levelreset_count"];
	atk_count=save["atk_count"];
	drop_count=save["drop_count"];
	miniboss_count = save["miniboss_count"];
	piege_count = save["piege_count"];
	team_count = save["team_count"];	
}

function savegame(){
	save["total_count"]=total_count;
	save["install"] = install;
	save["init"] = init;
	save["start"] = start;
	save["dragon_nom"] = dragon_nom;
	save["knight"] = knight;
	save["knight_nom"] = knight_nom;
	save["spider"] = spider;
	save["spider_nom"] = spider_nom;
	save["place"] = place;
	save["prison_id"] = prison_id;
	save["prison_name"] = prison_name;
	save["leader_name"] = leader_name;
	save["oui"] = oui;
	save["non"] = non;
	save["end"] = end;
	save["nb_msg"] = nb_msg;
	save["levelup_count"] = levelup_count;
	save["leveldown_count"] = leveldown_count;
	save["levelreset_count"] = levelreset_count;
	save["atk_count"] = atk_count;
	save["drop_count"] = drop_count;
	save["miniboss_count"] = miniboss_count;
	save["piege_count"] = piege_count;
	save["team_count"] = team_count;
	fs.writeFile('./save.json', JSON.stringify(save), function (err) {
	if (err) return console.log(err);
	});
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

function gameover(){
	//remove all roles
	end=true;
	return;
	//then reset all variables
}

function minijeu(msg,r){
	//ouverture de channel
	if(minijeu_type=="Piege"){
		if(msg.channel.id==channel_id){
			msg.delete();
			var r=Math.random();
			if (r<0.9+day){
				msg.reply("évite la "+miniboss_nom);
				piege_safe.push(msg.author.id);
			} else if (r>0.995){
				msg.reply("échec critique ! "+msg.author.username+ " se prend la "+ miniboss_nom +" en essayant de l'éviter, et perd un niveau !");
				leveldown(msg,0);
			}
		} else {
			if(piege_safe.indexOf(msg.author.id)<0){
				if(leveldown(msg)){
					try{
						msg.channel.send(msg.author.username + " se prend la "+ miniboss_nom +" de plein fouet et perd un niveau");
						msg.guild.channels.get(channel_id).delete();
						channel_id=0;
						piege_safe=Array();
					minijeu_status=false;						
					}catch(error){
					}
					minijeu_type="";

				} else {
					var r=Math.random();
					if (r<0.1){
					try{
						msg.channel.send("Réussite critique ! " +msg.author.username + " évite la "+ miniboss_nom);
						msg.guild.channels.get(channel_id).delete();
						channel_id=0;
						piege_safe=Array();
					minijeu_status=false;						
					}catch(error){
					}
					minijeu_type="";
					}
				}
			}
		}
	}
	if(minijeu_type=="Mini-boss"){
		alive=true;
		if(msg.channel.id==channel_id){
			r=Math.random();
			y=Math.random()/2,5;
			if (r<(0.40+day-y)&&alive){
				for(var exKey in levels) {
					if(msg.member.roles.some(r=>[levels[exKey].nom].includes(r.name))){
						if(levels[exKey].nom.includes("9")){
							p=Math.random();
							if (p<0.01){
								msg.reply("échec critique ! "+msg.author.username+ " perd un niveau !");
								leveldown(msg,0);
							}
							else {
								return;
							}
						}
					}
				}
				msg.reply("frappe le "+miniboss_nom + " et le tue");
				levelup(msg,0);
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
			else if (r>0.405&&alive){
				msg.reply("frappe le "+miniboss_nom + " mais le rate");
			} else if (r>0.4 && r <0.405 && alive){
				msg.reply("échec critique ! "+msg.author.username+ " perd un niveau !");
				leveldown(msg,0);
			}
		}
	//résulution du mini jeu
	//cloture du channel
	}
}

function initminijeu(msg,r){
	piege_safe=Array();
		//type de mini jeu
		var mini_r=Math.random();
		if(r<0.35){
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
		d=Math.random();
		setTimeout(function(){
			try{	
				msg.guild.channels.get(channel_id).delete();
				}catch(error){
				}
				channel_id=0;
				minijeu_status=false;
			},d*300000);
}

function startminijeu(msg,r){
	if(r>0.5 && r<(0.511-curse/1000)){//505
		r=Math.random();
		initminijeu(msg,r);
	}
	return;
}

bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));
bot.on("debug", (e) => console.info(e));
  
bot.login(auth.token);
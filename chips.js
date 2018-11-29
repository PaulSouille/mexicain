module.exports = {
    init: function(bot) {
        var lastMessage;
        var beforeLastMessage;
        var chipsedUser = [];

        //Enleve le role chipsé à tous les utilisateurs à l'initialisation du bot
        bot.on('ready', function() {
            try {
                bot.guilds.forEach( async function (guild) {
                    await getChipsedRole(guild)
                    .then(function (role) {
                        guild.members.forEach( function(member) {
                            member.removeRole(role);
                        });
                    });

                    
                })
            }
            catch (e) {
                console.log(e.stack)
            }
        })
        
        
        //Liberer un joueur chipsé quand on le ping
        bot.on('message', async function(message){
            try {          
                if(message.author != bot.user) { //Si ce n'est pas le bot qui parle
                    if(chipsedUser.length > 0) { //Si il y a au moins un utilisateur chipsé
                        message.mentions.members.forEach(async function (memberMentionned) { //Pour chaque utilisateur mentionné dans le message
                            let index = chipsedUser.indexOf(memberMentionned);  //On essai de récupérer l'utilisateur mentionné dans le tableau des utilisateurs chipsé
                            
                            if(index >= 0) { //Si on a mentionné un utilisateur chipsé, on le libère
                                let user = chipsedUser[index];
                                chipsedUser.splice(index, 1);

                                await getChipsedRole(message.guild)
                                .then(function(role) {
                                    user.removeRole(role);
                                    message.channel.send(user + " a été libéré par " + message.author.username);
                                })
                            }
                        });
                    }
                }
            }
            catch (e) {
                console.log(e.stack)
            }
        });
        

        //Chipser un joueur
        bot.on('message', async function(message){
            try {
                if(message.content === '!chips') {
                    if(beforeLastMessage.content == lastMessage.content) {
                        if(beforeLastMessage.author != lastMessage.author) {
                            if((lastMessage.createdTimestamp - beforeLastMessage.createdTimestamp) <= 3000) {
                                if(beforeLastMessage.author == message.author) {
                                    var authorToMute = lastMessage.member;
                                }
                                else {
                                    var authorToMute = beforeLastMessage.member;
                                }
            
                                await getChipsedRole(message.guild)
                                .then(function(role) {
                                    authorToMute.addRole(role);
                                    chipsedUser.push(authorToMute)
                                    message.channel.send(authorToMute + " a été chipsé par " + message.author.username);
                                })
                                
                            }
                            else {
                                message.channel.send("Les deux messages ont été envoyé à plus d'une seconde d'intervalle !")     
                            }
                        }
                        else {
                            message.channel.send("Vous ne pouvez pas vous chipser vous même !")     
                        }
                    }
                    else {
                        message.channel.send("Les deux derniers messages ne contiennent pas le même texte !")
                    }
                }
            
                beforeLastMessage = lastMessage;
                lastMessage = message;
            }
            catch (e) {
                console.log(e.stack)
            }
        })
    }
 }

 //Récupérer le role Chipsé et le créer s'il n'existe pas
 async function getChipsedRole(guild) {
    try {
        let role = guild.roles.find(r => r.name === "Chipsé !");

        if(!role){
            try {
                let role = await createRole(guild)

                guild.channels.forEach(async (channel, id) => {
                    channel.overwritePermissions(
                        role,
                        {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false
                        }
                    );
                });

                return role;
            }
            catch (e) {
                console.log(e.stack)
            }
        }
        else {
            return role;
        }
    }
    catch (e) {
        console.log(e.stack)
    }
}

async function createRole(guild) {
    //Role to the top
    let botRole = guild.roles.find(r => r.name === "BotMexicain");
    if(!botRole) {
        throw "Il n'existe aucun role <BotMexicain> !";
    }
    let botRolePosition = botRole.calculatedPosition;

    return guild.createRole({
        name: "Chipsé !",
        color:"#000000",
        position: botRolePosition,
        permissions:[]
    });
}
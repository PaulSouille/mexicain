var mot = null;
var aff = null;
var channelBot = null;
var bot = null;
var lastPlayer = null;
var creator = null

var pendu = [`\`\`\`
                
                
                
                    
                    
                    
                    
                
    
============\`\`\``, `\`\`\`
    
    ||          
    ||          
    ||          
    ||         
    ||         
    ||
    ||
    ||
============\`\`\``,
    `\`\`\`
    ============
    ||        
    ||        
    ||       
    ||       
    ||        
    ||
    ||
    ||
============\`\`\``,
    `\`\`\`
    ============
    ||  /      
    || /       
    ||/       
    ||       
    ||       
    ||
    ||
    ||
============\`\`\``,
    `\`\`\`
    ============
    ||  /      |
    || /       |
    ||/        
    ||        
    ||        
    ||
    ||
    ||
============\`\`\``,
    `\`\`\`
    ============
    ||  /      |
    || /       |
    ||/        O
    ||         |
    ||        
    ||
    ||
    ||
============\`\`\``,
    `\`\`\`
    ============
    ||  /      |
    || /       |
    ||/        O/
    ||         |
    ||        
    ||
    ||
    ||
============\`\`\``,
    `\`\`\`
    ============
    ||  /      |
    || /       |
    ||/       \\O/
    ||         |
    ||        
    ||
    ||
    ||
============\`\`\``,
    `\`\`\`
    ============
    ||  /      |
    || /       |
    ||/       \\O/
    ||         |
    ||          \\
    ||
    ||
    ||
============\`\`\``,
    `\`\`\`
    ============
    ||  /      |
    || /       |
    ||/       \\O/
    ||         |
    ||        / \\
    ||
    ||
    ||
============\`\`\``];

var vies = pendu.length;

module.exports = {
    init : function(monBot) {
        bot = monBot;
        reset();

        bot.on('message', function (message) {
            //!pendu dans le channel bot
            if(message.channel === channelBot && message.content === '!pendu') {
                if(mot != null) {
                    sendAff();
                }
                else {
                    channelBot.send('Aucune partie n\'est en cours ! Lancez une partie en envoyant !pendu <mot> en message privé au bot !');
                }
            }

            //Stopper une partie : !pendu stop par le créateur dans le channel bot
            else if(message.channel === channelBot && message.content === '!pendu stop') {
                if(mot != null) {
                    if(creator.id === message.author.id) {
                        reset();
                        channelBot.send('La partie a été stoppée ! Relancez une partie en envoyant !pendu <mot> en message privé au bot !');
                    }
                    else {
                        channelBot.send('Seul ' + creator + ', le créateur de la partie peut la stopper !');
                    }
                }
                else {
                    channelBot.send('Aucune partie n\'est en cours ! Lancez une partie en envoyant !pendu <mot> en message privé au bot !');
                }
            }

            //Lancement d'une nouvelle partie : !pend <mot> dans un dm
            else if(message.channel.type === 'dm' && message.content.includes('!pendu ')) {
                if(mot === null) {
                    mot = message.content.replace('!pendu ', '').toUpperCase();
                    if(!mot.includes(' ')) {
                        newGame(mot, message.author);
                    }
                    else {
                        message.channel.send("Un seul mot est autorisé !");
                    }                
                }
                else {
                    message.channel.send("Une partie est déjà en cours ! ");
                }
            }

            //Réponse : !pendu <lettre/mot> dans le channel bot si la partie est lancée
            else if(mot != null && message.channel === channelBot && message.content.includes('!pendu ') && message.author !== bot.user) {
                var propose = message.content.replace('!pendu ', '').toUpperCase();

                if(!propose.includes(' ')) {
                    lastPlayer = message.author;

                    //One letter
                    if(propose.length == 1) {
                        answer(propose);
                    }
                    else {
                        if(propose === mot) {
                            aff = mot;
                            sendAff();
                            win();
                        }
                        else {
                            lostTurn();
                        }
                    }
                }
                else {
                    channelBot.send('Vous ne pouvez pas faire de proposition avec un espace !')
                }
            }
        })
    },
}

function reset() {
    mot = null;
    aff = null;
    lastPlayer = null;
    vies = pendu.length;
    creator = null;
    channelBot = bot.channels.find(x => x.name === 'bot');
}

function formatDiscord(text) {
    return '\`\`\`' + text + '\`\`\`';
}

function newGame(mot, author) {
    aff = "_ ".repeat(mot.length);
    creator = author;
    channelBot.send(author.username + ' a lancé un pendu !');
    channelBot.send('!pendu <lettre/mot> pour participer');
    sendAff();
}

function sendAff() {
    channelBot.send(formatDiscord(aff));
}

function win() {
    if(!aff.includes('_')) {
        channelBot.send('Gagné ! ' + lastPlayer + ' est le grand gagnant !');
        reset();
    }
}

function answer(letter) {
    if(mot.includes(letter)) {
        for (var i = 0; i < mot.length; i++) {
            if(mot.charAt(i) === letter) {
                aff = aff.replaceAt(i*2, letter);
            }
            
        }
        
        sendAff();
        win();
    }
    else {
        lostTurn();
    }
}

function lostTurn() {
    channelBot.send(pendu[pendu.length-vies]);
    vies -= 1;
    
    if(vies === 0) {
        aff = mot;
        sendAff();

        channelBot.send('Pendu !');
        reset();
        channelBot.send('Relancez une partie en envoyant !pendu <mot> en message privé au bot !');
    }
    else {
        sendAff();
    }
}

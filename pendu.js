var mot = null;
var aff = null;
var channelBot = null;
var bot = null;
var lastPlayer = null;
var creator = null;
var playedLetter = [];
var playedWord = [];

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
============\`\`\``,
[
`\`\`\`
    ============
    ||  /      |
    || /       |
    ||/       \\O/
    ||         |
    ||        /∞\\
    ||         |
    ||
    ||
============\`\`\``,
`\`\`\`
    ============
    ||  /      |
    || /       |
    ||/       \\O/
    ||         ∞
    ||         |
    ||        /°\\
    ||
    ||
    ||
============\`\`\``
]
];
var vies = pendu.length;

var botChannelName = 'bot';
var commande = '!pendu';
var locale = {
    'startGame' : 'Lancez une partie en envoyant !pendu <mot> en message privé au bot !',
    'noRunningGame' : 'Aucune partie n\'est en cours !',
    'gameStopped' : 'La partie a été stoppée !',
    'onlyCreator' : 'Seul le créateur de la partie peut executer cette commande !',
    'onlyOneWord' : 'Un seul mot est autorisé !',
    'alreadyRunningGame' : 'Une partie est déjà en cours ! ',
    'noSpaceProposal' : 'Vous ne pouvez pas faire de proposition avec un espace !',
    'gameOver' : 'Pendu !',
    'winner' : ' a gagné la partie !',
    'gameStarted' : ' a lancé un pendu !',
    'participate' : '!pendu <lettre/mot> pour participer',
    'playedLetter' : 'Lettres jouées : ',
    'playedWord' : 'Mots joués : ',
}

module.exports = function(monBot) {
        bot = monBot;
        reset();

        bot.on('message', function (message) {
            //!pendu dans le channel bot
            if(message.channel === channelBot && message.content === commande && message.author !== bot.user) {
                if(mot != null) {
                    sendAff();
                }
                else {
                    channelBot.send(locale.noRunningGame);
                    channelBot.send(locale.startGame);
                }
            }

            //Stopper une partie : !pendu stop par le créateur dans le channel bot
            else if(message.channel === channelBot && message.content === commande + ' stop' && message.author !== bot.user) {
                if(mot != null) {
                    if(creator.id === message.author.id) {
                        reset();
                        channelBot.send(locale.gameStopped);
                        channelBot.send(locale.startGame);
                    }
                    else {
                        channelBot.send(locale.onlyCreator);
                    }
                }
                else {
                    channelBot.send(locale.noRunningGame);
                    channelBot.send(locale.startGame);
                }
            }

            //Lancement d'une nouvelle partie : !pendu <mot> dans un dm
            else if(message.channel.type === 'dm' && message.content.startsWith(commande + ' ') && message.author !== bot.user) {
                if(mot === null) {
                    mot = message.content.replace(commande + ' ', '').toUpperCase();
                    if(!mot.includes(' ')) {
                        newGame(mot, message.author);
                    }
                    else {
                        message.channel.send(locale.onlyOneWord);
                    }                
                }
                else {
                    message.channel.send(locale.alreadyRunningGame);
                }
            }

            //Réponse : !pendu <lettre/mot> dans le channel bot si la partie est lancée
            else if(mot != null && message.channel === channelBot && message.content.startsWith(commande + ' ') && message.author !== bot.user) {
                var propose = message.content.replace(commande + ' ', '').toUpperCase();

                if(!propose.includes(' ')) {
                    lastPlayer = message.author;

                    //One letter
                    if(propose.length == 1) {
                        answerLetter(propose);
                    }
                    else {
                        answerWord(propose);
                    }
                }
                else {
                    channelBot.send(locale.noSpaceProposal)
                }
            }
        })
}

function reset() {
    mot = null;
    aff = null;
    lastPlayer = null;
    vies = pendu.length;
    creator = null;
    playedLetter = [];
    playedWord = [];
    channelBot = bot.channels.find(x => x.name === botChannelName);
}

function formatDiscord(text) {
    return '\`\`\`' + text + '\`\`\`';
}

function newGame(mot, author) {
    aff = "_ ".repeat(mot.length);
    creator = author;
    channelBot.send(author.username + locale.gameStarted);
    channelBot.send(locale.participate);
    sendAff();
}

function sendAff() {
    channelBot.send(formatDiscord(aff));
    channelBot.send(formatDiscord(
        locale.playedLetter + playedLetter.sort().join(', ') + `
` + locale.playedWord + playedWord.sort().join(', ')
    ))
}

function win() {
    //Si le mot affiché ne contient pas de _, la partie est gagnée
    if(!aff.includes('_')) {
        channelBot.send(lastPlayer + locale.winner); //Message gagnant
        reset(); //Reset game
    }
}

function answerLetter(letter) {
    if(!playedLetter.includes(letter)) {
        playedLetter.push(letter);

        //Si le mot contient la lettre
        if(mot.includes(letter)) {
            //On remplace les _ correspondant par la lettre
            for (var i = 0; i < mot.length; i++) {
                if(mot.charAt(i) === letter) {
                    aff = aff.replaceAt(i*2, letter);
                }
            }
            
            //On affiche le nouvel affichage
            sendAff();
            //On test si la partie est gagnée
            win();
        }
        else {
            lostTurn();
        }
    }
}

function answerWord(word) {
    //Si le mot n'a jamais été joué
    if(!playedWord.includes(word)) {
        playedWord.push(word);

        if(word === mot) {
            aff = mot;
            sendAff();
            win();
        }
        else {
            lostTurn();
        }
    }
    else {

    }
}

function lostTurn() {
    //Envoi du pendu
    var dessin = pendu[pendu.length-vies];

    if(typeof dessin === 'object') {
        var random = Math.floor(Math.random() * Math.floor(dessin.length));
        channelBot.send(dessin[random]);
    }
    else if (typeof dessin === 'string') {
        channelBot.send(dessin);
    }
    vies -= 1;
    
    //Si on a plus de vies
    if(vies === 0) {
        //On affiche le mot
        aff = mot;
        sendAff();  

        //Message de fin de partie
        channelBot.send(locale.gameOver);
        channelBot.send(locale.startGame);
        reset();
    }
    //Si il reste des vies
    else {
        //On affiche le mot
        sendAff();
    }
}

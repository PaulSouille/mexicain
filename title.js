const config = require('./config');
var giphy = require('giphy-api')(config.token.giphy);
const Timer = require('./timer')

var bot;
var channelBot = null;
var phase = null; // null : stopped, 1 : propose, 2 : vote
var proposals = [];
var votingMessages = [];
var timer = null;

var commande = '!title';
var locale = {
    'startGame' : 'Lancez une partie en envoyant ' + commande + ' !',
    'gameStarted' : '<Insert Title Here>    Phase de propositions :  ' + commande + ' <titre> en DM pour participer',
    'participate' : '',
    'votingPhase' : 'Phase de vote : votez pour une des phrases suivantes :',
    'endGame' : 'Fin de la partie ! Le titre qui gagne est : ',
}



module.exports = function(monBot) {
    bot = monBot;
    reset();

    bot.on('message', function(message) {
        
        //Lancement d'une partie
        if(message.channel == channelBot && message.content === commande && phase === null && message.author != bot.user) {
            startGame();
        }


        //Réponse
        if(message.channel.type == 'dm' && message.content.startsWith(commande + ' ') && phase === 1 && message.author != bot.user) {
            message.content = message.content.replace(commande + ' ', '');

            if(proposals.filter(x => x.author === message.author).length === 0) {
                proposals.push(message);
                message.channel.send('Phrase enregistrée ! Rendez-vous sur le channel bot pour voter !');
            }
            else {
                message.channel.send('Tu as déjà proposé ta phrase !');
            }
        }

        //Vote


    })
}

function formatDiscord(text) {
    return '\`\`\`' + text + '\`\`\`';
}


function votePhase() {
    channelBot.send(locale.votingPhase);

    proposals.forEach(function(proposal) {
        channelBot.send(formatDiscord(proposal.content.replace(commande + ' ', ''))).then(function(votingMessage) {
            votingMessage.proposal = proposal;
            votingMessages.push(votingMessage);
            votingMessage.react('👍');
        })
    });

    phase = 2;

    timer = new Timer(0,0,30);
    timer.callbackStop = end;
    channelBot.send(timer.getStr()).then(function(timeMessage) {
        timer.callbackDecrease = editMessage.bind(null, timeMessage, timer);
        timer.start();
    })
}

function end() {
    

    if(votingMessages.length > 0) {
        channelBot.send(locale.endGame);
        var results = votingMessages.sort(compare);
        var max = results[0].reactions.get('👍').count;

        var winners = votingMessages.filter(x => x.reactions.get('👍').count === max);
        winners.forEach(function(winnerMessage) {
            var str = winnerMessage.proposal.author.username + ' : ' + winnerMessage.proposal.content;
            channelBot.send(formatDiscord(str));
        });
    }
    else {

    }



    channelBot.send(locale.startGame);
    reset();
}

function compare(a, b) {
    const scoreA = a.reactions.get('👍').count;
    const scoreB = b.reactions.get('👍').count;
  
    return scoreB - scoreA;
  }

function editMessage(message, timer) {
    message.edit(timer.getStr())
}

function startGame() {
    phase = 1;
    giphy.random('funny', function (err, res) {
        channelBot.send(res.data.url);
        channelBot.send(locale.gameStarted);
        
        timer = new Timer(0,0,30);
        timer.callbackStop = votePhase;
        channelBot.send(timer.getStr()).then(function(timeMessage) {
            timer.callbackDecrease = editMessage.bind(null, timeMessage, timer);
            timer.start();
        })
    });
}

function reset() {
    phase = null;
    proposals = [];
    votingMessages = [];
    timer = null;

    if(channelBot == null) {
        channelBot = bot.channels.find(x => x.name === config.botChannelName);
    }
}
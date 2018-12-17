const config = require('./config');
var giphy = require('giphy-api')(config.token.giphy);
const Timer = require('../../timer');

var bot = null;
var channelBot = null;
var phase = null; // null : stopped, 1 : propose, 2 : vote, 3 : résultats
var proposals = [];
var votingMessages = [];
var votes = {};
var timer = null;
var commande = config.title.commande;
var locale = config.title.locale;

module.exports = function(monBot) {
    bot = monBot;
    channelBot = bot.channels.find(x => x.name === config.title.channelName);

    bot.on('message', function(message) {
        
        //Lancement d'une partie
        if(message.channel == channelBot && message.content === commande && phase === null && message.author != bot.user) {
            startGame();
        }


        //Réponse
        if(message.channel.type == 'dm' && message.content.startsWith(commande + ' ') && phase === 1 && message.author != bot.user) {
            message.content = message.content.replace(commande + ' ', '');

            //On cherche si l'utilisateur à déja envoyé une proposition
            var index = proposals.findIndex(x => x.author === message.author);

            //Si l'utilisateur n'a pas envoyé de proposition, on l'ajoute et on dit qu'il a participé
            if(index === -1) {
                proposals.push(message);
                channelBot.send(message.author + locale.authorPropose);
            }

            //Si l'utilisateur a déjà envoyé une proposition, on la remplace
            else {
                proposals[index] = message;
            }


            message.channel.send(locale.proposalRegistered);
        }
    })
}

function formatDiscord(text) {
    return '\`\`\`' + text + '\`\`\`';
}


function votePhase() {
    if(proposals.length > 0) {
        phase = 2;
        channelBot.send(locale.votingPhase);

        //On mélange les propositions
        proposals.sort(function(a, b){return 0.5 - Math.random()});

        //Affichage des phrases
        proposals.forEach(function(proposal) {
            channelBot.send(formatDiscord(proposal.content.replace(commande + ' ', '')))
            .then(function(votingMessage) {
                votingMessage.proposal = proposal;
                votingMessages.push(votingMessage);
                votingMessage.react('👍');

                const filter = (reaction, user) => reaction.emoji.name === '👍' && phase === 2 && user !== bot.user
                votingMessage.collector = votingMessage.createReactionCollector(filter, { time : (config.title.votingDuration + 2) * 1000 })
                votingMessage.collector.on('collect', reactionCollected)

                if(votingMessages.length === proposals.length) {
                    //Timer
                    timer = new Timer(0,0,config.title.votingDuration);
                    timer.callbackStop = end;
                    timer.display(channelBot, true);
                    timer.start();
                }
            })
        });
    }
    else {
        channelBot.send(locale.noProposal);
        reset();
    }
}

function reactionCollected(reaction, collector) {
    var user = reaction.users.last();

    if(reaction.message.proposal.author.id == user.id) {
        reaction.remove(user);
    }
    else {
        //Si l'utilisateur à déjà voté
        if(typeof votes[user.id] !== 'undefined') {
            votes[user.id].remove(user);
        }
    }

    votes[user.id] = reaction;
}


function end() {
    if(votingMessages.length > 0) {
        channelBot.send(locale.endGame);

        //Trie des message par nombre de pouce décroissant
        var results = votingMessages.sort(compare);

        //On récupère le premier nombre de pouce (le max)
        var max = results[0].reactions.get('👍').count;

        //On récupère les messages qui ont le nombre de pouces max
        var winners = votingMessages.filter(x => x.reactions.get('👍').count === max);

        //On affiche les gagnant
        winners.forEach(function(winnerMessage) {
            var str = winnerMessage.proposal.author.username + ' : ' + winnerMessage.proposal.content;
            channelBot.send(formatDiscord(str));
        });
    }
    else {
        channelBot.send(locale.noProposal);
    }

    channelBot.send(locale.startGame);
    reset();
}

function compare(a, b) {
    const scoreA = a.reactions.get('👍').count;
    const scoreB = b.reactions.get('👍').count;
  
    return scoreB - scoreA;
}

function startGame() {
    phase = 1;
    giphy.random(config.title.keyword, function (err, res) {
        channelBot.send(res.data.url);
        channelBot.send(locale.gameStarted);
        
        timer = new Timer(0,0,config.title.proposalsDuration);
        timer.callbackStop = votePhase;
        timer.display(channelBot, true);
        timer.start();
    });
}

function reset() {
    phase = null;
    proposals = [];
    votingMessages = [];
    timer = null;
}
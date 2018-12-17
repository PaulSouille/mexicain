var config = require('../../config');

config.title = {};
config.title.channelName = 'bot-title';
config.title.proposalsDuration = 30;
config.title.votingDuration = 15;
config.title.commande = '!title';
config.title.keyword = 'funny';
config.title.locale = {
    'startGame' : 'Lancez une partie en envoyant ' + config.title.commande + ' !',
    'gameStarted' : '@here <Insert title Here>    Phase de propositions :  ' + config.title.commande + ' <titre> en DM pour participer',
    'votingPhase' : 'Phase de vote : votez pour une des phrases suivantes :',
    'endGame' : 'Fin de la partie ! Le titre qui gagne est : ',
    'proposalRegistered' : 'Phrase enregistrée ! Rendez-vous sur le channel bot pour voter !',
    'authorPropose' : ' a proposé son titre !',
    'noProposal' : 'Aucune propositon n\'a été faite ! Fin de la partie !',
}

module.exports = config;
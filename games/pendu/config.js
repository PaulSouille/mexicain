var config = require('../../config');

config.pendu = {};
config.pendu.channelName = 'bot-pendu';

config.pendu.pendu = [`\`\`\`
                
                
                
                    
                    
                    
                    
                
    
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

config.pendu.commande = '!pendu';
config.pendu.locale = {
    'startGame' : 'Lancez une partie en envoyant ' + config.pendu.commande + ' <mot> en message privé au bot !',
    'noRunningGame' : 'Aucune partie n\'est en cours !',
    'gameStopped' : 'La partie a été stoppée !',
    'onlyCreator' : 'Seul le créateur de la partie peut executer cette commande !',
    'onlyOneWord' : 'Un seul mot est autorisé !',
    'alreadyRunningGame' : 'Une partie est déjà en cours ! ',
    'noSpaceProposal' : 'Vous ne pouvez pas faire de proposition avec un espace !',
    'gameOver' : 'Pendu !',
    'winner' : ' a gagné la partie !',
    'gameStarted' : ' a lancé un pendu !',
    'participate' : config.pendu.commande + ' <lettre/mot> pour participer',
    'playedLetter' : 'Lettres jouées : ',
    'playedWord' : 'Mots joués : ',
}

module.exports = config;
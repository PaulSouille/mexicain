const Discord = require('discord.js');
var latestTweets = require('latest-tweets');
const fs = require('fs');
const bot = new Discord.Client();

alban = [   'Est chef de projet',
            'Est un con',
            'Développe sous Windev',
            'Est délégué de classe',
            'Est surement ton père',
            'Fait l\'amour à ta maman',
            ':smirk:'
            'Est beau',
            'Peut casser 3 pattes à un canard',
            'Se ferait bien un kebab ce midi'
        ];

bot.on('message',function(message){
    switch(message.content) {
        case '!alban' :
            random = Math.floor(Math.random() * Math.floor(alban.length));
            message.channel.send(alban[random]);
            break;

        case '!mexicain' :
            message.channel.send("https://gph.is/2ONGacO");
            break;

        case '!lucas' :
            message.channel.send("http://gph.is/1AaMetU");
            break;
    }
})

function sendGif(){
    try{

        bot.channels.get('509766652531965964').send("https://gph.is/2ONGacO");

	    bot.channels.get('463332456695595031').send("https://gph.is/2ONGacO");
	}
    catch{
	console.log('error');
}
}
bot.on('ready', () => {
    bot.user.setActivity('plier des chaises');
})
sendGif();
//getTweet();
setInterval(sendGif,14400000);
bot.login('');

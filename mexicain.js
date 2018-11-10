const Discord = require('discord.js');
const config = require('./config');
const bot = new Discord.Client();
var giphy = require('giphy-api')(config.token.giphy);

const chips = require('./chips');
chips.init(bot);

alban = [   'Est chef de projet',
            'Est un con',
            'Développe sous Windev',
            'Est délégué de classe',
            'Est surement ton père',
            'Fait l\'amour à ta maman',
            ':smirk:',
            'Est beau',
            'Peut casser 3 pattes à un canard',
            'Se ferait bien un kebab ce midi'
        ];

bot.on('message',function(message){
    if(message.content.startsWith('!rgif')) {

        let args = message.content.split(' ')
        args.shift();
        giphy.random(args.join(''), function (err, res) {
            message.channel.send(res.data.url);
        });
    }
});

bot.on('message',function(message){
    if(message.content === '!alban') {
        random = Math.floor(Math.random() * Math.floor(alban.length));
        message.channel.send(alban[random]);
    }
})

bot.on('message',function(message){
    if(message.content === '!mexicain') {
        message.channel.send("https://gph.is/2ONGacO");
    }
})

bot.on('message',function(message){
    if(message.content === '!lucas') {
        message.channel.send("http://gph.is/1AaMetU");
    }
})

function sendGif(){
    try{
        bot.channels.find(x => x.name === "bot").send("https://gph.is/2ONGacO");
	}
    catch (e){
        console.log(e.stack);
    }
}

bot.on('ready', () => {
    bot.user.setActivity('plier des chaises');
})

setInterval(sendGif,14400000);
bot.login(config.token.discord);
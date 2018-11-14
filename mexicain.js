const Discord = require('discord.js');
const config = require('./config');
const bot = new Discord.Client();
var giphy = require('giphy-api')(config.token.giphy);
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(config.token.newsapi);

const chips = require('./chips');
chips.init(bot);
//TEST PUSH
//test push 2
//test psuh 3
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
    if (message.content ==='!news'){
        random = Math.floor(Math.random() * Math.floor(20));

        newsapi.v2.topHeadlines({
            language: 'fr',
          }).then(response => {
              message.channel.send(response.articles[random].url);

          });
    }
});

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
    if (message.content ==='AH'){
        message.channel.send('https://pbs.twimg.com/profile_images/805774049892855808/Qw1m1Uvo.jpg')
        message.channel.send('AH !')
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

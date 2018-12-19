const Discord = require('discord.js');
const config = require('./config');
const bot = new Discord.Client();
var giphy = require('giphy-api')(config.token.giphy);
const games = require('./games/games');
const request = require('request');
const dateHelper = require('./date.js');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
const { JSDOM } = require("jsdom");
const Timer = require('./timer');
var timer = null;

//Capitalize the first letter of an str : str.capitalize()
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}
String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

bot.on('ready', function() {
    games(bot);
});

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

if(typeof config.url.edt !== 'undefined' && config.url.edt !== '') { //Si l'url de l'emploi du temps n'est pas spécifié, on écoute pas l'évenement
    bot.on('message', function(message) {
        if(message.content === '!reste') {
            if(typeof config.token.epsi[message.author.id] !== 'undefined' && config.token.epsi[message.author.id] !== '') {
                var currentDate = new Date();
                var dateStr = currentDate.toLocaleDateString('en-US');
                var timeStr = currentDate.getHours() + ":" + currentDate.getMinutes();
                var url = config.url.edt + '&tel=' + config.token.epsi[message.author.id] + '&date=' + dateStr + '%20' + timeStr;
                
                request.get(url, (err, res, data) => {
                    var dom = new JSDOM(data)
                    
                    var lines = dom.window.document.querySelectorAll(".Ligne");
                    var firstLine = lines[0];
                    var secondLine = lines[1];

                    if(firstLine != null) {
                        if(secondLine != null && firstLine.querySelector(".Matiere").textContent === secondLine.querySelector(".Matiere").textContent) {
                            firstLine = secondLine;
                        }
                        
                        var timeEnd = firstLine.querySelector(".Fin").textContent;
                        var explode = timeEnd.split(":")

                        var dateFin = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), parseInt(explode[0]), parseInt(explode[1]));

                        var diff = dateHelper.datediff(currentDate, dateFin);

                        if(timer != null) {
                            timer.stop();
                        }
                        timer = new Timer(diff.hour, diff.min, diff.sec);
                        timer.display(message.channel, true);
                        timer.start();
                    }
                    else {
                        message.channel.send('Aucun module à venir aujourd\'hui !');
                    }
                });
            }
            else {
                message.channel.send(message.author.username + ' : aucun login epsi associé !');
            }
        }
    });
}

if(typeof config.token.newsapi !== 'undefined' && config.token.newsapi !== '') { //Si la clé d'api n'est pas spécifié, on écoute pas l'évenement
    const NewsAPI = require('newsapi');
    const newsapi = new NewsAPI(config.token.newsapi);

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
}


if(typeof config.url.api !== 'undefined' && config.url.api !== '') { //Si l'url de l'api n'est pas spécifié, on écoute pas l'évenement
    bot.on('message',function(message){
        var url = config.url.api+"/message?event="+message;
        request.get({
            url: url,
            json: true,
            headers: {'User-Agent': 'request'}
        }, (err, res, data) => {
            if (err) {
                console.log(err);
            } else if (res.statusCode !== 200) {
                console.log('Status:', res.statusCode);
            } else {
                console.log(data);
                if(data.error != 'EMPTY'){
                    console.log(data.data[0].response);
                    message.channel.send(data.data[0].response);
            }
        }
        });
    })

    bot.on('message',function(message){
        if(message.content==='!help'){
            commands = ['!help',
                '!news',
                '!rgif <param>',
                '!code',
                '!alban',
                '!chips',
                '!joursEpsi',
                '!reste',
                '!pendu (channel bot-pendu)',
                '!pendu stop (channel bot-pendu)',
                '!title (channel bot-title)',
                ];
    
            request.get({
                url: config.url.api+'/event/get',
                json: true,
                headers: {'User-Agent': 'request'}
            }, (err, res, data) => {
                if (err) {
                    console.log(err);
                } else if (res.statusCode !== 200) {
                    console.log('Status:', res.statusCode);
                } else {
                    if(data.error != 'ERROR'){
                        data.data.forEach(function(element){
                            commands.push(element['event']);
                            console.log(commands);
                        })
                        messageHelp = '```'
                        commands.forEach(function(element){
                            messageHelp+=element+'\n';
                        })
                        messageHelp += '```'
                        message.channel.send(messageHelp);
                        console.log(commands);
                }
            }
            });
        }
    })
}

bot.on('message', function(message){
    if(message.content === "!code")
    {
        request.get({ url : config.url.joiesCode }, (err, res, data) => {
            var regexRandomUrl = new RegExp('(?<=href=").*?(?="><i class="fas fa-random")', "gm");
            var newUrl = data.match(regexRandomUrl)[0];
            
            request.get({ url : newUrl }, (err, res, data) => {
                var regexTitle = new RegExp('(?<=<h1 class="blog-post-title">).*?(?=<\/h1>)', "gm");
                var title = data.match(regexTitle)[0];
                title = entities.decode(title);
                title = title.capitalize();

                var regexGif = new RegExp('(?<=og:image" content=").*?.gif(?=")', "gm");
                var gifUrl = data.match(regexGif);

                if(gifUrl != null) {
                    message.channel.send(gifUrl[0]);
                    message.channel.send(title);
                }
                else {
                    message.channel.send(newUrl);
                }
            });
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
    if(message.content === '!alban') {
        random = Math.floor(Math.random() * Math.floor(alban.length));
        message.channel.send(alban[random]);
    }
})


bot.on('message',function(message){
    if(message.content === '!joursEpsi') {
        message.channel.send("Il reste " + dateHelper.nbJoursEpsiRestant() + " jours EPSI.");
    }
})


bot.on('message',function(message){
    if(message.content.toLowerCase().includes("patrick") && !message.content.toLowerCase().includes("!patrick")) {
        message.channel.send("https://bit.ly/2QegW82");
    }
})



function sendGif(){
    try{
        if(dateHelper.etreJourEpsi(new Date())) {
            bot.channels.find(x => x.name === "bot").send("https://gph.is/2ONGacO");
        }
	}
    catch (e){
        console.log(e.stack);
    }
}

function editMessage (message, timer) {
    message.edit(timer.getStr());
}

bot.on('ready', () => {
    bot.user.setActivity('plier des chaises');
})

setInterval(sendGif,14400000);
bot.login(config.token.discord);

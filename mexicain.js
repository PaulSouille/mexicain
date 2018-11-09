const Discord = require('discord.js');
const bot = new Discord.Client();

alban = ['Est chef de projet','Est un con','Développe sous windev','Est délégué de classe','Est surement ton père','Fait l\'amour à ta maman'];

bot.on('message',function(message){
    if (message.content ==='!alban'){

        random = Math.floor(Math.random() * Math.floor(alban.length));
        message.channel.send(alban[random]);

    }
})

bot.on('message',function(message){
    if (message.content ==='!mexicain'){

        message.channel.send("https://gph.is/2ONGacO");

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
    bot.user.setActivity('Plier des chaises');
})
sendGif();
setInterval(sendGif,14400000);
bot.login('');


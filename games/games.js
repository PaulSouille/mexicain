const title = require('./title/title');
const pendu = require('./pendu/pendu');
const chips = require('./chips/chips');


module.exports = function (bot) {
    title(bot);
    pendu(bot);
    chips.init(bot);
}
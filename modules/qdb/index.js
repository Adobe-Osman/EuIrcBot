var http = require('http'),
    requestify = require('requestify');
module.exports.commands = ['quo', 'qudb', 'quodb', 'qdb'];

var bot;
var conf = null;

module.exports.init = function(b) {
  bot = b;
  bot.getConfig("qdb.json", function(err, co) {
    if(err) console.log("Error with QDB module, no conf");
    else conf = co;
  });
};

module.exports.run = function(rem, parts, reply, command, from, to, text, raw) {
  if(to[0] != '#' && to[0] != '&') return;
  if(conf === null) return;

  var scrollbackModule = bot.modules['sirc-scrollback'];

  if(!scrollbackModule) return console.log("No scrollback, can't qdb");

  scrollbackModule.getFormattedScrollbackLinesFromRanges(to, parts, function(err, res) {
    if(err) return reply(err);

    requestify.post(conf.baseUrl + '/api/quote', {
      quote: res,
      source: conf.source
    }).then(function(response) {
      // Success
      var id = 'unknown';
      try {
        id = JSON.parse(response.body).id;
      } catch(e){}

      bot.sayTo(from, conf.baseUrl + "/#/quote/" + id);
    });
  });
};


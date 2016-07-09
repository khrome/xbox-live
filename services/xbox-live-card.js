var XBoxService = require('../service');
var clone = require('extend');
var parseXML = require('xml2js').parseString;

var requiresAuth = ['user', 'friends', 'acheivements', 'games'];
var disabled = {};
var disabledProxy = function(){
    throw new Error('API Not yet authenticated!');
}

var gameCache = {};

function MyAuthenticatedService(options){
    XBoxService.apply(this, arguments);
    this.url = 'http://gamercard.xbox.com/en-US/{gamertag}.card';
}

MyAuthenticatedService.prototype = clone(XBoxService.prototype);
MyAuthenticatedService.prototype.constructor = MyAuthenticatedService;


MyAuthenticatedService.prototype.profile = function(options, callback){
    this.fetch({
        gamertag : options.gamertag
    }, function(err, data){
        data.gamertag = options.gamertag;
        if(data) data.games.forEach(function(game){
            gameCache[game.id] = game;
        });
        callback(err, data);
    });
}

MyAuthenticatedService.prototype.games = function(options, callback){
    if(!(options.id || options.gameid)){
        return callback(undefined, Object.keys(gameCache).map(function(id){ return gameCache[id] }));   
    }
    var game = gameCache[options.id || options.gameid];
    callback(game?undefined:new Error('Game not found'), game);
}

MyAuthenticatedService.prototype.parseResponse = function(response, body, callback){
    parseXML(body, function (err, resp) {
        var result = {};
        var cls = resp.html.body[0].div[0]['$']['class'];
        if(cls.indexOf('Gold') !== -1) result.gold = true;
        if(cls.indexOf('Male') !== -1) result.male = true;
        if(cls.indexOf('Female') !== -1) result.female = true;
        result.gamerpic = resp.html.body[0].div[0].a[1].img[0]['$'].src;
        result.reputation = resp.html.body[0].div[0].div[0].div.reduce(function(a, b){
            if(typeof a === 'object') a = (a['$']['class'] == 'Star Full')?1.0:0.0;
            if(typeof b === 'object') b = (b['$']['class'] == 'Star Full')?1.0:0.0;
            return a+b;
        });
        resp.html.body[0].div[0].div.slice(2).forEach(function(div){
            result[div['$'].id.toLowerCase()] = div['_'];
        });
        try{
        result.games = resp.html.body[0].div[0].ol[0].li.map(function(li){
            var game = {};
            var url = li.a[0]['$'].href;
            game.id = url.substring(url.indexOf('titleId=')+8)
            game.id = game.id.substring(0, game.id.indexOf('&'));
            game.icon = li.a[0].img[0]['$'].src;
            li.a[0].span.forEach(function(span){
                var title = span['$']['class'].toLowerCase();
                game[title] = 
                    (title == 'percentagecomplete' || parseInt(span['_']).toString() == span['_'])?
                    parseInt(span['_']):
                    span['_'];
            });
            return game;
            
        });
        }catch(ex){
            console.log(ex.stack);
        }
        result.gamerscore = parseInt(resp.html.body[0].div[0].div[1].div[0]['_']);
        callback(undefined, result);
    });
}

MyAuthenticatedService.prototype.friends = function(options, callback){
    throw new Error('Gamertag endpoint does not support requesting the friends');
}

MyAuthenticatedService.prototype.acheivements = function(options, callback){
    throw new Error('Gamertag endpoint does not support requesting the acheivements');
}
module.exports = MyAuthenticatedService;
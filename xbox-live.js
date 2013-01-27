var ext = require('prime-ext');
var prime = ext(require('prime'));
var typ = require('prime/util/type');
var array = ext(require('prime/es5/array'));
var fn = require('prime/es5/function');
var request = require('request');

var XBoxLive = prime({
    source : 'xboxleaders',
    sources : {
        xboxleaders : {
            profileURL : "http://www.xboxleaders.com/api/profile.json?region=en-US&gamertag=",
            gamesURL : "http://www.xboxleaders.com/api/games.json?region=en-US&gamertag=",
            achievementsURL : "http://www.xboxleaders.com/api/achievements.json?region=en-US&gamertag=",
            friendsURL : "http://www.xboxleaders.com/api/friends.json?region=en-US&gamertag=",
            postProcess : function(payload){
                return payload.Data;
            },
            addGameID : function(path, id){
                return path + '&titleid=' + id;
            }
        },
        xboxapi : {
            profileURL : "https://xboxapi.com/profile/",
            gamesURL : "https://xboxapi.com/games/",
            acheivementsURL : "https://xboxapi.com/achievements/",
            friendsURL : "https://xboxapi.com/friends/",
            postProcess : function(payload){
                return payload.Player;
            },
            addGameID : function(path, id){
                return path + '/' +id;
            }
        }
        //RIP http://xboxapi.duncanmackenzie.net/
    },
    fetch : function(type, gamertag, game, callback){
        if((!callback) && typ(game) == 'function'){
            callback = game;
            game = undefined;
        }
        //todo: check game type
        if(!array.contains(['profile', 'games', 'achievements', 'friends'], type)) throw('Unknown type');
        var uri = this.sources[this.source][type+'URL']+gamertag
        if(game && this.sources[this.source].addGameID) uri = this.sources[this.source].addGameID(uri, game);
        request({ 
            method: 'GET', 
            uri: uri
        }, fn.bind(function (error, response, body) {
            var result = JSON.parse(body);
            if(this.sources[this.source].postProcess) result = this.sources[this.source].postProcess(result);
            callback(error, result);
        }, this));
    }
});
module.exports = XBoxLive;
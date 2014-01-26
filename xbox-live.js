var array = require('async-arrays');
var request = require('request');

function XBoxLive(){
    this.source = 'xboxleaders';
    this.sources = {
        xboxleaders : {
            profileURL : "http://www.xboxleaders.com/api/profile.json?region=en-US&gamertag=",
            gamesURL : "http://www.xboxleaders.com/api/games.json?region=en-US&gamertag=",
            achievementsURL : "http://www.xboxleaders.com/api/achievements.json?region=en-US&gamertag=",
            friendsURL : "http://www.xboxleaders.com/api/friends.json?region=en-US&gamertag=",
            postProcess : function(payload){
                return payload.data;
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
    };
}

XBoxLive.prototype.fetch = function(type, gamertag, game, callback){
    if((!callback) && typeof game == 'function'){
        callback = game;
        game = undefined;
    }
    //todo: check game type
    if(!array.contains(['profile', 'games', 'achievements', 'friends'], type)) throw('Unknown type');
    var uri = this.sources[this.source][type+'URL']+gamertag
    if(game && this.sources[this.source].addGameID) uri = this.sources[this.source].addGameID(uri, game);
    var ob = this;
    request({ 
        method: 'GET', 
        uri: uri
    }, function (error, response, body) {
        var result = JSON.parse(body);
        if(ob.sources[ob.source].postProcess) result = ob.sources[ob.source].postProcess(result);
        if(result.code && result.message) callback(result);
        else callback(error, result);
    });
};
module.exports = XBoxLive;
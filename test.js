var should = require("should");
var request = require("request");
var XBoxLive = require('./xbox-live');
var gamertag = "khr0me"; // me, since they killed Major+Nelson's game history
var game = '4b5907dc'; //1264125916; //'Tropico 4'

describe('XBoxLive', function(){
    var api;
    
    describe('.GamerCard', function(){
        before(function(){
            api = new XBoxLive.Service.GamerCard();
        });
        
        
        it('fetches profile', function(done){
            this.timeout(10000);
            api.profile({
                gamertag : gamertag
            }, function(err, data){
                should.not.exist(err);
                should.exist(data);
                should.exist(data.gamertag);
                should.exist(data.gamerscore);
                game = data.games[0].id;
                done();
            });
        });
        
        it('fetches games', function(done){
            this.timeout(10000);
            api.games({
                id : game
            }, function(err, data){
                should.not.exist(err);
                should.exist(data);
                should.exist(data.title);
                should.exist(data.icon);
                done();
            });
        });
    
    });
});
var should = require("should");
var request = require("request");
var XBoxLive = require('./xbox-live');
var gamertag = "khr0me"; // me, since they killed Major+Nelson's game history
var game = '4b5907dc';//1264125916; //'Tropico 4'

describe('XBoxLive', function(){
    var api;
    
    before(function(){
        api = new XBoxLive();
    })
    
    it('fetches profile', function(done){
        this.timeout(10000);
        api.fetch('profile', gamertag, function(err, data){
            should.not.exist(err);
            should.exist(data);
            should.exist(data.gamertag);
            should.exist(data.gamerscore);
            done();
        });
    });
    
    it('fetches games', function(done){
        this.timeout(10000);
        api.fetch('games', gamertag, function(err, data){
            should.not.exist(err);
            should.exist(data);
            console.log(JSON.stringify(data));
            data.totalgames.should.be.above(0);
            data.games.length.should.be.above(0);
            //console.log(JSON.stringify(data));
            done();
        });
    });
    
    it('fetches achievements for a game', function(done){
        this.timeout(10000);
        api.fetch('achievements', gamertag, game, function(err, data){
            should.not.exist(err);
            should.exist(data);
            data.title.should.equal('Tropico 4');
            data.earnedgamerscore.should.be.above(0);
            data.achievements.length.should.be.above(0);
            done();
        });
    });
    
    it('fetches friends', function(done){
        this.timeout(10000);
        api.fetch('friends', gamertag, function(err, data){
            should.not.exist(err);
            should.exist(data);
            data.total.should.be.above(0);
            data.friends.length.should.be.above(0);
            done();
        });
    });
});
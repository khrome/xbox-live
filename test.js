var should = require("should");
var request = require("request");
var type = require('prime/util/type');
var XBoxLive = require('./xbox-live');
var gamertag = "Major+Nelson";
var game = 1096157139; //'Gun'

describe('XBoxLive', function(){
    var api;
    
    before(function(){
        api = new XBoxLive();
    })
    
    it('fetches profile', function(done){
        this.timeout(5000);
        api.fetch('profile', gamertag, function(err, data){
            should.not.exist(err);
            should.exist(data.Gamertag);
            should.exist(data.GamerScore);
            data.IsValid.should.equal(1);
            done();
        });
    });
    
    it('fetches games', function(done){
        this.timeout(10000);
        api.fetch('games', gamertag, function(err, data){
            should.not.exist(err);
            data.GameCount.should.be.above(0);
            data.PlayedGames.length.should.be.above(0);
            console.log(data);
            done();
        });
    });
    
    it('fetches achievements for a game', function(done){
        this.timeout(10000);
        api.fetch('achievements', gamertag, game, function(err, data){
            should.not.exist(err);
            data.Title.should.equal('Gun');
            data.EarnedGamerScore.should.be.above(0);
            data.Achievements.length.should.be.above(0);
            done();
        });
    });
    
    it('fetches friends', function(done){
        this.timeout(10000);
        api.fetch('friends', gamertag, function(err, data){
            should.not.exist(err);
            data.TotalFriends.should.be.above(0);
            data.Friends.length.should.be.above(0);
            done();
        });
    });
});
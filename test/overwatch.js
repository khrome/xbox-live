var should = require("should");
var request = require("request");
var XBoxLive = require('../xbox-live');
var gamertag = "khr0me"; // me, since they killed Major+Nelson's game history
var game = '4b5907dc'; //1264125916; //'Tropico 4'
var destiny = {
    membership: '4611686018432995827',
    bungieId: '13983710',
    character: '2305843009366036466',
    platform: 'xbox'
}

var shortcircuit;

describe('XBoxLive', function(){
    var api;
    
    describe('.Games.Overwatch', function(){
        before(function(){
            api = new XBoxLive.Games.Overwatch();
        });
        
        it('searchUsers', function(done){
            this.timeout(5000);
            api.query(gamertag, function(err, results){
                should.exist(results['all-heroes'].combat);
                should.exist(results['all-heroes'].assists);
                should.exist(results['all-heroes'].best);
                should.exist(results['all-heroes'].average);
                should.exist(results['all-heroes'].deaths);
                should.exist(results['all-heroes']['match-awards']);
                should.exist(results['all-heroes'].game);
                should.exist(results['all-heroes'].miscellaneous);
                done();
            });
        });    
    });
    
});
var should = require("should");
var request = require("request");
var XBoxLive = require('./xbox-live');
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
    
    describe('.Service.GamerCard', function(){
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
    
    describe('.Games.Destiny', function(){
        before(function(){
            api = new XBoxLive.Games.Destiny(process.env.DESTINY_API_KEY);
            if(!process.env.DESTINY_API_KEY){
                console.log('There is no API key')
                this.skip();
            }
        });
        
        it('searchUsers', function(done){
            api.user.searchUsers({
                get:{ q : gamertag }
            }, function(err, results){
                results.length.should.equal(1);
                results[0].membershipId.should.equal(destiny.bungieId);
                results[0].displayName.should.equal(gamertag);
                setTimeout(function(){ done(); }, 1000);
            });
        });
        
        it('accountSummary', function(done){
            api.user.accountSummary({
                membershipType : destiny.platform,
                membershipId: destiny.bungieId
            }, function(err, results){
                //this seems to have issues
                setTimeout(function(){ done(); }, 1000);
            });
        });
        
        it('memberItems', function(done){
            api.destiny.memberItems({
                destinyMembershipId: destiny.membership,
                membershipType : destiny.platform
            }, function(err, results){
                results.data.items.length.should.be.above(1);
                should.exist(results.data.characters[0].levelProgression);
                setTimeout(function(){ done(); }, 1000);
            });
        });
        
        it('advisors', function(done){
            api.destiny.advisors({
                destinyMembershipId: destiny.membership,
                membershipType : destiny.platform
            }, function(err, results){
                should.not.exist(err);
                should.exist(results.data.recordBooks);
                setTimeout(function(){ done(); }, 1000);
            });
        });
        
        it('character', function(done){
            api.destiny.character({
                destinyMembershipId: destiny.membership,
                membershipType : destiny.platform,
                characterId: destiny.character
            }, function(err, results){
                should.not.exist(err);
                should.exist(results.data.characterBase);
                should.exist(results.data.levelProgression);
                setTimeout(function(){ done(); }, 1000);
            });
        });
        
        it('inventory', function(done){
            api.destiny.character.inventory({
                destinyMembershipId: destiny.membership,
                membershipType : destiny.platform,
                characterId: destiny.character
            }, function(err, results){
                should.not.exist(err);
                should.exist(results.data.items)
                should.exist(results.data.currencies)
                setTimeout(function(){ done(); }, 1000);
            });
        });
        
        it('inventory - deprecated', function(done){
            api.destiny.character.inventory({
                destinyMembershipId: destiny.membership,
                membershipType : destiny.platform,
                characterId: destiny.character,
                deprecated: true
            }, function(err, results){
                should.not.exist(err);
                should.exist(results.data.currencies)
                should.exist(results.data.buckets)
                setTimeout(function(){ done(); }, 1000);
            });
        });
        
        it('activities', function(done){
            api.destiny.character.activities({
                destinyMembershipId: destiny.membership,
                membershipType : destiny.platform,
                characterId: destiny.character
            }, function(err, results){
                should.not.exist(err);
                should.exist(results.data.available);
                results.data.available.length.should.be.above(0)
                setTimeout(function(){ done(); }, 1000);
            });
        });
        
        it('progression', function(done){
            api.destiny.character.progression({
                destinyMembershipId: destiny.membership,
                membershipType : destiny.platform,
                characterId: destiny.character
            }, function(err, results){
                should.not.exist(err);
                should.exist(results.data.progressions);
                results.data.progressions.length.should.be.above(0)
                setTimeout(function(){ done(); }, 1000);
            });
        });
    
    });
    
});
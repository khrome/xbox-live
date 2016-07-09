var XBoxService = require('../service');
var clone = require('extend');

var requiresAuth = ['user', 'friends', 'acheivements', 'games'];
var disabled = {};
var disabledProxy = function(){
    throw new Error('API Not yet authenticated!');
}

function MyAuthenticatedService(options){
    XBoxService.apply(this, arguments);
    var ob = this;
    requiresAuth.forEach(function(memberName){
        disabled[memberName] = ob[memberName];
        ob[memberName] = disabledProxy;
    });
    this.url = 'http://my-service.domain/{action}/{gamertag}'
    this.finishAuthentication = function(){
        requiresAuth.forEach(function(memberName){
            ob[memberName] = disabled[memberName];
            delete disabled[memberName];
        });
        delete ob.finishAuthentication;
    };
}

MyAuthenticatedService.prototype = clone(XBoxService.prototype);
MyAuthenticatedService.prototype.constructor = MyAuthenticatedService;

MyAuthenticatedService.prototype.user = function(options, callback){
    this.fetch({
        action : 'profile',
        gamertag : options.gamertag
    }, callback);
}

MyAuthenticatedService.prototype.friends = function(options, callback){
    this.fetch({
        action : 'friends',
        gamertag : options.gamertag
    }, callback);
}

MyAuthenticatedService.prototype.acheivements = function(options, callback){
    this.fetch({
        action : 'acheivements',
        gamertag : options.gamertag
    }, callback);
}

MyAuthenticatedService.prototype.games = function(options, callback){
    this.fetch({
        action : 'games',
        gamertag : options.gamertag,
        ids : options.ids
    }, callback);
}
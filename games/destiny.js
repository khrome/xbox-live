var request = require('request');
var fs = require('fs');

var render = function(str, data){
    var result = str;
    Object.keys(data).forEach(function(key){
        var index;
        while((index = result.indexOf('{'+key+'}')) !== -1){
            result = result.substring(0, index) + data[key]+ result.substring(index + (key.length+2));
        }
    });
    return result;
}

var merge = function(original, data){
    var result = JSON.parse(JSON.stringify(original));
    Object.keys(data).forEach(function(key){
        result[key] = data[key];
    });
    return result;
}

var Destiny = function(options){
    if(typeof options == 'string'){
            this.key = options;
            this.options = {};
    }else this.options = options ||{};
    
    this.nameCache = {};
    if(!Destiny.enums){
        Destiny.enums = JSON.parse(fs.readFileSync(__dirname+'/destiny/wiki-builder/data/enums.json'));
        Destiny.invertdEnums = Object.keys(Destiny.enums).map(function(name){
            var result = {};
            Object.keys(Destiny.enums[name]).forEach(function(key){
                result[Destiny.enums[name][key]] = key;
            })
            return result;
        });
    }
    var data = JSON.parse(fs.readFileSync(__dirname+'/destiny/wiki-builder/data/api-data.json'));
    var ob = this;
    Object.keys(data).forEach(function(key){
        var group = key.substring(0, key.length-7).toLowerCase();
        var endpoints = data[key];
        var pub = endpoints.filter(function(ep){
            return (ep.access === '' || (ep.access && ep.access.toLowerCase() !== 'private') )
        });
        pub.forEach(function(endpoint){
            if(!ob[group]) ob[group] = {};
            var method = endpoint.method;
            var url = endpoint.endpoint;
            var name = endpoint.name.replace(/^get/i, '');
            name = name.substring(0,1).toLowerCase()+name.substring(1);
            var accessor = function(options, cb){
                var opts = merge(ob.options, options);
                return ob.query(url, merge(opts, {method: method}), cb);
            }
            ob[group][name] = accessor;
        });
    });
    ob.user.accountSummary = function(options, cb){
        return ob.query('/Destiny/{membershipType}/Account/{destinyMembershipId}/Summary/', merge(ob.options, options), cb);
    }
    ob.user.bungieAccount = function(options, cb){
        return ob.query('/User/GetBungieAccount/{membershipId}/{membershipType}/', merge(ob.options, options), cb);
    }
    ob.destiny.memberItems = function(options, cb){
        return ob.query('/Destiny/{membershipType}/Account/{destinyMembershipId}/Items/', merge(ob.options, options), cb);
    }
    ob.destiny.advisors = function(options, cb){
        return ob.query('/Destiny/{membershipType}/Account/{destinyMembershipId}/Advisors/', merge(ob.options, options), cb);
    }
    ob.destiny.character = function(options, cb){
        return ob.query('/Destiny/{membershipType}/Account/{destinyMembershipId}/Character/{characterId}/', merge(ob.options, options), cb);
    }
    ob.destiny.character.inventory = function(options, cb){
        var url = '/Destiny/{membershipType}/Account/{destinyMembershipId}/Character/{characterId}/Inventory/Summary/';
        if(options.deprecated) url = '/Destiny/{membershipType}/Account/{destinyMembershipId}/Character/{characterId}/Inventory/';
        return ob.query(url, merge(ob.options, options), cb);
    }
    ob.destiny.character.activities = function(options, cb){
        return ob.query('/Destiny/{membershipType}/Account/{destinyMembershipId}/Character/{characterId}/Activities/', merge(ob.options, options), cb);
    }
    ob.destiny.character.progression = function(options, cb){
        return ob.query('/Destiny/{membershipType}/Account/{destinyMembershipId}/Character/{characterId}/Progression/', merge(ob.options, options), cb);
    }
    ob.stats = function(options, cb){
        if(!options.characterId){
            return ob.query('/Stats/Account/{membershipType}/{destinyMembershipId}/', merge(ob.options, options), cb);
        }else{
            return ob.query('/Stats/{membershipType}/{destinyMembershipId}/{characterId}/', merge(ob.options, options), cb);
        }
    }
};

Destiny.prototype.query = function(urt, o, callback){
    var options = o;
    var ob = this;
    if(options['membershipType'] && options['membershipType'].toLowerCase && (
        options['membershipType'].toLowerCase() == 'xbox' ||
        options['membershipType'].toLowerCase() == 'xbox-live'
    )) options['membershipType'] = 'TigerXbox';
    if(options['membershipType'] && options['membershipType'].toLowerCase && (
        options['membershipType'].toLowerCase() == 'psn' ||
        options['membershipType'].toLowerCase() == 'playstation'
    )) options['membershipType'] = 'TigerPsn';
    if(options['membershipType'] && Destiny.enums['BungieMembershipType'][options['membershipType']]){
        options['membershipType'] = Destiny.enums['BungieMembershipType'][options['membershipType']];
    }
    var url = 'https://www.bungie.net/Platform'+render(urt, options);
    if(url.indexOf("{membershipId}") !== -1 && options.username){
        ob.user.searchUsers({
            get:{ q : options.username }
        }, function(err, results){
            if(err) return callback(err);
            if(results[0]) options.membershipId = results[0].membershipId;
            ob.query(urt, options, callback);
        });
        return;
    }
    if(url.indexOf("{destinyMembershipId}") !== -1 && options.username){
        ob.user.searchUsers({
            get:{ q : options.username }
        }, function(err, results){
            if(err) return callback(err);
            if(results[0]) options.destinyMembershipId = results[0].membershipId;
            ob.query(urt, options, callback);
        });
        return;
    }
    if(options.get) url = url+'?'+Object.keys(options.get).map(function(key){ return key+'='+options.get[key]}).join('&')
    var opts = {
        url: url,
        headers: {
            "X-API-Key" : ob.key
        },
        json:true
    };
    request(opts, function(err, req, data){
        if(err){
            var error = new Error('API TransferError');
            error.detail = err;
            if(callback) callback(error);
        }
        if(data["ErrorStatus"] == "Success"){
            if(callback) callback(undefined, data['Response']);
        }else{
            var error = new Error('API Error');
            error.detail = data;
            if(callback) callback(error);
        }
    });
}

module.exports = Destiny;
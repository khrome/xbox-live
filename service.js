var merge = require('extend');
var Emitter = require('extended-emitter');
var request = require('request');

//RIP xboxapi.duncanmackenzie.net, xboxleaders.com

// http://gamercard.xbox.com/en-US/<gamertag>.card

function XBoxLiveService(options){
	(new Emitter()).onto(this);
}

XBoxLiveService.prototype.parseResponse = function(response, body, callback){
	setTimeout(function(){
		callback(JSON.parse(body));
	}, 1);
}

XBoxLiveService.prototype.normalizeFieldNames = function(data){
	return data;
}

XBoxLiveService.prototype.fetch = function(options, callback){
	var unifiedOptions = merge(this.options, options);
	var ob = this;
	// todo: normalizeFieldNames
	request({
    	method: options.method || 'GET', 
    	uri: ob.transformURL(this.url, options)
    }, function (error, response, body) {
        try{
            var result = ob.parseResponse(response, body, function(err, res){
	            callback(err, res);
            });
        }catch(err){
            callback(err);
        }
    });
}

//make all options available to the url
XBoxLiveService.prototype.transformURL = function(url, opts){
	var options = this.options || opts;
	Object.keys(options).forEach(function(optionName){
		if(url.indexOf('{'+optionName+'}' != -1)){
			url = url.replace('{'+optionName+'}', options[optionName]);
		}
	});
	return url;
}

module.exports = XBoxLiveService;
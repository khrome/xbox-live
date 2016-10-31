var request = require('request');
var fs = require('fs');
var arrays = require('async-arrays');
var parseString = require('xml2js').parseString;

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
    Object.keys(data).forEach(function(key){ result[key] = data[key] });
    return result;
}

var Overwatch = function(options){
    if(typeof options == 'string'){
            this.key = options;
            this.options = {};
    }else this.options = options ||{};
    
};

var removeDiacritics = function(str) {
    var diacritics = [
        [/[\300-\306]/g, 'A'],
        [/[\340-\346]/g, 'a'],
        [/[\310-\313]/g, 'E'],
        [/[\350-\353]/g, 'e'],
        [/[\314-\317]/g, 'I'],
        [/[\354-\357]/g, 'i'],
        [/[\322-\330]/g, 'O'],
        [/[\362-\370]/g, 'o'],
        [/[\331-\334]/g, 'U'],
        [/[\371-\374]/g, 'u'],
        [/[\321]/g, 'N'],
        [/[\361]/g, 'n'],
        [/[\307]/g, 'C'],
        [/[\347]/g, 'c'],
    ];
    var s = str;
    for (var i = 0; i < diacritics.length; i++) {
        s = s.replace(diacritics[i][0], diacritics[i][1]);
    }
    return s;
}

function parseContext(text, callback){
    var sections = text.split('<table ');
    sections.shift();
    sections = sections.map(function(section){
        return '<table '+section.split('</table>')[0]+'</table>';
    });
    var data = {};
    arrays.forEachEmission(sections, function(section, index, done){
        if(section.trim() === '') return done();
        parseString(section, function (err, result) {
            try{
                if(err) throw err;
            var group = result.table.thead[0].tr[0].th[0].span[0]['_'].replace(/ /g, '-').toLowerCase();
            var agg = {};
            result.table.tbody[0].tr.forEach(function(tag){
                var name = tag.td[0].replace(/ /g, '-').replace(/---/g, '-').toLowerCase();
                var val = tag.td[1].replace(/,/g, '');
                agg[name] = val;
            });
            data[group.replace(/ /g, '-').toLowerCase()] = agg;
            }catch(ex){
                console.log(ex);
            }
            done();
        });
    }, function(){
        if(callback) callback(undefined, data);
    });
}

Overwatch.prototype.query = function(user, callback){
    request({
        url: 'https://playoverwatch.com/en-us/career/xbl/'+user
    }, function(err, req, data){
        var page = data.toString();
        var i = page.substring(page.indexOf('<select data-group-id="stats" class="js-career-select">'));
        i= i.substring(0, i.indexOf('</select>')+9);
        parseString(i, function (err, opts) {
            var opt = opts.select.option.map(function(o){
                var res = {};
                res.id = o['$']['value'];
                res.name = removeDiacritics(o['$']['option-id'].toLowerCase().replace(/[:$.]+/g, '').replace(/ /g, '-'));
                res.label = o['$']['option-id'];
                return res;
            })
            var matches = page.match(/<div id="quick-play">(.*?)<\/div><div id="competitive-play"/);
            var qp = matches[1];
            var mainSection = qp.split('<div data-group-id="stats"');
            mainSection.shift();
            var resultData = {};
            arrays.forEachEmission(mainSection, function(section, index, done){
                var id = section.match(/data-category-id="(.*?)"/)[1];
                parseContext(section, function(err, data){
                    var op = opt.filter(function(item){
                        return item.id === id
                    });
                    resultData[op[0].name] = data;
                    done();
                });
            }, function(){
                if(callback) callback(undefined, resultData);
            });
        });
    })
}

module.exports = Overwatch;
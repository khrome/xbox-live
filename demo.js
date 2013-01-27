var XBoxLive = require('./xbox-live');
var api = new XBoxLive();
api.fetch('games', 'Major+Nelson', function(data){
    console.log('return', data);
})
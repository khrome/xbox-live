xbox-live.js
==============
An NPM for fetching xbox live player data

Usage
-----
First include the module:

    var XBoxLive = require('xbox-live');

then, instantiate the object:

    var api = new XBoxLive();
    
now you can fetch a profile:

    api.fetch('profile', 'Major+Nelson', function(err, data){
        //do stuff
    });

or games:

    api.fetch('games', 'Major+Nelson', function(err, data){
        //do stuff
    });
    
or friends:

    api.fetch('friends', 'Major+Nelson', function(err, data){
        //do stuff
    });
    
or achievements (for a particular xbl game id):

    api.fetch('achievements', 'Major+Nelson', 1096157139, function(err, data){
        //do stuff
    });
    
In an attempt to be less prone to breakage there are two sources: the default, xboxleaders.com and xboxapi.com, which seems to enforce stricter limits. If more pop up, I will likely add them, too. xboxleaders has been updated to their new format, but be warned: their service has become extremely flakey and when it fails, it claims the user/game/whatever doesn't exist on XBL :P but it's up-to-date with less dependencies.
    

Testing
-------

Run the tests at the project root with:

    mocha
    
(run these before submitting a pull request)

Enjoy,

-Abbey Hawk Sparrow
xbox-live.js
==============
An NPM for fetching xbox live player data.

This supports requesting status directly from Microsoft's GamerCard endpoints(which will never fail as long as xbox-live is up) as well as supporting plugins to external services. In addition you can also fetch game data from [Destiny](docs/destiny.md), [Overwatch](docs/overwatch.md), with more on the way.

If you would like to implement a plugin for your own player stats tracker, check out the [developer docs](docs/developers.md).


Usage
-----
First include the module and instantiate the object:

    var XBoxLive = require('xbox-live');
    var api = new XBoxLive.Source.GamerCard();
    
Then you need to call:

	api.profile({
		gamertag : '<gamertag>'
	}, function(err, user){
		//do something
	});

It also indexes any games it's seen allowing it to subsequently return them:

	api.games({
		id : '<gameid>'
	}, function(err, game){
		//do something
	});
    
Because GamerCard is currently the only source, there are no other working calls(`.friends()`, `.achievements()`, etc.) yet.

Games
-------

Some games have official APIs of their own, and we provide wrappers for these.

###[Destiny](docs/destiny.md)

Destiny Provides a full range of queries across the entire game engine. Currently there is only full coverage around the user, player and inventory calls.

###[Overwatch](docs/overwatch.md)

Destiny provides combat summaries on a per-character basis (as well as including global totals)
    

Testing
-------

Run the tests at the project root with:

    mocha
    
Run a specific suite (one of `gamer-card`, `overwatch` or `destiny`) with:

    mocha	test/<suite>
    
If you want to run the destiny tests, you must set `DESTINY_API_KEY` in your environment.

Enjoy,

-Abbey Hawk Sparrow
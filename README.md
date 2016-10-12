xbox-live.js
==============
An NPM for fetching xbox live player data.

This library is currently transistioning from bundling adapters for many sources to a single interface, to a set of tools for primary scraping of XBoxLive GamerCard and account data (which is what all existing APIs  are doing). The reason I'm doing this is threefold:
	
- The number of upstream changes to these APIs is neverending, usually resulting in nothing more than attempting to match the APIs servers against MS host configurations and request limits, with little to no tangible benfits to users.
- Users of these kind of services are often small clans or semi-closed social groups which do not need the overhead or complexity of a monloithic API and could really work rather well off a proxied scrape of the GamerCard endpoint
- I've written a ton of scrapers, caches and proxies.

So in the new order, you just use my interface to write some code interfacing with your API, fork this project add the new service to the `./services` directory and submit a pull request (with tests) and I'll enable it in the project. In this way, each maintatiner is only capable of breaking their own integration. Check out the [sample](https://github.com/khrome/xbox-live/blob/master/services/simple-authenticated-service.js).

I may run an open API on top of this, but that is TBD.


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
    
Because GamerCard is currently the only supported interface, there are no other working sources.

Sources
-------

The initial version used the venerable `xboxapi.duncanmackenzie.net`, and subsequent vesions supported variants of `xboxleaders.com` and `xboxapi.com`. Today I support an interface through which you can implement your own service wrapper.

Games
-------

Some games have official APIs of their own, we provide wrappers for these.

###Destiny

Just grab an instance of the API

	var api = new XBoxLive.Games.Destiny(<api key>);
	
- `api.user.searchUsers({get:{q:<query string>}}, callback)` search for a string among users, returns a list of users

These calls require options `{membershipType:<type>, membershipId: <id>}` but you may substitute `username` for `membershipId` anywhere you find it in the api. legal types are: `xbox`, `psn`

- `api.destiny.accountSummary(options, callback)` return the account data for a membership
- `api.destiny.memberItems(options, callback)` return all items for a specific membership
- `api.destiny.advisors(options, callback)` fetch advisors for a membership

These calls require options `{membershipType:<type>, membershipId: <id>, characterId: <cid>}`

- `api.destiny.character(options, callback)` the metadata for a specific character
- `api.destiny.character.inventory(options, callback)` get a given character's inventory
- `api.destiny.character.activities(options, callback)` get a given character's activities
- `api.destiny.character.progression(options, callback)` get a given character's progression

There are other calls available (auto-generated from [docs](https://github.com/khrome/BungieNetPlatform/blob/master/wiki-builder/data/api-data.json) which seem to be out of date) and I will manually craft other endpoints as I figure out the [rat's nest of an API](https://www.bungie.net/en/Clan/Post/39966/85087279/0/0/1).



Formats
-------
TBD (a set of returns and fields (per endpoint) to serve as a canonical standard).

Server (soon™)
--------------

	new XBoxLive.Server({
		accountPool: [{ //if not included, session keys must be passed on request
			key: '<session key>'
		}, {
			username: '<username>',
			password: '<password>'
		}],
		port: 8080,
		memcache : { <connection credentials>},
		mongo : { <connection credentials>},
		mysql : { <connection credentials>},
		amqp : { <connection credentials>},
	});
    

Testing
-------

Run the tests at the project root with:

    mocha
    
If you want to run the destiny tests, you must set `DESTINY_API_KEY` in your environment
    
(run all tests before submitting a pull request)

Enjoy,

-Abbey Hawk Sparrow
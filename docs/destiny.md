###Destiny

Just grab an instance of the API

	var api = new XBoxLive.Games.Destiny(<api key>);
	
- `api.user.search(<username>, callback)` search for a string among users, returns a list of users

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
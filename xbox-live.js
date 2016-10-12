var XBoxLive = {};
XBoxLive.Games = {};
XBoxLive.Service = require('./service');

XBoxLive.Service.GamerCard = require('./services/xbox-live-card');
XBoxLive.Games.Destiny = require('./games/destiny')

module.exports = XBoxLive;
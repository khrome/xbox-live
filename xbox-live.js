var XBoxLive = {};
XBoxLive.Games = {};
XBoxLive.Service = require('./service');

XBoxLive.Service.GamerCard = require('./services/xbox-live-card');

function lazyLoad(object, fieldName, moduleName){ //load on first reference
    var module;
    Object.defineProperty(object, fieldName, {
      get: function() {
          return module || (module = require(moduleName));
      },
      enumerable: true,
      configurable: true
    });
}

lazyLoad(XBoxLive.Games, 'Destiny', './games/destiny');
lazyLoad(XBoxLive.Games, 'Overwatch', './games/overwatch');

module.exports = XBoxLive;
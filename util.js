global.debugLevel = 0;

global.dbg = function dbg(s) {
    if(debugLevel > 0) {
        console.debug(s);
    }
}
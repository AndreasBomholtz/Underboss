var contrib = require('blessed-contrib');


exports.show = function(screen) {
    global.current_page = 'debug';

    var bot = global.bot;
    var grid = new contrib.grid({rows: 12, cols: 12, screen: screen});

    global.debug_log = grid.set(0, 0, 8, 8, contrib.log,
                          { fg: "green", selectedFg: "green", label: 'Debug Log'})
    screen.render();

    for(var i=0; i<global.debug_buf.length; i++) {
        global.debug_log.log(global.debug_buf[i]);
    }
    screen.render();

    screen.key(['C-r'], function(ch, key) {
        console.info("Enable Reseach Debug");
        global.bot.enableDebugResearch = true;
    });
};

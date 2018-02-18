var contrib = require('blessed-contrib');

var init = true;

var queue_cmd  = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
var queue_data = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
var queue_slow = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];

var screen;
var grid;
var player;
var sparkline;
var table;

function createDashboard() {
    grid = new contrib.grid({rows: 12, cols: 12, screen: screen});

    global.log = grid.set(0, 8, 8, 4, contrib.log,
                          { fg: "green", selectedFg: "green", label: 'Info Log'})


    player = grid.set(0, 0, 1, 4, contrib.markdown,
                      { fg: "green"
                        , selectedFg: "green"
                        , label: 'Player'})

    sparkline = grid.set(8, 8, 4, 4, contrib.sparkline,
                         { label: 'Queues'
                           , tags: true
                           , style: { fg: 'blue' }});


    table =  grid.set(1, 0, 8, 8, contrib.table,
                      { keys: true
                        , fg: 'green'
                        , label: 'City Overview'
                        , columnSpacing: 1
                        , columnWidth: [24, 12, 12, 12, 12, 20]});
    screen.render();
}

function refreshSpark() {
    queue_cmd.shift();
    queue_cmd.push(global.bot.queue.length + 1);
    queue_data.shift();
    queue_data.push(global.bot.data_queue.length + 1);
    queue_slow.shift();
    queue_slow.push(global.bot.slow_queue.length + 1);

    if(global.current_page == 'dashboard') {
        sparkline.setData(['CMD', 'DATA','SLOW'], [queue_cmd, queue_data, queue_slow]);
        screen.render();
    }
}

function updateOverview() {
    if(global.current_page == 'dashboard') {
        var data = [];
        if(global.bot.cities) {
            for(var i=0; i<global.bot.cities.length; i++) {
                var city = global.bot.cities[i];
                var row = [];
                row.push(city.name);
                if(city.resources) {
                    row.push(city.resources['cash']);
                    row.push(city.resources['food']);
                    row.push(city.resources['steel']);
                    row.push(city.resources['cement']);
                } else {
                    for(var i=0; i<4; i++) {
                        row.push(0);
                    }
                }
                var queues = "0 jobs";
                if(city.jobs) {
                    queues = city.jobs.length + " jobs";
                    /*
                     for(var n=0; n<city.jobs.length; n++) {
                     if(city.jobs[n].city_building_id) {
                     queues += "Bu ";
                     } else if(city.jobs[n].queue) {
                     //queues += city.jobs[n].queue[0].toUpperCase() + " ";
                     queues += city.jobs[n].queue + " ";
                     }
                     }*/
                }
                row.push(queues);

                data.push(row);
            }
        }

        table.setData({headers: [' City', 'Cash', 'Food', 'Steel', 'Cement', 'Queues'], data: data});
    }
}

var log_buf = [];
console.info = function(args)
{
    if(log_buf.length > 50) {
        log_buf.shift();
    }
    log_buf.push(args);

    if(global.current_page == 'dashboard') {
        global.log.log(args);
        screen.render();
    }
}

function printLog() {
    for(var i=0; i<log_buf.length; i++) {
        global.log.log(log_buf[i]);
    }
    screen.render();
}

function printPlayer() {
    if(global.current_page == 'dashboard') {
        player.setMarkdown("Player level " + global.bot.player_level);
        screen.render();
    }
}

exports.show = function(n_screen) {
    screen = n_screen;
    global.current_page = 'dashboard';

    createDashboard();
    updateOverview();
    printPlayer();
    printLog();

    if(init) {
        init = false;

        screen.key(['t'], function(ch, key) {
            global.bot.toggleTrace();
        });

        screen.key(['p'], function(ch, key) {
            global.bot.togglePause();
        });

        screen.key(['b'], function(ch, key) {
            console.info("Do Build");
            global.bot.doBuild();
        });

        screen.key(['r'], function(ch, key) {
            console.info("Do Research");
            global.bot.doResearch();
        });

/*        screen.key(['t'], function(ch, key) {
            global.bot.doTrain();
        });
*/
        screen.key(['c'], function(ch, key) {
            global.bot.doCollect();
        });

        setInterval(refreshSpark, 1000);

        global.bot.listen("resources:update", updateOverview);
        global.bot.listen("jobs:update", updateOverview);
        global.bot.listen("player:level", printPlayer);
    }
};

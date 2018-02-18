var fs = require("fs");
var util = require('util');
const memwatch = require('memwatch-next');
var heapdump = require('heapdump');

memwatch.on('leak', (info) => {
    console.error('Memory leak detected:\n', info);
    heapdump.writeSnapshot((err, filename) => {
        if (err) console.error(err);
        else console.error('Wrote snapshot: ' + filename);
    })
    });

var dashboard = require("./dashboard");
var debug = require("./debug");

var combine = require('../util/combine.js');

var bot = require('../bot/bot.js');
var buildBot = require('../bot/build.js');
var cityscapeBot = require('../bot/cityscape.js');
var armorBot = require('../bot/armor.js');
var bailoutBot = require('../bot/bailout.js');
var itemBot = require('../bot/item.js');
var parserBot = require('../bot/parser.js');
var queueBot = require('../bot/queue.js');
var researchBot = require('../bot/research.js');
var utilBot = require('../bot/util.js');
var attackBot = require('../bot/attack.js');
var bondsBot = require('../bot/bonds.js');
var collectBot = require('../bot/collect.js');
var debugBot = require('../bot/debug.js');
var optionsBot = require('../bot/options.js');
var prizeBot = require('../bot/prize.js');
var reportBot = require('../bot/report.js');
var trainBot = require('../bot/train.js');

var attackUnits = require('../res/attack_units.js');
var buildings = require('../res/buildings.js');
var defenseUnits = require('../res/defense_units.js');
var items = require('../res/items.js');
var research = require('../res/research.js');

var C = require('./game_variables.js');

//Combine all the bots into one object
combine(bot, attackBot,
        bondsBot, buildBot,
        itemBot, cityscapeBot,
        reportBot, trainBot,
        bailoutBot, collectBot,
        prizeBot, researchBot,
        optionsBot, parserBot,
        queueBot, debugBot,
        utilBot, armorBot);

//Add all the variables
bot.attackUnits = attackUnits;
bot.defenseUnits = defenseUnits;
bot.buildings = buildings;
bot.research = research;
bot.items = items;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM(`<!DOCTYPE html>`);
const $ = require('jquery')(window);
XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

$.support.cors = true;
$.ajaxSettings.xhr = function() {
    return new XMLHttpRequest();
};


if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}


var blessed = require('blessed');
var contrib = require('blessed-contrib');
var screen = blessed.screen();



global.bot = bot;


var stream = fs.createWriteStream("debug.log", {flags:'a'});
global.debug_buf = [];
console.debug = function(args)
{
    var str = args;
    if(typeof(args) !== "string") {
        str = util.inspect(args);
    }

    stream.write(str + "\n");

    if(global.debug_buf.length > 50) {
        global.debug_buf.shift();
    }
    global.debug_buf.push(str);

    if(global.current_page === 'debug') {
        global.debug_log.log(str);
        screen.render();
    }
}

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

bot.updatePrizeInfo = console.info;

var carousel = new contrib.carousel( [dashboard.show, debug.show]
                                     , { screen: screen,
                                         interval: 0,
                                         controlKeys: true
                                       });
carousel.start();

bot.enableHTTP = true;

bot.init(C.attrs);

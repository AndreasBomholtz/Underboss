import test from 'ava';

var combine = require('../util/combine.js');
var buildBot = require('../bot/build.js');
var debugBot = require('../bot/debug.js');
var utilBot = require('../bot/util.js');

var bot = {};
var city;
var neighborhood;

test.before(t => {
    bot = combine(buildBot, debugBot, utilBot);

    neighborhood = {
        buildings: [{
            type: 'Hideout',
            level: 1,
            location: 'neighborhood',
            slot: 0
        },{
            type: 'Hideout',
            level: 2,
            location: 'neighborhood',
            slot: 1
        }]
    };
    city = {
        id: 'city_id',
        neighborhood: [neighborhood]
    };
    bot.cities = [city];

    bot.options = {};
});

test('Find building level', t => {
    var level = bot.findBuildingLevel('Hideout', city);

    t.is(level, 2, "Failed to find correct building level");
});

test('Count buildings', t => {
    var count = bot.countBuilding(neighborhood, 'Hideout');

    t.is(count, 2, "Wrong count returned");
});

test('Find building slot', t => {
    var slot = bot.findBuildingSlot(neighborhood, 4);

    t.is(slot, 2, "Wrong slot returned");
});

test('Calulate Building cost', t => {
    t.is(bot.calcBuldingCost(1, 400), 400);
    t.is(bot.calcBuldingCost(2, 400), 1600);
    t.is(bot.calcBuldingCost(3, 400), 3200);
});

test('Has resources', t => {

});

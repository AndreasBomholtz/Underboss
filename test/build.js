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
        resources: {
            cash: 3000,
            food: 300,
            steel: 300,
            cement: 1000
        },
        neighborhood: [neighborhood]
    };
    bot.cities = [city];

    bot.debugTrain = console.debug;
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


function build_cost(t, level, cost, expected) {
    const res = bot.calcBuldingCost(level, cost);
    t.true(res >= expected);
}
build_cost.title = (providedTitle, level, cost, expected) => `Level ${level} with cost ${cost} is less then ${expected}`.trim();

test(build_cost, 1, 400, 400);
test(build_cost, 2, 400, 1600);
test(build_cost, 3, 400, 3200);
test(build_cost, 8, 400, 64000);

test('Has resources', t => {

    var cost = {
        cash: 3000,
        food: 300,
        steel: 300,
        cement: 1000
    }
    t.true(bot.hasResources(city, "test", cost, 1));

    cost = {
        cash: 3000,
        food: 300,
        steel: 300,
        cement: 1001
    }
    t.false(bot.hasResources(city, "test", cost, 1));
});

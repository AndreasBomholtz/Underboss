import test from 'ava';

var combine = require('../util/combine.js');
var buildBot = require('../bot/build.js');
var researchBot = require('../bot/research.js');
var debugBot = require('../bot/debug.js');
var utilBot = require('../bot/util.js');
var research = require('../res/research.js');

var bot = {};
var city;
var neighborhood;

test.before(t => {
    bot = combine(buildBot, debugBot, utilBot, researchBot);
    bot.research = research;

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

function research_cost(t, level, cost, expected) {
    const res = bot.calcReseachCost(level, cost);
    t.true(res >= expected);
}
research_cost.title = (providedTitle, level, cost, expected) => `Level ${level} with cost ${cost} is less then ${expected}`.trim();

test(research_cost, 1, 250, 250);

test(research_cost, 11, 2150, 9842);
test(research_cost, 11, 200, 13122);

test(research_cost, 12, 100, 10498);
test(research_cost, 12, 150, 15746);
test(research_cost, 12, 200, 20995);

test(research_cost, 13, 100, 16796);
test(research_cost, 13, 150, 25194);
test(research_cost, 13, 200, 33592);

test(research_cost, 19, 200, 718250);
test(research_cost, 19, 400, 1436500);

test(research_cost, 21, 100, 610513);
test(research_cost, 21, 150, 915769);
test(research_cost, 21, 400, 2442050);
test(research_cost, 21, 200, 1221025);

test(research_cost, 22, 100, 610513);
test(research_cost, 22, 150, 915769);
test(research_cost, 22, 400, 2442050);
test(research_cost, 22, 200, 1221025);

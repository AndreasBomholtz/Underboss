import test from 'ava';

var combine = require('../util/combine.js');
var bailoutBot = require('../bot/bailout.js');
var debugBot = require('../bot/debug.js');
var utilBot = require('../bot/util.js');
var attackunits = require('../res/attack_units.js');

var bot = {};
var city;
var neighborhood;

test.before(t => {
    bot = combine(bailoutBot, debugBot, utilBot);
    bot.attackUnits = attackunits;

    city = {
        id: 'city_id',
        resources: {
            cash: 11173,
        },
    };
    bot.cities = [city];

    bot.debugBailout = console.debug;
    bot.options = {};
});

test('Check for missing bail', t => {
    var data = bot.getBailoutUnits(city);

    t.is(data[1], "", "Failed to bail the correct unit");
});

test('Pay bailout for a single unit', t => {
    city.bailout = {
        'Hitman': 1
    };
    var data = bot.getBailoutUnits(city);

    t.is(data[1], "&units[Hitman]=1", "Failed to bail the correct unit");
});

test('Pay bailout for half of the unit', t => {
    city.bailout = {
        'Hitman': 5
    };
    city.resources.cash = 24000;

    var data = bot.getBailoutUnits(city);

    t.is(data[1], "&units[Hitman]=2", "Failed to bail the correct unit");
});

test('Pay bailout for two unit', t => {
    city.bailout = {
        'Hitman': 1,
        'Enforcer': 1
    };
    city.resources.cash = 34000;

    var data = bot.getBailoutUnits(city);

    t.is(data[1], "&units[Hitman]=1&units[Enforcer]=1", "Failed to bail the correct unit");
});

test('Pay bailout for only first unit', t => {
    city.bailout = {
        'Hitman': 1,
        'Enforcer': 1
    };
    city.resources.cash = 24000;

    var data = bot.getBailoutUnits(city);

    t.is(data[1], "&units[Hitman]=1", "Failed to bail the correct unit");
});


test('Pay bailout for first and half of next units', t => {
    city.bailout = {
        'Hitman': 1,
        'Enforcer': 5
    };
    city.resources.cash = 34000;

    var data = bot.getBailoutUnits(city);

    t.is(data[1], "&units[Hitman]=1&units[Enforcer]=1", "Failed to bail the correct unit");
});

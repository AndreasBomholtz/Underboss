import test from 'ava';

var parser = require('../bot/parser.js');

test.before(t => {
    parser.trace = function() {};
});

test('parse-', t => {
    parser.parseData("test");

    t.pass();
});

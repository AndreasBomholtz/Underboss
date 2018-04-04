import test from 'ava';

var parser = require('../bot/parser.js');

test.before(t => {
    parser.trace = function() {};
});

test('parse-error', t => {
    t.throws(() => {
        parser.parseData("test")
    }
             , SyntaxError);
});

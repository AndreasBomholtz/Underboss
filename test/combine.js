import test from 'ava';

var combine = require('../util/combine.js');

test('combine', t => {
    var o1 = {"test1": "test1"};
    var o2 = {"test2": function() {
        return "test2";
    }};
    var o3 = {"test3": {"test3": "test3"}};

    var res = combine(o1, o2, o3);

    t.is(res.test1, "test1", "Failed to copy string");
    t.is(res.test2(), "test2", "Failed to copy function");
    t.is(res.test3.test3, "test3", "Failed to copy object");

    t.pass("Everything was combinded");
});

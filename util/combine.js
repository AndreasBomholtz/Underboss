function combine(obj) {
	var length = arguments.length;
	for (var index = 1; index < length; index++) {
		var source = arguments[index];
		if(source !== undefined) {
			var keys = Object.keys(source);
			var l = keys.length;
			for (var i = 0; i < l; i++) {
				var key = keys[i];
				obj[key] = source[key];
			}
		}
	}
	return obj;
}

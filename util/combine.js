function combine(obj) {
	for (var index = 1; index < arguments.length; index++) {
		var source = arguments[index];
		if(source !== undefined) {
			var keys = Object.keys(source);
			for (var i = 0; i < keys.length; i++) {
				var key = keys[i];
				obj[key] = source[key];
			}
		}
	}
	return obj;
}

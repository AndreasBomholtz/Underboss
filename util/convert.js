function convertToSource(obj) {
    //create an array that will later be joined into a string.
    var string = [];
	var prop;
	var tmp = [];

    //is object
    //    Both arrays and objects seem to return "object"
    //    when typeof(obj) is applied to them. So instead
    //    I am checking to see if they have the property
    //    join, which normal objects don't have but
    //    arrays do.
    if (typeof(obj) == "object" && (obj.join == undefined)) {
        string.push("{");
        for (prop in obj) {
            tmp.push(prop+": "+convertToSource(obj[prop]));
        }
		string.push(tmp.join(","));
        string.push("}");

    //is array
    } else if (typeof(obj) == "object" && !(obj.join == undefined)) {
        string.push("[");
        for(var i=0; i<obj.length; i++) {
            tmp.push("'"+obj[i]+"'");
        }
		string.push(tmp.join(","));
        string.push("]");

    //is function
    } else if (typeof(obj) == "function") {
		var f = obj.toString();
		if(f.indexOf("random") != -1) {
			console.log(obj);
			console.log(f);
			console.log("DROP");
		} else {
			string.push(f);
		}

    //all other values can be done with JSON.stringify
    } else {
        string.push(JSON.stringify(obj));
    }

    return string.join("");
}

function convertToSource(obj) {
    //create an array that will later be joined into a string.
    var string = [];

    //is object
    //    Both arrays and objects seem to return "object"
    //    when typeof(obj) is applied to them. So instead
    //    I am checking to see if they have the property
    //    join, which normal objects don't have but
    //    arrays do.
    if (typeof(obj) == "object" && (obj.join == undefined)) {
        string.push("{");
        for (prop in obj) {
            string.push(prop, ": ", convertToSource(obj[prop]), ",");
        }
        string.push("}");

    //is array
    } else if (typeof(obj) == "object" && !(obj.join == undefined)) {
        string.push("[");
        for(prop in obj) {
            string.push(convertToSource(obj[prop]), ",");
        }
        string.push("]");

    //is function
    } else if (typeof(obj) == "function") {
        string.push(obj.toString());

    //all other values can be done with JSON.stringify
    } else {
        string.push(JSON.stringify(obj));
    }

    return string.join("");
}

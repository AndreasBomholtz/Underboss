function inject(src) {
    var script = document.createElement("script");
    script.innerHTML = src;
    script.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(script);
}

function injectFunction(src) {
	src = "(" + src.toString() + ")();";
	inject(src);
}

function injectVariable(name, src) {
    src = "var "+name+" = "+JSON.stringify(src)+";";
	inject(src);
}

function injectObject(name, src) {
    src = "var "+name+" = "+src.toString()+";";
	inject(src);
}

function injectScript(url) {
	var script = document.createElement("script");
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

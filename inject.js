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

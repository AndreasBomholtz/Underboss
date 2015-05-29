function inject(src) {
    var script = document.createElement("script");
    script.innerHTML = src;
    script.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(script);
}

// Adds the CSS
var css = GM_getResourceText("underbossCSS");
GM_addStyle (css);

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

//Insert into the right iframe
if(window.location.href.indexOf("platforms/kabam/game") != -1) {
    console.debug("Injecting Godfather Bot script");

	// Inject resources
	injectVariable("attackUnits",attackUnits);
	injectVariable("defenseUnits",defenseUnits);
	injectVariable("buildings",buildings);
	injectVariable("research",research);
	injectVariable("prizes",prizes);
	injectVariable("collect",collect);

	combine(bot,attackBot,
			bondsBot,buildBot,
			guiBot,itemBot,
			reportBot,trainBot,
			bailoutBot,collectBot,
			prizeBot,researchBot);

	var src = convertToText(bot);
	src = "var bot = "+src+";\n";
	src += "bot.start();";

	// Inject main script
	inject(src);
}

// Adds the CSS
var css = GM_getResourceText("underbossCSS");
GM_addStyle (css);

//Insert into the right iframe
if(window.location.href.indexOf("platforms/kabam/game") != -1) {
    console.debug("Injecting Godfather Bot script");

	//Combine all the bots into one object
	combine(bot,attackBot,
			bondsBot,buildBot,
			guiBot,itemBot,
			reportBot,trainBot,
			bailoutBot,collectBot,
			prizeBot,researchBot);

	//Add all the variables
	bot.attackUnits = attackUnits;
	bot.defenseUnits = defenseUnits;
	bot.buildings = buildings;
	bot.research = research;
	bot.prizes = prizes;
	bot.collect = collect;

	//Convert the obj to source
	var src = convertToSource(bot);
	src = "var bot = "+src+";\n";
	src += "bot.start();";

	// Inject main script
	inject(src);
}

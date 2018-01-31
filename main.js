// Adds the CSS
GM_addStyle (css);

//Insert into the right iframe
if(window.location.href.indexOf("platforms/facebook/game") != -1) {
    console.debug("Injecting Godfather Bot script");

    //Combine all the bots into one object
    combine(bot,attackBot,
            bondsBot,buildBot,
            itemBot,cityscapeBot,
            reportBot,trainBot,
            bailoutBot,collectBot,
            prizeBot,researchBot,
            optionsBot,parserBot,
            queueBot,debugBot,
            utilBot,armorBot);

    if(guiBot) {
        combine(bot,guiBot);
    }

    //Add all the variables
    bot.attackUnits = attackUnits;
    bot.defenseUnits = defenseUnits;
    bot.buildings = buildings;
    bot.research = research;
    bot.items = items;

    //Convert the obj to source
    var src = convertToSource(bot);
    src = "var bot = "+src+";\n";
    src += "bot.start();";

    // Inject main script
    inject(src);
}

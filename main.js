/*jsl:import gui/gui.js*/
/*jsl:import bot/util.js*/
/*jsl:import bot/bonds.js*/
/*jsl:import bot/attack.js*/
/*jsl:import bot/build.js*/
/*jsl:import bot/train.js*/
/*jsl:import bot/parser.js*/
/*jsl:import bot/armor.js*/
/*jsl:import bot/bailout.js*/
/*jsl:import bot/bot.js*/
/*jsl:import bot/cityscape.js*/
/*jsl:import bot/collect.js*/
/*jsl:import bot/debug.js*/
/*jsl:import bot/item.js*/
/*jsl:import bot/prize.js*/
/*jsl:import bot/options.js*/
/*jsl:import bot/queue.js*/
/*jsl:import bot/report.js*/
/*jsl:import bot/research.js*/
/*jsl:import bot/ajax.js*/
/*jsl:import res/attack_units.js*/
/*jsl:import res/buildings.js*/
/*jsl:import res/defense_units.js*/
/*jsl:import res/items.js*/
/*jsl:import res/research.js*/
/*jsl:import res/underboss.css.js*/
/*jsl:import util/combine.js*/
/*jsl:import util/convert.js*/
/*jsl:import util/frame.js*/
/*jsl:import util/inject.js*/

// Adds the CSS
GM_addStyle (css);

//Insert into the right iframe
if(window.location.href.indexOf("platforms/facebook/game") != -1) {
    console.debug("Injecting Godfather Bot script");

    //Combine all the bots into one object
    combine(bot, attackBot,
            bondsBot, buildBot,
            itemBot, cityscapeBot,
            reportBot, trainBot,
            bailoutBot, collectBot,
            prizeBot, researchBot,
            optionsBot, parserBot,
            queueBot, debugBot,
            utilBot, armorBot,
            ajaxBot);

    if(guiBot) {
        combine(bot, guiBot);
    }

    //Add all the variables
    bot.attackUnits = attackUnits;
    bot.defenseUnits = defenseUnits;
    bot.buildings = buildings;
    bot.research = research;
    bot.items = items;

    //Convert the obj to source
    var src = convertToSource(bot);
    src = "var underboss = " + src + ";\n";
    src += "underboss.start();";

    // Inject main script
    inject(src);
}

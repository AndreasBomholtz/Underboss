// ==UserScript==
// @name        The Underboss
// @namespace   Underboss
// @author      MrAnderson
// @description A bot for the game The Godfather from kabam.com
// @include     https://www.kabam.com/games/the-godfather/play
// @include     https://www.kabam.com/*/games/the-godfather/play
// @include     https://*godfather.*.com/platforms/kabam/game
// @version     2.0.0
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @updateURL   https://raw.githubusercontent.com/AndreasBomholtz/Underboss/master/Underboss.js
// @downloadURL https://raw.githubusercontent.com/AndreasBomholtz/Underboss/master/Underboss.js
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require     http://underscorejs.org/underscore-min.js
// @require     https://raw.githubusercontent.com/millermedeiros/js-signals/master/dist/signals.min.js
// @resource    underbossCSS underboss.css
// @require     res/buildings.js
// @require     res/research.js
// @require     res/prizes.js
// @require     res/attack_units.js
// @require     res/defense_units.js
// @require     frame.js
// @require     inject.js
// @require     bot.js
// ==/UserScript==


// Adds the CSS
var css = GM_getResourceText("underbossCSS");
GM_addStyle (css);

//Insert into the right iframe
var str = "" + window.location.href;
if(str.indexOf("platforms/kabam/game") != -1) {
    console.debug("Injecting Godfather Bot script");

	// Inject resources
	injectVariable("attackUnits",attackUnits);
	injectVariable("defenseUnits",defenseUnits);
	injectVariable("buildings",buildings);
	injectVariable("research",research);
	injectVariable("prizes",prizes);

	// Inject main script
	injectFunction(main);
}

/*window.onerror = function(msg, url, line) {
  console.debug(msg + " on line "+line);
  if(line !== 0) {
  var info = document.getElementById('debug_info');
  if(info) {
  info.innerHTML = msg + " on line "+line+"\n" + info.innerHTML;
  }
  }
  };*/

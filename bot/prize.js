var prizeBot = {
    getPrize: function getPrize() {
        this.trace();
        if(this.cities && this.cities[0] && this.minigame_timestamp) {
            this.debugPrize("Get Prize");
            this.sendCommand("Get Prize",
							 "minigames/save_result.json",
							 "minigame_timestamp="+this.minigame_timestamp,
							 this.cities[0]);
            this.addStat("Prize",1);
        }
    },
    doPrize: function doPrize() {
        this.trace();
        if(this.cities && this.cities[0]) {
            if(this.free_ticket || (this.items && this.items.DailyChance && this.items.DailyChance > 0))
			{
                this.debugPrize("Update Prize");
                this.sendGetCommand("Update Prize",
									"minigames/index.json",
									"",
									this.cities[0],
									this.updatePrizeList);
            } else {
                this.debugPrize("No prize ticket - Update player data");
                this.loadPlayerData();
                return(5*60000);
            }
        } else {
            this.debugPrize("Cities not ready");
        }
        return(0);
    },
	updatePrizeList: function updatePrizeList(bot) {
        bot.trace();
        var min = {cost:1000, name:""};

        if(bot.prizeList && bot.prizeList.length) {
            for(var i=0; i<bot.prizeList.length; i++) {
                if(bot.items[bot.prizeList[i].type]) {
					var prize = bot.items[bot.prizeList[i].type];
                    if(min.cost > prize.cost) {
                        min.cost = prize.cost;
                        min.name = bot.prizeList[i].type;
                    }
                } else {
                    bot.updatePrizeInfo(bot.prizeList[i].type +" is unknown");
                    bot.addMissingPrizeInfo(bot.prizeList[i].type);
                }
            }

            if(min.cost >= 10) {
                bot.getPrize();
                if(bot.free_ticket) {
                    bot.free_ticket = false;
                } else if(bot.items && bot.items.DailyChance && bot.items.DailyChance > 0) {
                    bot.items.DailyChance--;
                }
                bot.loadPlayerData();
            }
        }
    },

    addMissingPrizeInfo: function addMissingPrizeInfo(str) {
        if(!this.options.missing_prize) {
            this.options.missing_prize = [];
        }
        this.options.missing_prize.push(str);
        this.saveOptions();
    },
    showMissingPrizeInfo: function showMissingPrizeInfo() {
        this.trace();
        if(this.options.missing_prize) {
            for(var i=0; i<this.options.missing_prize.length; i++) {
                var prize = this.options.missing_prize[i];
                if(this.items[prize]) {
                    this.options.missing_prize.splice(i,1);
                } else {
                    this.debug("Missing prize info: "+prize);
                }
            }
            this.saveOptions();
        }
    }
};
module.exports = prizeBot;

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
									this.bind(this.updatePrizeList));
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
	updatePrizeList: function updatePrizeList() {
        this.trace();
        var min = {"cost":1000,"name":""};

        if(this.prizeList && this.prizeList.length) {
            for(var i=0; i<this.prizeList.length; i++) {
                if(this.items[this.prizeList[i].type]) {
					var prize = this.items[this.prizeList[i].type];
                    if(min.cost > prize.cost) {
                        min.cost = prize.cost;
                        min.name = this.prizeList[i].type;
                    }
                } else {
                    this.updatePrizeInfo(this.prizeList[i].type +" is unknown");
                    this.addMissingPrizeInfo(this.prizeList[i].type);
                }
            }

            if(min.cost >= 10) {
                this.getPrize();
                if(this.free_ticket) {
                    this.free_ticket = false;
                } else if(this.items && this.items.DailyChance && this.items.DailyChance > 0) {
                    this.items.DailyChance--;
                }
                this.loadPlayerData();
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
            this.debug("Show Missing prizes");
            for(var i=0; i<this.options.missing_prize.length; i++) {
                var prize = this.options.missing_prize[i];
                if(this.items[prize]) {
                    this.options.missing_prize.splice(i,1);
                } else {
                    this.debug("Missing prize info: "+prize);
                }
            }
            this.saveOptions();
        } else {
            this.debug("No missing prizes");
        }
    }
};

var cityscapeBot = {
    doCityscape: function doCityscape() {
        this.trace();
        if(!this.cities) {
	    this.debugCityscape("Cities not ready");
	    return(5000);
	}

        for(var i=0; i<this.cities.length; i++) {
            var city = this.cities[i];
            if(!city || !city.wildernesses) {
		this.debugCityscape("Wilderness is not ready",city);
		continue;
	    }
	    
            for(var c=0; c<city.wildernesses.length; c++) {
                var wild = city.wildernesses[c];
                if(!wild) {
		    this.debugCityscape("Wild "+c+" is empty",city);
		    continue;
		}

                if(wild.type != "CityScape") {
                    this.debugCityscape("Wild is "+wild.type,city);
		    continue;
		}

                var d = new Date();
                var t = d.getTime() / 1000;
                var diff = t-wild.last_collected_at;
                var need = 60*60*6;
                if(diff >= need) {
                    this.debugCityscape("Collect cityscapes",city);
                    this.sendCommand("Collect Cityscape in "+city.type,
				     "cities/"+city.id+"/wildernesses/collect_all.json",
				     '',city);
                    this.addStat("CityScape",1);
                } else {
                    this.debugCityscape("Diff is "+diff+" < "+need);
                }
            }
        }
       
        return(60*1000*60);
    }
};

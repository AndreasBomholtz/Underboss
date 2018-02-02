var armorBot = {
    doArmor: function doArmor() {
        this.trace();
        this.eachCity(this.doArmorEvent);
    },
    doArmorEvent: function doArmorEvent(city) {
        this.trace();

        if(!city || city.armory) {
            this.debugArmor("City do not have armor",city);
            return;
        }

        for(var i=0; i<city.armor.length; i++) {
            var id = city.armor[i].equipped_armory_item.item_id;
            this.debugArmor("Has item id "+id,city);
            var item = this.mapIdToName(id);
            if(item) {
                this.debugArmor(item[0]+" ("+item[1]+") Lvl "+item[2]);
            } else {
                this.debugArmor(id + " not found",city);
            }
        }
    },
    mapIdToName: function mapIdToName(id) {
        this.trace();

        if(id < 31) {//309
            //Hand weapon
            if(id > 20) {
                return ["Piano Wire", "Gold", (id-19)];
            } else if(id > 10) {
                return ["Stilettos", "Silver", (id-9)];
            } else {
                return ["Bat", "Bronze", id];
            }
        } else if(id < 61) {
            //Gun Weapon
            if(id > 50) {
                return ["Tommy Gun", "Gold", (id-49)];
            } else if(id > 40) {
                return ["Magnum", "Silver", (id-39)];
            } else {
                return["Molotov", "Bronze", (id-29)];
            }
        } else if(id < 91) {
            //Close
            if(id > 80) {
                return ["Italian Suit","Gold", (id-79)];
            } else if(id >70) {
                return ["Fedora", "Silver", (id-69)];
            } else {
                return ["Scarf", "Bronze", (id-59)];
            }
        } else {
            //Car
            if(id > 110) {
                return ["Caddy", "Gold", (id-109)];
            } else if(id > 100) {
                return ["Speedster", "Silver", (id-99)];
            } else {
                return ["Motorcycle", "Bronze", (id-89)];
            }
        }
    }
};

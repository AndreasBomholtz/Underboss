var guiBot = {
    initGUI: function initGUI() {
        var panel = document.createElement("div");
        panel.setAttribute("id","panel");
        panel.setAttribute("class", "panel");
        document.body.appendChild(panel);
        this.html.panel = panel;

        var header = document.createElement("p");
        header.className = "header";
        header.innerHTML = "The Underboss";
        header.onclick = function() {
            if($("#panel").hasClass("panel")) {
                $("#panel").removeClass("panel").addClass("hiddenPanel");
                $("#mainPanel").hide();
            } else {
                $("#panel").removeClass("hiddenPanel").addClass("panel");
                $("#mainPanel").show();
            }
        };
        panel.appendChild(header);

        var mainPanel = document.createElement("div");
        mainPanel.setAttribute("id","mainPanel");
        this.html.panel.appendChild(mainPanel);
        this.html.mainPanel = mainPanel;

        for(var fun in this.autoFunctions) {
            this.drawOption(fun);
        }


		this.createOverview();
		this.createArmorView();

        //this.drawButton("Cities",this.bind(this.loadCitiesData));

        var infoPanel = document.createElement("div");
        mainPanel.appendChild(infoPanel);

        var tabBox = document.createElement("div");
        tabBox.className = "tab-box";
        infoPanel.appendChild(tabBox);

        var tabs = ["Info","Prizes","Attack","Map","Train","Build","Debug"];
        for(var i=0; i<tabs.length; i++) {
            tabBox.appendChild(this.drawTab("info-"+(i+1),tabs[i]));
            var infoData = this.drawTabData("info-"+(i+1));
            infoPanel.appendChild(infoData);
            this.html[tabs[i]+"InfoData"] = infoData;
            if(this["draw"+tabs[i]+"Tab"]) {
                this["draw"+tabs[i]+"Tab"](infoData);
            }
        }

        this.listen("queue:update",this.updateDebugQueue);

    },
    drawOption: function drawOption(name) {
        var div = this.drawGenericOption(name,this.html.mainPanel,"enable_","changeEnable",this.options["enable"+name]);

        var sep = document.createElement("span");
        sep.innerHTML = " - ";
        div.appendChild(sep);

        this.drawButton(name+" Now",this.bind(this["do"+name]),div);
    },
    drawDebugOption: function drawDebugOption(name) {
        this.drawGenericOption(name,this.html.DebugInfoData,"enable_debug_","changeDebugEnable",false);
    },
    drawGenericOption: function drawGenericOption(name,p,strEnable,optEnable,checked) {
        var div = document.createElement("div");
        p.appendChild(div);

        var span = document.createElement("div");
        span.className = "option";
        span.innerHTML = name+": ";
        div.appendChild(span);

        var input = document.createElement("input");
        input.type = "checkbox";
        input.name = strEnable+name;
        input.id = strEnable+name;
        input.checked = checked;
        input.onclick = this.bind(this[optEnable+name]);
        div.appendChild(input);
        this.html[strEnable+name] = input;

        return div;
    },
    drawButton: function drawButton(name,func,cont) {
        var button = document.createElement("input");
        button.name = name;
        button.value = name;
        //button.className = "button";
        button.type = "button";
        button.onclick = func;
        if(cont === undefined) {
            this.html.mainPanel.appendChild(button);
        } else {
            cont.appendChild(button);
        }
    },
    drawTab: function drawTab(id,name) {
        var link = document.createElement("a");
        link.href = "javascript:;";
        link.className = "tabLink";
        link.id = id;
        link.innerHTML = name;
        link.onclick = function() {
            var tabeId = $(this).attr('id');
            $(".tabLink").removeClass("activeLink");
            $(this).addClass("activeLink");
            $(".tabcontent").addClass("hide");
            $("#"+tabeId+"_data").removeClass("hide");
            return false;
        };
        return link;
    },
    drawTabData: function drawTabData(id) {
        var div = document.createElement("div");
        div.id = id+"_data";
        div.className = "tabcontent hide";
        return div;
    },
    drawDebugTab: function drawDebugTab(infoData) {
        $(infoData).html("<h7>Debug Info</h7>").append($("<div/>").attr("id","debug_jobs")).append($("<div/>").attr("id","debug_queue"));
        this.drawButton("Update Jobs",this.bind(this.loadCitiesData),infoData);
        this.drawButton("Execute",this.bind(this.executeCMD),infoData);
        this.drawButton("Trace",this.bind(this.toggleTrace),infoData);
        this.drawButton("Overview",this.showoverview,infoData);

        for(var fun in this.autoFunctions) {
            this.drawDebugOption(fun);
        }
        this.listen("jobs:update",this.updateDebug);
        this.listen("report:update",this.handleReport);
    },
    updateDebugQueue: function updateDebugQueue() {
        $("#debug_queue").html("<h7>Queue: "+this.queue.length+"</h7><h7>Slow Queue: "+this.slow_queue.length+"</h7>");
    },
    updateDebug: function updateDebug() {
        var job = $("#debug_jobs").html("<h7>Jobs</h7>");
        if(this.cities) {
            for(var i=0; i<this.cities.length; i++) {
                var city = this.cities[i];
                if(city && city.jobs) {
                    var b, r, u, d;
					b = r = u = d = "&nbsp;";
                    for(var j=0; j<city.jobs.length; j++) {
                        if(city.jobs[j].queue == "research") { r = "R";}
                        if(city.jobs[j].queue == "building") { b = "B";}
                        if(city.jobs[j].queue == "units") { u = "U";}
                        if(city.jobs[j].queue == "defense_units") { d = "D";}
                    }
                    job.append("<h7>"+city.type+" ("+city.jobs.length+") "+b+" "+r+" "+u+" "+d+"</h7>");
                }
            }
        }
    },
	drawBuildTab: function drawBuildTab(infoData) {
        this.html.build = {};

        if(!this.options.build) {
            this.options.build = {};
        }

        infoData.innerHTML = "<h7>Build Orders</h7><p>Build this amount of buildings and the rest will be Hideout.</p>";
        var table = document.createElement("table");
        infoData.appendChild(table);

        var saveChanges = false;
        for(var b in this.buildings) {
            if(this.buildings[b].buildNew) {
                var tr = document.createElement("tr");
                table.appendChild(tr);
                var td = document.createElement("td");
                td.innerHTML = b;
                tr.appendChild(td);
                td = document.createElement("td");
                tr.appendChild(td);
                var input = document.createElement("input");
                if(this.options.build.hasOwnProperty(b) && typeof(this.options.build[b]) == 'number') {
                    input.value = this.options.build[b];
                } else {
                    input.value = this.buildings[b].buildNew;
                    saveChanges = true;
                }
                this.html.build[b] = input;
                td.appendChild(input);
            }
        }
        if(saveChanges) {
            this.saveBuildOrder();
        }
        this.drawButton("Save",this.bind(this.saveBuildOrder),infoData);
    },
    saveBuildOrder: function saveBuildOrder() {
        this.options.build = {};
        for(var b in this.buildings) {
            if(this.buildings[b].buildNew) {
                this.options.build[b] = parseInt(this.html.build[b].value,10);
            }
        }
        this.saveOptions();
    },
    drawTrainTab: function drawTrainTab(infoData) {
        infoData.innerHTML = "<h7>Training Orders</h7>";
        var table = $("<table/>");
        $(infoData).append(table);
        var count = 0;
        var tr;
        for(var unit in this.attackUnits) {
			if(this.attackUnits[unit].trainable) {
				if((count % 3) === 0) {
					tr = $("<tr/>");
					table.append(tr);
				}
				tr.append($("<td/>").text(unit).append($("<td/>").append($("<input class='number'/>").attr("id","unit_"+unit))));
				if(this.options.trainOrders && this.options.trainOrders[unit]) {
					$("#unit_"+unit).val(this.options.trainOrders[unit]);
				}
				count++;
			}
        }
        this.drawButton("Save",this.bind(this.saveTrainOrder),infoData);
    },
    saveTrainOrder: function saveTrainOrder() {
        this.trace();
        if(!this.options.trainOrders) {
            this.options.trainOrders = {};
        }
        for(var unit in this.attackUnits) {
            this.options.trainOrders[unit] = $("#unit_"+unit).val();
        }
        this.saveOptions();
    },
    drawMapInfo: function drawMapInfo() {
        if(!this.html.map_info) {
            this.html.map_info = document.createElement("div");
            this.html.MapInfoData.appendChild(this.html.map_info);
        }
        if(!this.options.map_size) {
            this.options.map_size = 2;
            this.updateMap();
        }
        this.html.map_info.innerHTML = "<p>Scan size: "+this.options.map_size+"</p>";

        var counts = {}, i, keyX;
        for(keyX in this.options.map) {
            for(var keyY in this.options.map[keyX]) {
                var gang = this.options.map[keyX][keyY];
                if(!counts[gang.lvl]) {
                    counts[gang.lvl] = 0;
                }
                counts[gang.lvl]++;
            }
        }
        for(i=1; i <= 10; i++) {
            if(counts[i]) {
                this.html.map_info.innerHTML += "<p>Lvl "+(i)+" Gangs: "+counts[i]+"</p>";
            }
        }
        for(i=1; i<=5; i++) {
            if(counts[10+i]) {
                this.html.map_info.innerHTML += "<p>Murder Inc. "+(i)+": "+counts[10+i]+"</p>";
            }
        }
    },
    drawMapTab: function drawMapTab(infoData) {
        infoData.innerHTML = "<h7>Map</h7>";
        this.drawButton("Update Map",this.bind(this.updateMap),infoData);
        this.drawMapInfo();
    },
    drawAttackTab: function drawAttackTab(infoData) {
        this.html.order = {};
        infoData.innerHTML = "<h7>Attack Orders</h7>";

        $('<div>City:</div>').append($('<select id="select_attack_city"></select>')).appendTo($(infoData));
        this.listen('cities:update',function updateAttackCity() {
            var city = $('#select_attack_city');
            city.empty();
            city.append($('<option value="all">All</option>'));
            if(this.cities) {
                for(var i=0; i<this.cities.length; i++) {
                    city.append($('<option value="'+this.cities[i].type+'">'+this.cities[i].type+'</option>'));
                }
            }
        });


        $('<div>Gang Level:</div>').append($('<select id="select_gang"></select>')).appendTo($(infoData));
        var gang = $('#select_gang');
        for(var i=1; i<=15; i++) {
            gang.append($('<option value="'+i+'">'+i+'</option>'));
        }

        $('<div id="units_p">Units:</div>').append($('<select id="select_units"></select>')).appendTo($(infoData));
        var units = $('#select_units');
        for(var unit in this.attackUnits) {
            units.append($('<option value="'+unit+'">'+unit+'</option>'));
        }

        $('<input type="text" id="unit_count" value="0" class="unit_count" />').appendTo($('#units_p'));
        this.drawButton("Add",this.bind(this.addUnitToAttackOrder),document.getElementById('units_p'));

        $('<div>Use All:</div>').append('<input type="checkbox" id="check_attack_all" value="all"/>').appendTo($(infoData));

        $('<textarea id="total_units" class="textinfo"></textarea>').appendTo($(infoData));


        this.drawButton("Save",this.bind(this.saveAttackOrder),infoData);
        this.drawButton("Clear",this.bind(this.clearAttackOrder),infoData);

        var line = document.createElement("hr");
        infoData.appendChild(line);

        var list = document.createElement("select");
        list.size = "10";
        list.width = "100%";
        infoData.appendChild(list);
        this.html.order.list = list;

        this.drawButton("Delete",this.bind(this.deleteAttackOrder),infoData);

        this.updateAttackOrders();
    },
    deleteAttackOrder: function deleteAttackOrder() {
        var index = this.html.order.list.value;
        this.options.attackOrders.splice(index,1);
        this.updateAttackOrders();
    },
    updateAttackOrders: function updateAttackOrders() {
        this.html.order.list.innerHTML = "";

        if(this.options.attackOrders) {
            for(var n=0; n<this.options.attackOrders.length; n++) {
                var order = this.options.attackOrders[n];
                if(!order.city) {
                    order.city = "all";
                }
                if(!order.use_all) {
                    order.use_all = false;
                }
                var item = document.createElement("option");
                this.html.order.list.appendChild(item);

                item.value = n;
                item.innerHTML = order.city+" | "+order.gang+" | "+(order.use_all?'t':'f')+" | "+order.units;
            }
        }
    },
    addUnitToAttackOrder: function addUnitToAttackOrder() {
        var total = $('#total_units');
        if(total.val() !== "")
        {
            total.val(total.val() + ",");
        }
        total.val(total.val()+'"'+$('#select_units').val()+'":'+$('#unit_count').val());
    },
    saveAttackOrder: function saveAttackOrder() {
        var order = {};
        order.gang = parseInt($('#select_gang').val(),10);
        order.units = "{"+$('#total_units').val()+"}";
        order.city = $('#select_attack_city').val();
        order.use_all = $('#check_attack_all').is(":checked");

        if(!this.options.attackOrders) {
            this.options.attackOrders = [];
        }
        this.options.attackOrders.push(order);
        this.saveOptions();

        this.clearAttackOrder();
        this.updateAttackOrders();
    },
    clearAttackOrder: function clearAttackOrder() {
        $('#total_units').val("");
    },
    updateStats: function updateStats() {
        var stat = $("#stats").html("<h3><u>Stats</u></h3>");
        if(this.options.stats) {
            for(var s in this.options.stats) {
                stat.append($("<p>"+s+": "+this.options.stats[s]+"</p>"));
            }
        }
    },
    drawInfoTab: function drawInfoTab(infoData) {
        $(infoData).append($("<div></div>").addClass("stats").attr("id","stats"));
        this.updateStats();
        $(infoData).append($("<textarea></textarea>").addClass("info").attr("id","debug_info"));
    },
    drawPrizesTab: function drawPrizesTab(infoData) {
        $(infoData).html("<h7>Prizes</h7>").append("<p>Prize Info:</p>").append($("<textarea/>").addClass("prize_info"));
    },
    updateInfo: function updateInfo(str,city) {
        $("#debug_info").text(this.debug(str,city)+"\n"+$("#debug_info").text());
    },
    updatePrizeInfo: function updatePrizeInfo(str,city) {
        $(".prize_info").text(this.debug(str,city) +"\n"+$(".prize_info").text());
    },
	createDialog: function createDialog(id, title) {
		$("#panel").append("<dialog id='"+id+"' class='overlay'><h1>"+title+"</h1><button id='"+id+"_close'>Close</button></dialog>");
		$("#"+id+"_close").click(function() {
			$("#"+id).hide();
		});
		this["show"+id] = function() {
			$("#"+id).show();
		};
	},
	createArmorView: function() {
		this.createDialog('armorView','Armor View');


	},
	createOverview: function() {
		this.createDialog('overview','Overview');

		$("#overview").append("<button id='overview_update'>Update</button>");
		$("#overview_update").click(this.bind(this.updateOverview,this));

		$("#overview").append("<table id='overview_table'></table>");
		$("#overview_table").append("\
<tr><td>City</td>\
<th>Cash</th><th>Cement</th><th>Food</th><th>Steel</th>\
<th>Jobs</th>\
</tr>\
<tr id='total'>\
<td>Total</td>\
<td id='cash'>0</td><td id='cement'>0</td>\
<td id='food'>0</td><td id='steel'>0</td>\
<td id='jobs'></td>\
</tr>");

		this.listen("jobs:update",this.updateOverview);
		this.listen('cities:update',this.updateOverview);
		this.listen('resources:update',this.updateOverview);

		this.updateOverview();
	},
    updateOverview: function updateOverview() {
		var table = $("#overview_table");
		var total = table.find("#total");
		var conv = this.numberToString;
        if(this.cities) {
			var total_res = {};
            for(var i=0; i<this.cities.length; i++) {
                var city = this.cities[i];
                if(city && city.type) {
					var el = table.find("#"+city.type);
					if(el.length === 0) {
						total.before("\
<tr id='"+city.type+"'>\
<td>"+city.type+"</td>\
<td id='cash'>0</td><td id='cement'>0</td>\
<td id='food'>0</td><td id='steel'>0</td>\
<td id='jobs'></td>\
</tr>");
						el = table.find("#"+city.type);
					}
					if(city.resources) {
						$.each(city.resources, function(k,v) {
							var t = total_res[k] || 0;
							t += parseInt(v,10);
							total_res[k] = t;
							el.find("#"+k).html(conv(v));
						});
					}
					if(city.jobs) {
						var b, r, u, d;
						b = r = u = d = "&nbsp;";
						for(var j=0; j<city.jobs.length; j++) {
							if(city.jobs[j].queue == "research") { r = "R";}
							if(city.jobs[j].queue == "building") { b = "B";}
							if(city.jobs[j].queue == "units") { u = "U";}
							if(city.jobs[j].queue == "defense_units") { d = "D";}
						}
						el.find("#jobs").html("("+city.jobs.length+") "+b+" "+r+" "+u+" "+d);
					}
				}
			}
			$.each(total_res, function(k,v) {
				total.find("#"+k).html(conv(v));
			});
		}
	}
};

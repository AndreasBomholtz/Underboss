var guiBot = {
    initGUI: function initGUI() {
        var panel = $("<div id='panel' class='panel' />");
        $(document.body).append(panel);

        var header = $("<p class='header'><span>The Underboss</span> <span id='version'>v1.1.1</span>");
        header.click(function panelOnClick() {
            if($("#panel").hasClass("panel")) {
                $("#panel").removeClass("panel").addClass("hiddenPanel");
                $("#mainPanel").hide();
            } else {
                $("#panel").removeClass("hiddenPanel").addClass("panel");
                $("#mainPanel").show();
            }
        });
        var mainPanel = $("<div id='mainPanel' />");
        var infoPanel = $("<div id='infoPanel'/>");
        panel.append(header);
        panel.append(mainPanel);
        $(mainPanel).append(infoPanel);

        var tabBox = $("<div class='tab-box' />");
        infoPanel.append(tabBox);

        var views = ["Overview", "Prizes", "Armor","Training", "Options"];
        for(var j=0; j<views.length; j++) {
            this.createDialog(views[j].toLowerCase() + "_view", views[j]);
            if(this["create" + views[j] + "View"]) {
                this["create" + views[j] + "View"]();
            } else {
                this.debug("create" + views[j] + "View function is missing!");
            }
            this["show" + views[j]] = this.generateShowView(views[j]);
        }

        var tabs = ["Control", "Info","Prizes","Attack","Map","Build","Financier","Debug"];
        for(var i=0; i<tabs.length; i++) {
            tabBox.append(this.drawTab("info-" + (i + 1),tabs[i]));
            var infoData = this.drawTabData("info-" + (i + 1));
            infoPanel.append(infoData);
            if(this["draw" + tabs[i] + "Tab"]) {
                this["draw" + tabs[i] + "Tab"](infoData);
            }
        }
        $("#info-1").addClass("activeLink");
        $("#info-1_data").removeClass("hide");
    },
    generateShowView: function generateShowView(view) {
        return function generateShowViewShow() {
            $("#" + view.toLowerCase() + "_view").show();
        };
    },
    drawOption: function drawOption(name, panel) {
        var div = this.drawGenericOption(name,
                                         panel,
                                         "enable_",
                                         "changeEnable",
                                         this.options["enable" + name]);

        var sep = document.createElement("span");
        sep.innerHTML = " - ";
        div.appendChild(sep);

        this.drawButton(name + " Now", this["do" + name], div, "button_large");
    },
    drawDebugOption: function drawDebugOption(name, panel) {
        this.drawGenericOption(name,
                               panel,
                               "enable_debug_",
                               "changeDebugEnable",
                               false);
    },
    drawGenericOption: function drawGenericOption(name,p,strEnable,optEnable,checked) {
        var div = document.createElement("div");
        p.appendChild(div);

        var span = document.createElement("div");
        span.className = "option";
        span.innerHTML = name + ": ";
        div.appendChild(span);

        var self = this;
        var input = document.createElement("input");
        input.type = "checkbox";
        input.name = strEnable + name;
        input.id = strEnable + name;
        input.checked = checked;
        input.onclick = function drawGenericOptionClick() {
            self[optEnable + name]();
        };
        div.appendChild(input);

        return div;
    },
    drawButton: function drawButton(name, func, cont, css) {
        var self = this;
        if(css === undefined) {
            css = "";
        }
        var button = $("<button class='"+css+"'/>").html(name).click(function drawButton() {
            func.call(self);
        });
        $(cont).append(button);
    },
    drawTab: function drawTab(id,name) {
        var link = document.createElement("a");
        link.href = "javascript:;";
        link.className = "tabLink";
        link.id = id;
        link.innerHTML = name;
        link.onclick = function drawTabOnClick() {
            var tabeId = $(this).attr('id');
            $(".tabLink").removeClass("activeLink");
            $(this).addClass("activeLink");
            $(".tabcontent").addClass("hide");
            $("#" + tabeId + "_data").removeClass("hide");
            return false;
        };
        return link;
    },
    drawTabData: function drawTabData(id) {
        var div = document.createElement("div");
        div.id = id + "_data";
        div.className = "tabcontent";
        if(id != 1) {
            div.className  += " hide";
        }
        return div;
    },
    drawDebugTab: function drawDebugTab(infoData) {
        $(infoData).html("<h7>Debug Info</h7>").append($("<div/>").attr("id","debug_queue"));

        this.drawButton("Update Jobs", this.loadCitiesData, infoData);
        this.drawButton("Execute", this.executeCMD, infoData);
        this.drawButton("Trace", this.toggleTrace, infoData);
        this.drawButton("Pause", this.togglePause, infoData);

        $(infoData).append("<select id='debug_city' />");

        var self = this;
        $("#debug_city").change(function drawDebugTabChange() {
            self.changeDebugCity();
        });

        for(var fun in this.autoFunctions) {
            this.drawDebugOption(fun, infoData);
        }

        this.listen("queue:update", this.updateDebugQueue);
        this.listen("queue:change", this.updateDebugQueue);
        this.listen("cities:update", this.updateDebugCities);
        this.listen("report:update", this.handleReport);
    },
    changeDebugCity: function changeDebugCity() {
        this.debugCity = $("#debug_city").val();
    },
    updateDebugCities: function updateDebugCities() {
        $("#debug_city").html("").append("<option value='All'>All</option>");
        for(var i=0; i<this.cities.length; i++) {
            var city = this.cities[i];
            if(!city || !city.type) {
                continue;
            }
            $("#debug_city").append("<option value='" + city.type + "'>" + city.type + "</option>");
        }
    },
    updateDebugQueue: function updateDebugQueue() {
        $("#debug_queue").html("<h7>CMD Queue: " + this.queue.length + "</h7><h7>Data Queue: " + this.data_queue.length + "</h7><h7>Slow Queue: " + this.slow_queue.length + "</h7><h7>Queue Type: " + this.queue_type + "</h7>");
    },
    drawBuildTab: function drawBuildTab(infoData) {
        if(!this.options.build) {
            this.options.build = {};
        }
        $(infoData).append("<h7>Build Options</h7>");
        $(infoData).append("<p>Upgrade builing above level 9? <input type='checkbox' id='build_above_level_9' />");


        $(infoData).append("<br /><h7>Build Orders</h7>");
        $(infoData).append("<p>Build this amount of buildings. If you set it to -1 it will keep building that building.</p>");

        $(infoData).append("<select id='build_order_city' />");

        this.buildOrderCity = 'Capital';
        var self = this;
        $("#build_order_city").change(function drawBuildTabChange() {
            self.changeBuildOrderCity();
        });

        var table = $("<table/>");
        $(infoData).append(table);

        for(var b in this.buildings) {
            if(!this.buildings[b].buildNew) {
                continue;
            }
            var input = $("<input class='build_order' id='build_" + b + "' />");
            this.addTableRow(table,b,input);
        }
        this.drawButton("Save", this.saveBuildOrder, infoData);
        this.changeBuildOrder();

        this.listen("cities:update", this.updateBuildOrderCities);
    },
    changeBuildOrder: function changeBuildOrder() {
        for(var b in this.buildings) {
            if(!this.buildings[b].buildNew) {
                continue;
            }

            var input = $("#build_"+b);
            if(this.options.build[this.buildOrderCity] &&
               this.options.build[this.buildOrderCity][b] &&
               typeof(this.options.build[this.buildOrderCity][b]) == 'number') {
                input.val(this.options.build[this.buildOrderCity][b]);
            } else {
                input.val(this.buildings[b].buildNew);
            }
        }
    },
    changeBuildOrderCity: function changeBuildOrderCity() {
        this.buildOrderCity = $("#build_order_city").val();
        this.changeBuildOrder();
    },
    updateBuildOrderCities: function updateBuildOrderCities() {
        $("#build_order_city").html("");
        for(var i=0; i<this.cities.length; i++) {
            var city = this.cities[i];
            if(!city || !city.type) {
                continue;
            }
            $("#build_order_city").append("<option value='" + city.type + "'>" + city.type + "</option>");
        }
    },
    saveBuildOrder: function saveBuildOrder() {
        this.options.build[this.buildOrderCity] = {};
        for(var b in this.buildings) {
            if(this.buildings[b].buildNew) {
                this.options.build[this.buildOrderCity][b] = parseInt($("#build_" + b).val(),10);
            }
        }
        this.saveOptions();
    },
    drawMapTab: function drawMapTab(infoData) {
        if(!this.options.map_size) {
            this.options.map_size = 2;
            this.updateMap();
        }

        infoData.innerHTML = "<h7>Map</h7>";
        this.drawButton("Update Map", this.updateMap, infoData);
        this.drawButton("Reset Map", this.resetMap, infoData);

        $(infoData).append("<p id='scan-size'>Scan size: " + this.options.map_size + "</span>");

        var i;
        for(i=1; i <= 10; i++) {
            $(infoData).append("<p>Lvl " + (i) + " Gangs: <span id='gang_" + (i) + "'>0</span></p>");
        }
        for(i=1; i<=5; i++) {
            $(infoData).append("<p>Murder Inc. " + (i) + ": <span id='gang_" + (10 + i) + "'>0</span></p>");
        }

        this.updateMapInfo();
        this.listen("map:update", this.updateMapInfo);
    },
    updateMapInfo: function updateMapInfo() {
        $("#scan_size").text("Scan size: " + this.options.map_size);

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
        for(i=1; i <= 15; i++) {
            if(counts[i]) {
                $("#gang_"+i).text(counts[i]);
            }
        }
    },
    drawAttackTab: function drawAttackTab(infoData) {
        infoData.innerHTML = "<h7>Attack Orders</h7>";

        $('<div>City:</div>').append($('<select id="select_attack_city"></select>')).appendTo($(infoData));
        this.listen('cities:update',function updateAttackCity() {
            var city = $('#select_attack_city');
            city.empty();
            city.append($('<option value="all">All</option>'));
            if(this.cities) {
                for(var i=0; i<this.cities.length; i++) {
                    city.append($('<option value="' + this.cities[i].type + '">' + this.cities[i].type + '</option>'));
                }
            }
        });


        $('<div>Gang Level:</div>').append($('<select id="select_gang"></select>')).appendTo($(infoData));
        var gang = $('#select_gang');
        for(var i=1; i<=15; i++) {
            gang.append($('<option value="' + i + '">' + i + '</option>'));
        }

        $('<div id="units_p">Units:</div>').append($('<select id="select_units"></select>')).appendTo($(infoData));
        var units = $('#select_units');
        for(var unit in this.attackUnits) {
            units.append($('<option value="' + unit + '">' + unit + '</option>'));
        }

        $('<input type="text" id="unit_count" value="0" class="unit_count" />').appendTo($('#units_p'));
        this.drawButton("Add", this.addUnitToAttackOrder, document.getElementById('units_p'));

        $('<div>Use All:</div>').append('<input type="checkbox" id="check_attack_all" value="all"/>').appendTo($(infoData));

        $('<textarea id="total_units" class="textinfo"></textarea>').appendTo($(infoData));


        this.drawButton("Save", this.saveAttackOrder, infoData);
        this.drawButton("Clear", this.clearAttackOrder, infoData);

        var line = document.createElement("hr");
        infoData.appendChild(line);

        $(infoData).append("<select id='order_list' size='10' width='100%' />");

        this.drawButton("Delete", this.deleteAttackOrder, infoData);

        this.updateAttackOrders();
    },
    deleteAttackOrder: function deleteAttackOrder() {
        var index = $("#order_list").val();
        this.options.attackOrders.splice(index, 1);
        this.updateAttackOrders();
    },
    updateAttackOrders: function updateAttackOrders() {
        $("#order_list").empty();

        if(this.options.attackOrders) {
            for(var n=0; n<this.options.attackOrders.length; n++) {
                var order = this.options.attackOrders[n];
                if(!order.city) {
                    order.city = "all";
                }
                if(!order.use_all) {
                    order.use_all = false;
                }
                var str = order.city + " | " + order.gang + " | " + (order.use_all?'t':'f') + " | " + order.units;
                $("#order_list").append("<option value='" + n + "'>" + str + "</option>");
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
    drawFinancierTab: function drawFinancierTab(infoData) {
        $(infoData).append("<h7>Financiers Office</h7>").append("<p>Select items that should be sold</p>");

        $(infoData).append("<p>There is <span id='financier_stats_items'>0</span> items to sell and <span id='financier_stats_trades'>0</span> trades left</p>");

        $(infoData).append("<select id='financier_all_items' />");
        if(this.my_items) {
            for(var item in this.my_items) {
                if (this.my_items.hasOwnProperty(item)) {
                    $("#financier_all_items").append("<option value='"+item+"'>"+item+"</option>");
                }
            }
        }
        this.listen("player:items", this.updateFinancierItems);
        this.drawButton("Add item", this.addFinancierItem, infoData);
        this.drawButton("Remove item", this.removeFinancierItem, infoData);

        $(infoData).append("<br />");
        $(infoData).append("<select id='financier_order' size='10' width='100%' />");

        if(this.options.financier_order) {
            for(var o=0; o<this.options.financier_order.length; o++) {
                var val = this.options.financier_order[o];
                $("#financier_order").append("<option value='"+val+"'>"+val+"</option>");
            }
        }
        $(infoData).append("<br />");
        this.listen("financier:sold", this.updateFinancierStats);
    },
    updateFinancierItems: function updateFinancierItems() {
        $("#financier_all_items").empty();
        if(this.my_items) {
            var keys = Object.keys(this.my_items).sort();
            for(var item in keys) {
                if (keys.hasOwnProperty(item)) {
                    $("#financier_all_items").append("<option value='"+keys[item]+"'>"+keys[item]+"</option>");
                }
            }
        }
        this.updateFinancierStats();
    },
    updateFinancierStats: function updateFinancierStats() {
        var items = 0;
        if(this.options.financier_order) {
            for(var i=0; i<this.options.financier_order.length; i++) {
                var item = this.options.financier_order[i];
                items += parseInt(this.my_items[item], 10);
            }
        }
        $("#financier_stats_items").html(items);
        $("#financier_stats_trades").html(this.financier_trades);
    },
    addFinancierItem: function addFinancierItem() {
        var val = $("#financier_all_items").val();
        $("#financier_order").append("<option value='"+val+"'>"+val+"</option>");
        this.saveFinancierOrder();
        this.updateFinancierStats();
    },
    removeFinancierItem: function removeFinancierItem() {
        $("#financier_order :selected").remove();
        this.saveFinancierOrder();
        this.updateFinancierStats();
    },
    saveFinancierOrder: function saveFinancierOrder() {
        this.options.financier_order = $("select#financier_order option").map(function() {return $(this).val();}).get();
        this.saveOptions();
    },
    drawInfoTab: function drawInfoTab(infoData) {
        this.drawButton("Overview", this.showOverview, infoData);
        this.drawButton("Traning", this.showTraining, infoData);
        $(infoData).append("<br />");
        $(infoData).append($("<textarea></textarea>").addClass("info").attr("id","debug_info"));
    },
    drawControlTab: function drawControlTab(infoData) {
        for(var fun in this.autoFunctions) {
            this.drawOption(fun, infoData);
        }
    },
    drawPrizesTab: function drawPrizesTab(infoData) {
        $(infoData).html("<h7>Prizes</h7>").append("<p>Prize Info:</p>").append($("<textarea/>").addClass("prize_info"));
    },
    updateInfo: function updateInfo(str,city) {
        var lines = $("#debug_info").text().split("\n") || [];
        lines = lines.slice(0, 100).join("\n");
        $("#debug_info").text(this.log_format(str,city) + "\n" + lines);
    },
    updatePrizeInfo: function updatePrizeInfo(str,city) {
        var lines = $(".prize_info").text().split("\n") || [];
        lines = lines.slice(0, 100).join("\n");
        $(".prize_info").text(this.log_format(str, city) + "\n" + lines);
    },
    createDialog: function createDialog(id, title) {
        $("#panel").append("<dialog id='"+id+"' class='overlay'><h1>"+title+"</h1><button class='close' id='"+id+"_close'>Close</button></dialog>");
        $("#"+id+"_close").click(function createDialogClickClose() {
            $("#"+id).hide();
        });
        this["show"+id] = function createDialogClickShow() {
            $("#"+id).show();
        };
    },
    createArmorView: function createArmorView() {

    },
    createPrizesView: function createPrizesView() {

    },
    addTableRow: function addTableRow(table,name, value) {
        var c1 = $("<td/>").append(name);
        var c2 = $("<td/>").append(value);
        table.append($("<tr/>").append(c1,c2));
    },
    createOptionsView: function createOptionsView() {
        var view = $("#options_view");
        view.append("<h7>Options</h7>");
        var table = $("<table/>");
        view.append(table);
        this.addTableRow(table,"Reload Time","");
        this.addTableRow(table,"Underboss Size","");
        this.addTableRow(table,"Queue Send Interval","");
        this.addTableRow(table,"Hide side panel","");
        this.addTableRow(table,"","");

        this.drawButton("Save", this.saveOptionsPage, view);
    },
    saveOptionsPage: function saveOptionsPage() {
        this.debug("Save Options");
    },
    createTrainingView: function createTrainingView() {
        var view = $("#training_view");
        view.append("<h7>Training Orders</h7>");
        var table = $("<table/>");
        view.append(table);
        var count = 0;
        var tr;
        for(var unit in this.attackUnits) {
            if(!this.attackUnits[unit].trainable) {
                continue;
            }
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
        this.drawButton("Save", this.saveTrainOrder, $("#trainview"));
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
    createOverviewView: function createOverviewView() {
        var view = $("#overview_view");
        this.drawButton("Update", this.updateOverview, view);

        view.append("<table id='overview_table'></table>");
        $("#overview_table").append("\
                                    <tr><th>City</th>\
                                    <th>Cash</th><th>Cement</th><th>Food</th><th>Steel</th>\
                                    <th>Jobs</th>\
                                    <th>Units</th>\
                                    </tr>\
                                    <tr id='total'>\
                                    <th>Total</th>\
                                    <th id='cash'>0</th><th id='cement'>0</th>\
                                    <th id='food'>0</th><th id='steel'>0</th>\
                                    <th id='jobs'></th>\
                                    <th id='units'></th>\
                                    </tr>");

        view.append($("<div></div>").addClass("stats").attr("id","stats"));

        this.listen("jobs:update",this.updateOverview);
        this.listen('cities:update',this.updateOverview);
        this.listen('resources:update',this.updateOverview);
        this.listen("stats:update", this.updateStats);

        this.updateOverview();
        this.updateStats();
    },
    updateOverview: function updateOverview() {
        var table = $("#overview_table");
        var total = table.find("#total");
        var conv = this.numberToString;
        if(!this.cities) {
            return;
        }
        var total_res = {};
        var total_units = 0;
        for(var i=0; i<this.cities.length; i++) {
            var city = this.cities[i];
            if(!city || !city.type) {
                continue;
            }
            var el = table.find("#"+city.type);
            if(el.length === 0) {
                total.before("\
                             <tr id='"+city.type+"'>\
                             <th>"+city.type+"</th>\
                             <td id='cash'>0</td><td id='cement'>0</td>\
                             <td id='food'>0</td><td id='steel'>0</td>\
                             <td id='jobs'></td>\
                             <td id='units'></td>\
                             </tr>");
                el = table.find("#"+city.type);
            }
            if(city.resources) {
                $.each(city.resources, function updateOverviewEach(k,v) {
                    var t = total_res[k] || 0;
                    t += parseInt(v,10);
                    total_res[k] = t;
                    el.find("#"+k).html(conv(v));
                });
            }
            if(city.jobs) {
                var b, r, u, d, m;
                b = r = u = d = m = "&nbsp;&nbsp;";
                for(var j=0; j<city.jobs.length; j++) {
                    if(city.jobs[j].queue == "research") { r = "R";}
                    if(city.jobs[j].queue == "building") { b = "B";}
                    if(city.jobs[j].queue == "units") { u = "U";}
                    if(city.jobs[j].queue == "defense_units") { d = "D";}
                    if(city.jobs[j].queue == "march") { m = "M";}
                }
                el.find("#jobs").html("("+city.jobs.length+") "+b+" "+r+" "+u+" "+d+" "+m);
            }
            if(city.units) {
                var units = 0;
                $.each(city.units, function updateOverviewUnits(k) {
                    units += city.units[k];
                });
                total_units += units;
                el.find("#units").html(conv(units));
            }
        }
        $.each(total_res, function createOverviewViewEachTotal(k,v) {
            total.find("#"+k).html(conv(v));
        });
        total.find("#units").html(conv(total_units));
    }
};

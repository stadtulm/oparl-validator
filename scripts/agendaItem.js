// Declaring required variables
let bodyUrl = "http://buergerinfo.ulm.de/oparl/bodies/0001";
let schemaUrl = bodyUrl + "/agendaitems/";
let schema = "https://schema.oparl.org/1.1/AgendaItem";
let followpage = true;
let page = 1;
var agendaItemData = "";

// Get data type per property from OParl schema
$.getJSON(schema, function(oparl_data) {
    target_val_id = oparl_data["properties"].id.type;
    target_val_type = oparl_data["properties"].type.type;
    target_val_meeting = oparl_data["properties"].meeting.type;
    target_val_number = oparl_data["properties"].number.type;
    target_val_order = oparl_data["properties"].order.type;
    target_val_name = oparl_data["properties"].name.type;
    target_val_public = oparl_data["properties"].public.type;
    target_val_consultation = oparl_data["properties"].consultation.type; 
    target_val_result = oparl_data["properties"].result.type;
    target_val_resolutionText = oparl_data["properties"].resolutionText.type;
    target_val_resolutionFile = oparl_data["properties"].resolutionFile.type;
    target_val_auxiliaryFile = oparl_data["properties"].auxiliaryFile.type;
    target_val_auxiliaryFile_item = oparl_data["properties"].auxiliaryFile["items"].type; 
    target_val_start = oparl_data["properties"].start.type;    
    target_val_end = oparl_data["properties"].end.type; 
    target_val_license = oparl_data["properties"].license.type;    
    target_val_keyword = oparl_data["properties"].keyword["items"].type;   
    target_val_created = oparl_data["properties"].created.type;
    target_val_modified = oparl_data["properties"].modified.type;
    target_val_web = oparl_data["properties"].web.type;
    target_val_deleted = oparl_data["properties"].deleted.type;    

    loadPages();

    function loadPages () {
        $.getJSON(schemaUrl + '?page='+page)
        .done(function(data) {
            $(data).each(function(j, array) {
                agendaItemData = $(data["data"]);
                $(array["links"]).each(function(i, links) {
                    if (links.next != undefined) {
                        console.log("true");
                        followpage = true;
                        page += 1
                        getData(agendaItemData);
                        loadPages();       
                    }
                    else {
                        console.log("false");
                        followpage = false;
                        getData(agendaItemData);
                    }
                });
            });            
        });
    };

    function getData (agendaItemData) {
    // Go through the pages of the agendaItem objects until there is no following page
        try {
            // Retrieve and process JSON objects of the respective page
            $(agendaItemData).each(function(i, agendaItem) {
                // Declare variables for check result and message for wrong data
                let match = "ja";
                let incorrect = "";
                // Determine data type of the respective information
                actual_val_id = typeof agendaItem.id;
                actual_val_type = typeof agendaItem.type;
                actual_val_meeting = typeof agendaItem.meeting;
                actual_val_number = typeof agendaItem.number;
                actual_val_order = typeof agendaItem.order;
                actual_val_name = typeof agendaItem.name; 
                actual_val_public = typeof agendaItem.public;    
                actual_val_consultation = typeof agendaItem.consultation;
                actual_val_result = typeof agendaItem.result;
                actual_val_resolutionText = typeof agendaItem.resolutionText;
                actual_val_resolutionFile = typeof agendaItem.resolutionFile;
                actual_val_auxiliaryFile = typeof agendaItem.auxiliaryFile;
                actual_val_start = typeof agendaItem.start;
                actual_val_end = typeof agendaItem.end;
                actual_val_license = typeof agendaItem.license;
                actual_val_keyword = typeof agendaItem.keyword;
                actual_val_created = typeof agendaItem.created;
                actual_val_modified = typeof agendaItem.modified;
                actual_val_web = typeof agendaItem.web;
                actual_val_deleted = typeof agendaItem.deleted;
                // Convert the created and modified string into date format
                agendaItem_created = new Date(agendaItem.created);
                agendaItem_modified = new Date(agendaItem.modified);
                agendaItem_start = new Date(agendaItem.start);
                agendaItem_end = new Date(agendaItem.end);
                // In arrays get the data type of the first element, if the array exists
                if (actual_val_auxiliaryFile != "undefined") {
                    actual_val_auxiliaryFile = typeof agendaItem.auxiliaryFile[0];
                };
                if (actual_val_keyword != "undefined") {
                    actual_val_keyword = typeof agendaItem.keyword[0];
                };
                if (actual_val_order == "string") {
                    if (isNaN == true) {
                        incorrect = incorrect.concat("Order: falscher Typ;<br>");
                    }
                }
                /*  Checks mandatory and self-defined target fields for existing entry and the intended data type.
                    For optional fields that were only partially present or not present in the development cycle system, 
                    only the corresponding data type is checked if the information is present in the JSON object 
                    In case of deviations from the specifications, the "Match" result of the entire check of a agendaItem is 
                    set to no and the corresponding message is added to the error string.*/
                if ((actual_val_id != target_val_id) || (agendaItem.id.length == 0)) {
                    match = "nein";
                    if (actual_val_id != target_val_id) {
                        incorrect = incorrect.concat("ID: falscher Typ;<br>");
                    };
                    if (agendaItem.id.length == 0) {
                        incorrect = incorrect.concat("ID: Keine ID;<br>");
                    };
                };
                if ((actual_val_type != target_val_type) || (agendaItem.type != schema)) {
                    match = "nein";
                    if (actual_val_type != target_val_type) {
                        incorrect = incorrect.concat("Typ: falscher Typ;<br>");
                    };
                    if (agendaItem.type != schema) {
                        incorrect = incorrect.concat("Typ: Inkorrektes Schema;<br>");
                    };
                };
                if ((actual_val_meeting != target_val_meeting) || (agendaItem.meeting.length == 0)) {
                    match = "nein";
                    if (actual_val_meeting != target_val_meeting) {
                        incorrect = incorrect.concat("Meeting: falscher Typ;<br>");
                    };
                    if (agendaItem.name.length == 0) {
                        incorrect = incorrect.concat("Meeting: Kein Meeting;<br>");
                    };
                };
                if ((actual_val_number != target_val_number) || (agendaItem.number.length == 0)) {
                    match = "nein";
                    if (actual_val_number != target_val_number) {
                        incorrect = incorrect.concat("Nummer: falscher Typ;<br>");
                    };
                    if (agendaItem.number.length == 0) {
                        incorrect = incorrect.concat("Nummer: Keine Nummer;<br>");
                    };
                };
                if ((actual_val_order != target_val_order) || (agendaItem.order.length == 0)) {
                    match = "nein";
                    if (actual_val_order != target_val_order) {
                        incorrect = incorrect.concat("Order: falscher Typ;<br>");
                    };
                    if (agendaItem.order.length == 0) {
                        incorrect = incorrect.concat("Order: Keine Order;<br>");
                    };
                };
                if ((actual_val_name != target_val_name) || (agendaItem.name.length == 0)) {
                    match = "nein";
                    if (actual_val_name != target_val_name) {
                        incorrect = incorrect.concat("Name: falscher Typ;<br>");
                    };
                    if (agendaItem.name.length == 0) {
                        incorrect = incorrect.concat("Name: Kein Name;<br>");
                    };
                };      
                if ((actual_val_public != target_val_public) || (agendaItem.public.length == 0)) {
                    match = "nein";
                    if (actual_val_public != target_val_public) {
                        incorrect = incorrect.concat("&Öuml;ffentlich: falscher Typ;<br>");
                    };
                    if (agendaItem.public.length == 0) {
                        incorrect = incorrect.concat("&Ouml;ffentlich: Kein &Ouml;ffentlichkeitsstatus;<br>");
                    };
                };
                if (agendaItem.consultation != undefined && (actual_val_consultation != target_val_consultation)) {
                    match = "nein";
                    incorrect = incorrect.concat("Besprechung: falscher Typ;<br>");
                } else if (agendaItem.consultation == undefined) {
                    agendaItem.consultation = [""];
                };
                if (agendaItem.result != undefined && (actual_val_result != target_val_result)) {
                    match = "nein";
                    incorrect = incorrect.concat("Ergebnis: falscher Typ;<br>");
                };
                if (agendaItem.resolutionText != undefined && (actual_val_resolutionText != target_val_resolutionText)) {
                    match = "nein";
                    incorrect = incorrect.concat("L&ouml;sungstext: falscher Typ;<br>");
                };
                if (agendaItem.resolutionFile != undefined && (actual_val_resolutionFile != target_val_resolutionFile)) {
                    match = "nein";
                    incorrect = incorrect.concat("L&ouml;sungsdatei: falscher Typ;<br>");
                };
                if (agendaItem.auxiliaryFile != undefined && (actual_val_auxiliaryFile != target_val_auxiliaryFile_item)) {
                    match = "nein";
                    incorrect = incorrect.concat("Hilfsdatei: falscher Typ;<br>");
                };
                if (agendaItem.start != undefined && (actual_val_start != target_val_start)) {
                    match = "nein";
                    incorrect = incorrect.concat("Start: falscher Typ;<br>");
                };
                if (agendaItem.end != undefined && (actual_val_end != target_val_end)) {
                    match = "nein";
                    incorrect = incorrect.concat("Ende: falscher Typ;<br>");
                };
                if (agendaItem.license != undefined && (actual_val_license != target_val_license)) {
                    match = "nein";
                    incorrect = incorrect.concat("Lizenz: falscher Typ;<br>");
                };
                if (agendaItem["keyword"] != undefined && (actual_val_keyword != target_val_keyword)) {
                    match = "nein";
                    incorrect = incorrect.concat("Ortsobjekt: falscher Typ;<br>");
                };
                if ((agendaItem.created != undefined && (actual_val_created != target_val_created)) || (agendaItem_created instanceof Date == false)) {
                    match = "nein";
                    if (actual_val_created != target_val_created) {
                        incorrect = incorrect.concat("Erstelldatum: falscher Typ;<br>");
                    };
                    if (agendaItem_created instanceof Date == false) {
                        incorrect = incorrect.concat("Erstelldatum: kein Datumsformat;<br>");
                    };                      
                };
                if ((agendaItem.modified != undefined && (actual_val_modified != target_val_modified)) || (agendaItem_modified instanceof Date == false)) {
                    match = "nein";
                    if (actual_val_modified != target_val_modified) {
                        incorrect = incorrect.concat("&Auml;nderungsdatum: falscher Typ;<br>");
                    };
                    if (agendaItem_modified instanceof Date == false) {
                        incorrect = incorrect.concat("&Auml;nderungsdatum: kein Datumsformat;<br>");
                    };                        
                };
                if (agendaItem.web != undefined && (actual_val_web != target_val_web)) {
                    match = "nein";
                    incorrect = incorrect.concat("Web: falscher Typ;<br>");
                };
                if (agendaItem.deleted != undefined && (actual_val_deleted != target_val_deleted)) {
                    match = "nein";
                    incorrect = incorrect.concat("Gel&ouml;scht: falscher Typ;<br>");
                };

                // Output of selected information with result and error to the table with ID "agendaItemBody" for clear presentation.
                if (match == "ja") {
                    $('#agendaItemBody').append($("<tr>")
                    .append($("<td onclick='location.href=`" + agendaItem.id + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(agendaItem.id.slice(56))).append("</td>")
                    .append($("<td>").append(agendaItem.name)).append("</td>")
                    .append($("<td onclick='location.href=`" + agendaItem.meeting + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(agendaItem.meeting.slice(53))).append("</td>")
                    .append($("<td>").append(agendaItem.number)).append("</td>")
                    .append($("<td>").append(agendaItem.order)).append("</td>")
                    .append($("<td>").append(agendaItem.result)).append("</td>")
                    .append($("<td onclick='location.href=`" + agendaItem.consultation + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(agendaItem.consultation.slice(58))).append("</td>")
                    .append($("<td>").append(agendaItem.public)).append("</td>")
                    .append($("<td>").append(match)).append("</td>")
                    .append($("<td>").append(incorrect)).append("</td>")
                    .append("</tr>"));
                }
                if (match == "nein") {
                    $('#agendaItemBody').append($("<tr style='background-color: #FF6F6C'>")
                    .append($("<td onclick='location.href=`" + agendaItem.id + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(agendaItem.id.slice(56))).append("</td>")
                    .append($("<td>").append(agendaItem.name)).append("</td>")
                    .append($("<td onclick='location.href=`" + agendaItem.meeting + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(agendaItem.meeting.slice(53))).append("</td>")
                    .append($("<td>").append(agendaItem.number)).append("</td>")
                    .append($("<td>").append(agendaItem.order)).append("</td>")
                    .append($("<td>").append(agendaItem.result)).append("</td>")
                    .append($("<td onclick='location.href=`" + agendaItem.consultation + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(agendaItem.consultation.slice(58))).append("</td>")
                    .append($("<td>").append(agendaItem.public)).append("</td>")
                    .append($("<td>").append(match)).append("</td>")
                    .append($("<td>").append(incorrect)).append("</td>")
                    .append("</tr>"));
                }
            });
            // Subsequent functions with possible outputs to the user
            /*.done(function(){
                //alert("Completed");
            })
            .fail(function(e){
                //alert("error:" + e);
                console.error(e);
            })
            .always(function(){
                //alert("always runs");
            });*/
        } catch (e) {
            //break;
        }
    }
});
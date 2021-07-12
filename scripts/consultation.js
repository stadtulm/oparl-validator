// Declaring required variables
let bodyUrl = "http://buergerinfo.ulm.de/oparl/bodies/0001";
let schemaUrl = bodyUrl + "/consultations";
let schema = "https://schema.oparl.org/1.1/Consultation";
let followpage = true;
let page = 1;
var consultationData = "";

// Get data type per property from OParl schema
$.getJSON(schema) 
.done(function(oparl_data) {
    target_val_id = oparl_data["properties"].id.type;
    target_val_type = oparl_data["properties"].type.type;
    target_val_paper = oparl_data["properties"].paper.type;
    target_val_agendaItem = oparl_data["properties"].agendaItem.type;
    target_val_meeting = oparl_data["properties"].meeting.type;
    target_val_organization = oparl_data["properties"].organization.type;
    target_val_organization_item = oparl_data["properties"].organization["items"].type; 
    target_val_authoritative = oparl_data["properties"].authoritative.type;
    target_val_role = oparl_data["properties"].role.type;
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
                consultationData = $(data["data"]);
                $(array["links"]).each(function(i, links) {
                    if (links.next != undefined) {
                        console.log("true");
                        followpage = true;
                        page += 1
                        getData(consultationData);
                        loadPages();       
                    }
                    else {
                        console.log("false");
                        followpage = false;
                        getData(consultationData);
                    }
                });
            });            
        });
    };

    function getData (consultationData) {
    // Go through the pages of the consultation objects until there is no following page
        try {
            // Retrieve and process JSON objects of the respective page
            $(consultationData).each(function(i, consultation) {
                // Declare variables for check result and message for wrong data
                let match = "ja";
                let incorrect = "";
                // Determine data type of the respective information
                actual_val_id = typeof consultation.id;
                actual_val_type = typeof consultation.type;
                actual_val_paper = typeof consultation.paper;
                actual_val_agendaItem = typeof consultation.agendaItem;
                actual_val_meeting = typeof consultation.meeting;
                actual_val_organization = typeof consultation.organization; 
                actual_val_authoritative = typeof consultation.authoritative;
                actual_val_role = typeof consultation.role;
                actual_val_license = typeof consultation.license;
                actual_val_keyword = typeof consultation.keyword;
                actual_val_created = typeof consultation.created;
                actual_val_modified = typeof consultation.modified;
                actual_val_web = typeof consultation.web;
                actual_val_deleted = typeof consultation.deleted;
                // Convert the created and modified string into date format
                consultation_created = new Date(consultation.created);
                consultation_modified = new Date(consultation.modified);
                // In arrays get the data type of the first element, if the array exists
                if (actual_val_organization != "undefined") {
                    actual_val_organization = typeof consultation.organization[0];
                    if (consultation.organization[0] == undefined) {
                        consultation.organization[0] = "";
                    };
                };
                if (actual_val_keyword != "undefined") {
                    actual_val_keyword = typeof consultation.keyword[0];
                };
                /*  Checks mandatory and self-defined target fields for existing entry and the intended data type.
                    For optional fields that were only partially present or not present in the development cycle system, 
                    only the corresponding data type is checked if the information is present in the JSON object 
                    In case of deviations from the specifications, the "Match" result of the entire check of a consultation is 
                    set to no and the corresponding message is added to the error string.*/
                if ((actual_val_id != target_val_id) || (consultation.id.length == 0)) {
                    match = "nein";
                    if (actual_val_id != target_val_id) {
                        incorrect = incorrect.concat("ID: falscher Typ;<br>");
                    };
                    if (consultation.id.length == 0) {
                        incorrect = incorrect.concat("ID: Keine ID;<br>");
                    };
                };
                if ((actual_val_type != target_val_type) || (consultation.type != schema)) {
                    match = "nein";
                    if (actual_val_type != target_val_type) {
                        incorrect = incorrect.concat("Typ: falscher Typ;<br>");
                    };
                    if (consultation.type != schema) {
                        incorrect = incorrect.concat("Typ: Inkorrektes Schema;<br>");
                    };
                };
                if (consultation.paper != undefined && (actual_val_paper != target_val_paper)) {
                    match = "nein";
                    incorrect = incorrect.concat("Paper: falscher Typ;<br>");
                };
                if (consultation.agendaItem != undefined && (actual_val_agendaItem != target_val_agendaItem)) {
                    match = "nein";
                    incorrect = incorrect.concat("Agendapunkt: falscher Typ;<br>");
                };
                if (consultation.meeting != undefined && (actual_val_meeting != target_val_meeting)) {
                    match = "nein";
                    incorrect = incorrect.concat("Meeting: falscher Typ;<br>");
                };
                if (consultation.organization != undefined && (actual_val_organization != target_val_organization_item)) {
                    match = "nein";
                    incorrect = incorrect.concat("Organisation: falscher Typ;<br>");
                };
                if (consultation.authoritative != undefined && (actual_val_authoritative != target_val_authoritative)) {
                    match = "nein";
                    incorrect = incorrect.concat("Verbindlichkeit: falscher Typ;<br>");
                };
                if (consultation.role != undefined && (actual_val_role != target_val_role)) {
                    match = "nein";
                    incorrect = incorrect.concat("Rolle: falscher Typ;<br>");
                };
                if (consultation.license != undefined && (actual_val_license != target_val_license)) {
                    match = "nein";
                    incorrect = incorrect.concat("Lizenz: falscher Typ;<br>");
                };
                if (consultation["keyword"] != undefined && (actual_val_keyword != target_val_keyword)) {
                    match = "nein";
                    incorrect = incorrect.concat("Ortsobjekt: falscher Typ;<br>");
                };
                if ((consultation.created != undefined && (actual_val_created != target_val_created)) || (consultation_created instanceof Date == false)) {
                    match = "nein";
                    if (actual_val_created != target_val_created) {
                        incorrect = incorrect.concat("Erstelldatum: falscher Typ;<br>");
                    };
                    if (consultation_created instanceof Date == false) {
                        incorrect = incorrect.concat("Erstelldatum: kein Datumsformat;<br>");
                    };                      
                };
                if ((consultation.modified != undefined && (actual_val_modified != target_val_modified)) || (consultation_modified instanceof Date == false)) {
                    match = "nein";
                    if (actual_val_modified != target_val_modified) {
                        incorrect = incorrect.concat("&Auml;nderungsdatum: falscher Typ;<br>");
                    };
                    if (consultation_modified instanceof Date == false) {
                        incorrect = incorrect.concat("&Auml;nderungsdatum: kein Datumsformat;<br>");
                    };                        
                };
                if (consultation.web != undefined && (actual_val_web != target_val_web)) {
                    match = "nein";
                    incorrect = incorrect.concat("Web: falscher Typ;<br>");
                };
                if (consultation.deleted != undefined && (actual_val_deleted != target_val_deleted)) {
                    match = "nein";
                    incorrect = incorrect.concat("Gel&ouml;scht: falscher Typ;<br>");
                };

                // Output of selected information with result and error to the table with ID "consultationBody" for clear presentation.
                if (match == "ja") {
                    $('#consultationBody').append($("<tr>")
                    .append($("<td onclick='location.href=`" + consultation.id + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(consultation.id.slice(58))).append("</td>")
                    .append($("<td onclick='location.href=`" + consultation.organization + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(consultation.organization[0].slice(61))).append("</td>")
                    .append($("<td onclick='location.href=`" + consultation.meeting + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(consultation.meeting.slice(53))).append("</td>")
                    .append($("<td onclick='location.href=`" + consultation.agendaItem + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(consultation.agendaItem.slice(56))).append("</td>")
                    .append($("<td onclick='location.href=`" + consultation.paper + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(consultation.paper.slice(54))).append("</td>")
                    .append($("<td>").append(consultation.role)).append("</td>")
                    .append($("<td>").append(consultation.authoritative)).append("</td>")
                    .append($("<td>").append(match)).append("</td>")
                    .append($("<td>").append(incorrect)).append("</td>")
                    .append("</tr>"));
                }
                if (match == "nein") {
                    $('#consultationBody').append($("<tr style='background-color: #FF6F6C'>")
                    .append($("<td onclick='location.href=`" + consultation.id + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(consultation.id.slice(58))).append("</td>")
                    .append($("<td onclick='location.href=`" + consultation.organization + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(consultation.organization[0].slice(61))).append("</td>")
                    .append($("<td onclick='location.href=`" + consultation.meeting + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(consultation.meeting.slice(53))).append("</td>")
                    .append($("<td onclick='location.href=`" + consultation.agendaItem + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(consultation.agendaItem.slice(56))).append("</td>")
                    .append($("<td onclick='location.href=`" + consultation.paper + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(consultation.paper.slice(54))).append("</td>")
                    .append($("<td>").append(consultation.role)).append("</td>")
                    .append($("<td>").append(consultation.authoritative)).append("</td>")
                    .append($("<td>").append(match)).append("</td>")
                    .append($("<td>").append(incorrect)).append("</td>")
                    .append("</tr>"));
                }
            });
            // Subsequent functions with possible outputs to the user
            //.fail(function(e){
                //alert("error:" + e);
                //console.error(e);
            //})
            /*.always(function(){
                //alert("always runs");
            });*/
        } catch (e) {
            //break;
        };
    };
});
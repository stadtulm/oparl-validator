// Declaring required variables
let bodyUrl = "http://buergerinfo.ulm.de/oparl/bodies/0001";
let schemaUrl = bodyUrl + "/meetings/";
let schema = "https://schema.oparl.org/1.1/Meeting";
let followpage = true;
let page = 1;
var meetingData = "";

// Get data type per property from OParl schema
$.getJSON(schema, function(oparl_data) {
    target_val_id = oparl_data["properties"].id.type;
    target_val_type = oparl_data["properties"].type.type;
    target_val_name = oparl_data["properties"].name.type;
    target_val_meetingstate = oparl_data["properties"].meetingState.type;
    target_val_cancelled = oparl_data["properties"].cancelled.type;
    target_val_start = oparl_data["properties"].start.type;
    target_val_end = oparl_data["properties"].end.type;
    target_val_location = oparl_data["properties"].location.type; 
    target_val_organization = oparl_data["properties"].organization.type;
    target_val_organization_item = oparl_data["properties"].organization["items"].type;
    target_val_participant = oparl_data["properties"].participant.type;
    target_val_participant_item = oparl_data["properties"].participant["items"].type;
    target_val_invitation = oparl_data["properties"].invitation.type;
    target_val_resultsProtocol = oparl_data["properties"].resultsProtocol.type;
    target_val_verbatimProtocol = oparl_data["properties"].verbatimProtocol.type;    
    target_val_auxiliaryFile = oparl_data["properties"].auxiliaryFile.type; 
    target_val_auxiliaryFile_item = oparl_data["properties"].auxiliaryFile["items"].type;    
    target_val_agendaItem = oparl_data["properties"].agendaItem.type;
    target_val_agendaItem_item = oparl_data["properties"].agendaItem["items"].type;
    target_val_license = oparl_data["properties"].license.type;    
    target_val_keyword = oparl_data["properties"].keyword.type;
    target_val_keyword_item = oparl_data["properties"].keyword["items"].type;   
    target_val_created = oparl_data["properties"].created.type;
    target_val_modified = oparl_data["properties"].modified.type;
    target_val_web = oparl_data["properties"].web.type;
    target_val_deleted = oparl_data["properties"].deleted.type;    

    loadPages();

    function loadPages () {
        $.getJSON(schemaUrl + '?page='+page)
        .done(function(data) {
            $(data).each(function(j, array) {
                meetingData = $(data["data"]);
                $(array["links"]).each(function(i, links) {
                    if (links.next != undefined) {
                        console.log("true");
                        followpage = true;
                        page += 1
                        getData(meetingData);
                        loadPages();       
                    }
                    else {
                        console.log("false");
                        followpage = false;
                        getData(meetingData);
                    }
                });
            });            
        });
    };
    
    function getData (meetingData) {
    // Go through the pages of the meeting objects until there is no following page
        try {
            // Retrieve and process JSON objects of the respective page
            $(meetingData).each(function(i, meeting) {
                // Declare variables for check result and message for wrong data
                let match = "ja";
                let incorrect = "";
                // Determine data type of the respective information
                actual_val_id = typeof meeting.id;
                actual_val_type = typeof meeting.type;
                actual_val_name = typeof meeting.name;
                actual_val_meetingState = typeof meeting.meetingState;
                actual_val_cancelled = typeof meeting.cancelled;
                actual_val_start = typeof meeting.start; 
                actual_val_end = typeof meeting.end;    
                actual_val_location = typeof meeting.location;                              
                actual_val_organization = typeof meeting.organization;
                actual_val_participant = typeof meeting.participant;
                actual_val_invitation = typeof meeting.invitation;                    
                actual_val_resultsProtocol = typeof meeting.resultsProtocol;
                actual_val_verbatimProtocol = typeof meeting.verbatimProtocol;
                actual_val_auxiliaryFile = typeof meeting.auxiliaryFile;
                actual_val_agendaItem = typeof meeting.agendaItem;
                actual_val_license = typeof meeting.license;
                actual_val_keyword = typeof meeting.keyword;
                actual_val_created = typeof meeting.created;
                actual_val_modified = typeof meeting.modified;
                actual_val_web = typeof meeting.web;
                actual_val_deleted = typeof meeting.deleted;
                // Convert the created and modified string into date format
                meeting_created = new Date(meeting.created);
                meeting_modified = new Date(meeting.modified);
                meeting.start = new Date(meeting.start);
                meeting.end = new Date(meeting.end);
                // In arrays get the data type of the first element, if the array exists
                if (actual_val_organization != "undefined") {
                    actual_val_organization = typeof meeting.organization[0];
                };
                if (actual_val_participant != "undefined") {
                    actual_val_participant = typeof meeting.participant[0];
                };
                if (actual_val_auxiliaryFile != "undefined") {
                    actual_val_auxiliaryFile = typeof meeting.auxiliaryFile[0];
                };
                if (actual_val_agendaItem != "undefined") {
                    actual_val_agendaItem = typeof meeting.agendaItem[0];
                };
                if (actual_val_keyword != "undefined") {
                    actual_val_keyword = typeof meeting.keyword[0];
                };
                /*  Checks mandatory and self-defined target fields for existing entry and the intended data type.
                    For optional fields that were only partially present or not present in the development cycle system, 
                    only the corresponding data type is checked if the information is present in the JSON object 
                    In case of deviations from the specifications, the "Match" result of the entire check of a meeting is 
                    set to no and the corresponding message is added to the error string.*/
                if ((actual_val_id != target_val_id) || (meeting.id.length == 0)) {
                    match = "nein";
                    if (actual_val_id != target_val_id) {
                        incorrect = incorrect.concat("ID: falscher Typ;<br>");
                    };
                    if (meeting.id.length == 0) {
                        incorrect = incorrect.concat("ID: Keine ID;<br>");
                    };
                };
                if ((actual_val_type != target_val_type) || (meeting.type != schema)) {
                    match = "nein";
                    if (actual_val_type != target_val_type) {
                        incorrect = incorrect.concat("Typ: falscher Typ;<br>");
                    };
                    if (meeting.type != schema) {
                        incorrect = incorrect.concat("Typ: Inkorrektes Schema;<br>");
                    };
                };
                if ((actual_val_name != target_val_name) || (meeting.name.length == 0)) {
                    match = "nein";
                    if (actual_val_name != target_val_name) {
                        incorrect = incorrect.concat("Name: falscher Typ;<br>");
                    };
                    if (meeting.name.length == 0) {
                        incorrect = incorrect.concat("Name: Kein Name;<br>");
                    };
                };
                if (meeting.meetingState != undefined && (actual_val_meetingState != target_val_meetingstate)) {
                    match = "nein";
                    incorrect = incorrect.concat("Meetingstatus: falscher Typ;<br>");
                };  
                if (meeting.cancelled != undefined && (actual_val_cancelled != target_val_cancelled)) {
                    match = "nein";
                    incorrect = incorrect.concat("Abgesagt: falscher Typ;<br>");
                };  
                if ((meeting.start != undefined && (actual_val_start != target_val_start)) || (meeting.start instanceof Date == false)) {
                    match = "nein";
                    if (actual_val_start != target_val_start) {
                        incorrect = incorrect.concat("Startzeit: falscher Typ;<br>");
                    };
                    if (meeting.start instanceof Date == false) {
                        incorrect = incorrect.concat("Startzeit: kein Datumsformat;<br>");
                    };                      
                };
                if ((meeting.end != undefined && (actual_val_end != target_val_end)) || (meeting.end instanceof Date == false)) {
                    match = "nein";
                    if (actual_val_end != target_val_end) {
                        incorrect = incorrect.concat("Endzeit: falscher Typ;<br>");
                    };
                    if (meeting.end instanceof Date == false) {
                        incorrect = incorrect.concat("Endzeit: kein Datumsformat;<br>");
                    };                      
                };
                if (meeting.location != undefined && (actual_val_location != target_val_location)) {
                    match = "nein";
                    incorrect = incorrect.concat("Ort: falscher Typ;<br>");
                };
                if ((actual_val_organization != target_val_organization_item) || (meeting.organization.length == 0)) {
                    match = "nein";
                    if (actual_val_organization != target_val_organization_item) {
                        incorrect = incorrect.concat("Organisationseinheit: falscher Typ;<br>");
                    };
                    if (meeting.organization.length == 0) {
                        incorrect = incorrect.concat("Organisationseinheit: Keine Organisationseinheit;<br>");
                    };
                };
                if (meeting.participant != undefined && (actual_val_participant != target_val_participant_item)) {
                    match = "nein";
                    incorrect = incorrect.concat("Teilnehmer: falscher Typ;<br>");
                };
                if (meeting.invitation != undefined && (actual_val_invitation != target_val_invitation)) {
                    match = "nein";
                    incorrect = incorrect.concat("Einladung: falscher Typ;<br>");
                };
                if (meeting.resultsProtocol != undefined && (actual_val_resultsProtocol != target_val_resultsProtocol)) {
                    match = "nein";
                    incorrect = incorrect.concat("Ergebnisprotokoll: falscher Typ;<br>");
                };
                if (meeting.verbatimProtocol != undefined && (actual_val_verbatimProtocol != target_val_verbatimProtocol)) {
                    match = "nein";
                    incorrect = incorrect.concat("Wortprotokoll: falscher Typ;<br>");
                };
                if (meeting.auxiliaryFile != undefined && (actual_val_auxiliaryFile != target_val_auxiliaryFile_item)) {
                    match = "nein";
                    incorrect = incorrect.concat("Hilfsdateien: falscher Typ;<br>");
                };
                if (meeting.agendaItem != undefined && (actual_val_agendaItem != target_val_agendaItem_item)) {
                    match = "nein";
                    incorrect = incorrect.concat("Agendapunkt: falscher Typ;<br>");
                };
                if (meeting.license != undefined && (actual_val_license != target_val_license)) {
                    match = "nein";
                    incorrect = incorrect.concat("Lizenz: falscher Typ;<br>");
                };
                if (meeting["keyword"] != undefined && (actual_val_keyword != target_val_keyword_item)) {
                    match = "nein";
                    incorrect = incorrect.concat("Ortsobjekt: falscher Typ;<br>");
                };
                if ((meeting.created != undefined && (actual_val_created != target_val_created)) || (meeting_created instanceof Date == false)) {
                    match = "nein";
                    if (actual_val_created != target_val_created) {
                        incorrect = incorrect.concat("Erstelldatum: falscher Typ;<br>");
                    };
                    if (meeting_created instanceof Date == false) {
                        incorrect = incorrect.concat("Erstelldatum: kein Datumsformat;<br>");
                    };                      
                };
                if ((meeting.modified != undefined && (actual_val_modified != target_val_modified)) || (meeting_modified instanceof Date == false)) {
                    match = "nein";
                    if (actual_val_modified != target_val_modified) {
                        incorrect = incorrect.concat("&Auml;nderungsdatum: falscher Typ;<br>");
                    };
                    if (meeting_modified instanceof Date == false) {
                        incorrect = incorrect.concat("&Auml;nderungsdatum: kein Datumsformat;<br>");
                    };                        
                };
                if (meeting.web != undefined && (actual_val_web != target_val_web)) {
                    match = "nein";
                    incorrect = incorrect.concat("Web: falscher Typ;<br>");
                };
                if (meeting.deleted != undefined && (actual_val_deleted != target_val_deleted)) {
                    match = "nein";
                    incorrect = incorrect.concat("Gel&ouml;scht: falscher Typ;<br>");
                };

                // Output of selected information with result and error to the table with ID "meetingBody" for clear presentation.
                if (match == "ja") {
                    $('#meetingBody').append($("<tr>")
                    .append($("<td onclick='location.href=`" + meeting.id + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(meeting.id.slice(53))).append("</td>")
                    .append($("<td>").append(meeting.name)).append("</td>")
                    .append($("<td onclick='location.href=`" + meeting.organization + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(meeting.organization[0].slice(61))).append("</td>")
                    .append($("<td>").append(meeting.start.toLocaleDateString('de-De') + "<br>" + meeting.start.toLocaleTimeString('de-DE') + " Uhr")).append("</td>")
                    .append($("<td>").append(meeting.end.toLocaleDateString('de-De') + "<br>" + meeting.end.toLocaleTimeString('de-DE') + "Uhr")).append("</td>")
                    .append($("<td>").append(meeting.location.description)).append("</td>")
                    .append($("<td>").append(match)).append("</td>")
                    .append($("<td>").append(incorrect)).append("</td>")
                    .append("</tr>"));
                }
                if (match == "nein") {
                    $('#meetingBody').append($("<tr style='background-color: #FF6F6C'>")
                    .append($("<td onclick='location.href=`" + meeting.id + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(meeting.id.slice(53))).append("</td>")
                    .append($("<td>").append(meeting.name)).append("</td>")
                    .append($("<td onclick='location.href=`" + meeting.organization + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(meeting.organization[0].slice(61))).append("</td>")
                    .append($("<td>").append(meeting.start.toLocaleDateString('de-De') + "<br>" + meeting.start.toLocaleTimeString('de-DE') + " Uhr")).append("</td>")
                    .append($("<td>").append(meeting.end.toLocaleDateString('de-De') + "<br>" + meeting.end.toLocaleTimeString('de-DE') + "Uhr")).append("</td>")
                    .append($("<td>").append(meeting.location.description)).append("</td>")
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
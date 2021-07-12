// Declaring required variables
let bodyUrl = "http://buergerinfo.ulm.de/oparl/bodies/0001";
let schemaUrl = bodyUrl + "/memberships/";
let schema = "https://schema.oparl.org/1.1/Membership";
let followpage = true;
let page = 1;
var membershipData = "";

// Get data type per property from OParl schema
$.getJSON(schema, function(oparl_data) {
    target_val_id = oparl_data["properties"].id.type;
    target_val_type = oparl_data["properties"].type.type;
    target_val_person = oparl_data["properties"].person.type;
    target_val_organization = oparl_data["properties"].organization.type;
    target_val_role = oparl_data["properties"].role.type;
    target_val_votingRight = oparl_data["properties"].votingRight.type;
    target_val_startDate = oparl_data["properties"].startDate.type;
    target_val_endDate = oparl_data["properties"].endDate.type; 
    target_val_onBehalfOf = oparl_data["properties"].onBehalfOf.type;
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
                membershipData = $(data["data"]);
                $(array["links"]).each(function(i, links) {
                    if (links.next != undefined) {
                        console.log("true");
                        followpage = true;
                        page += 1
                        getData(membershipData);
                        loadPages();       
                    }
                    else {
                        console.log("false");
                        followpage = false;
                        getData(membershipData);
                    }
                });
            });            
        });
    };

    function getData (membershipData) {
    // Go through the pages of the membership objects until there is no following page
        try {
            // Retrieve and process JSON objects of the respective page
            $(membershipData).each(function(i, membership) {
                // Declare variables for check result and message for wrong data
                let match = "ja";
                let incorrect = "";
                // Determine data type of the respective information
                actual_val_id = typeof membership.id;
                actual_val_type = typeof membership.type;
                actual_val_person = typeof membership.person;
                actual_val_organization = typeof membership.organization;
                actual_val_role = typeof membership.role;
                actual_val_votingRight = typeof membership.votingRight; 
                actual_val_startDate = typeof membership.startDate;
                actual_val_endDate = typeof membership.endDate; 
                actual_val_onBehalfOf = typeof membership.onBehalfOf;
                actual_val_license = typeof membership.license;
                actual_val_keyword = typeof membership.keyword;
                actual_val_created = typeof membership.created;
                actual_val_modified = typeof membership.modified;
                actual_val_web = typeof membership.web;
                actual_val_deleted = typeof membership.deleted;
                // Convert the created and modified string into date format
                membership_created = new Date(membership.created);
                membership_modified = new Date(membership.modified);
                membership_startDate = new Date(membership.startDate);
                membership_endDate = new Date(membership.endDate);
                // In arrays get the data type of the first element, if the array exists
                if (actual_val_keyword != "undefined") {
                    actual_val_keyword = typeof membership.keyword[0];
                };
                /*  Checks mandatory and self-defined target fields for existing entry and the intended data type.
                    For optional fields that were only partially present or not present in the development cycle system, 
                    only the corresponding data type is checked if the information is present in the JSON object 
                    In case of deviations from the specifications, the "Match" result of the entire check of a membership is 
                    set to no and the corresponding message is added to the error string.*/
                //console.log(target_val_id);
                if ((actual_val_id != target_val_id) || (membership.id.length == 0)) {
                    match = "nein";
                    if (actual_val_id != target_val_id) {
                        incorrect = incorrect.concat("ID: falscher Typ;<br>");
                    };
                    if (membership.id.length == 0) {
                        incorrect = incorrect.concat("ID: Keine ID;<br>");
                    };
                };
                if ((actual_val_type != target_val_type) || (membership.type != schema)) {
                    match = "nein";
                    if (actual_val_type != target_val_type) {
                        incorrect = incorrect.concat("Typ: falscher Typ;<br>");
                    };
                    if (membership.type != schema) {
                        incorrect = incorrect.concat("Typ: Inkorrektes Schema;<br>");
                    };
                };
                if ((actual_val_person != target_val_person) || (membership.person.length == 0)) {
                    match = "nein";
                    if (actual_val_person != target_val_person) {
                        incorrect = incorrect.concat("Person: falscher Typ;<br>");
                    };
                    if (membership.person.length == 0) {
                        incorrect = incorrect.concat("Person: Kein Name;<br>");
                    };
                };
                if ((actual_val_organization != target_val_organization) || (membership.organization.length == 0)) {
                    match = "nein";
                    if (actual_val_organization != target_val_organization) {
                        incorrect = incorrect.concat("Organisation: falscher Typ;<br>");
                    };
                    if (membership.organization.length == 0) {
                        incorrect = incorrect.concat("Organisation: Kein Nachname;<br>");
                    };
                };
                if (membership.role != undefined && (actual_val_role != target_val_role)) {
                    match = "nein";
                    incorrect = incorrect.concat("Rolle: falscher Typ;<br>");
                };
                if (membership.votingRight != undefined && (actual_val_votingRight != target_val_votingRight)) {
                    match = "nein";
                    incorrect = incorrect.concat("Abstimmungsrecht: falscher Typ;<br>");
                };
                if ((membership.startDate != undefined && (actual_val_startDate != target_val_startDate)) || (membership_startDate instanceof Date == false)) {
                    match = "nein";
                    if (actual_val_startDate != target_val_startDate) {
                        incorrect = incorrect.concat("Startdatum: falscher Typ;<br>");
                    };
                    if (membership_startDate instanceof Date == false) {
                        incorrect = incorrect.concat("Startdatum: kein Datumsformat;<br>");
                    };                      
                };
                if ((membership.endDate != undefined && (actual_val_endDate != target_val_endDate)) || (membership_endDate instanceof Date == false)) {
                    match = "nein";
                    if (actual_val_endDate != target_val_endDate) {
                        incorrect = incorrect.concat("Erstelldatum: falscher Typ;<br>");
                    };
                    if (membership_endDate instanceof Date == false) {
                        incorrect = incorrect.concat("Erstelldatum: kein Datumsformat;<br>");
                    };                      
                };
                if (membership.onBehalfOf != undefined && (actual_val_onBehalfOf != target_val_onBehalfOf)) {
                    match = "nein";
                    incorrect = incorrect.concat("Im Auftrag: falscher Typ;<br>");
                };
                if (membership.license != undefined && (actual_val_license != target_val_license)) {
                    match = "nein";
                    incorrect = incorrect.concat("Lizenz: falscher Typ;<br>");
                };
                if (membership["keyword"] != undefined && (actual_val_keyword != target_val_keyword)) {
                    match = "nein";
                    incorrect = incorrect.concat("Ortsobjekt: falscher Typ;<br>");
                };
                if ((membership.created != undefined && (actual_val_created != target_val_created)) || (membership_created instanceof Date == false)) {
                    match = "nein";
                    if (actual_val_created != target_val_created) {
                        incorrect = incorrect.concat("Erstelldatum: falscher Typ;<br>");
                    };
                    if (membership_created instanceof Date == false) {
                        incorrect = incorrect.concat("Erstelldatum: kein Datumsformat;<br>");
                    };                      
                };
                if ((membership.modified != undefined && (actual_val_modified != target_val_modified)) || (membership_modified instanceof Date == false)) {
                    match = "nein";
                    if (actual_val_modified != target_val_modified) {
                        incorrect = incorrect.concat("&Auml;nderungsdatum: falscher Typ;<br>");
                    };
                    if (membership_modified instanceof Date == false) {
                        incorrect = incorrect.concat("&Auml;nderungsdatum: kein Datumsformat;<br>");
                    };                        
                };
                if (membership.web != undefined && (actual_val_web != target_val_web)) {
                    match = "nein";
                    incorrect = incorrect.concat("Web: falscher Typ;<br>");
                };
                if (membership.deleted != undefined && (actual_val_deleted != target_val_deleted)) {
                    match = "nein";
                    incorrect = incorrect.concat("Gel&ouml;scht: falscher Typ;<br>");
                };
                // Output of selected information with result and error to the table with ID "membershipBody" for clear presentation.
                if (match == "ja") {
                    $('#membershipBody').append($("<tr>")
                    .append($("<td onclick='location.href=`" + membership.id + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(membership.id.slice(56))).append("</td>")
                    .append($("<td onclick='location.href=`" + membership.person + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(membership.person.slice(51))).append("</td>")
                    .append($("<td onclick='location.href=`" + membership.organization + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(membership.organization.slice(61))).append("</td>")
                    .append($("<td>").append(membership.role)).append("</td>")
                    .append($("<td>").append(membership.votingRight)).append("</td>")
                    .append($("<td>").append(membership.startDate)).append("</td>")
                    .append($("<td>").append(membership.endDate)).append("</td>")
                    .append($("<td>").append(membership.onBehalfOf)).append("</td>")
                    .append($("<td>").append(match)).append("</td>")
                    .append($("<td>").append(incorrect)).append("</td>")
                    .append("</tr>"));
                }
                if (match == "nein") {
                    $('#membershipBody').append($("<tr style='background-color: #FF6F6C'>")
                    .append($("<td onclick='location.href=`" + membership.id + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(membership.id.slice(56))).append("</td>")
                    .append($("<td onclick='location.href=`" + membership.person + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(membership.person.slice(51))).append("</td>")
                    .append($("<td onclick='location.href=`" + membership.organization + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(membership.organization.slice(61))).append("</td>")
                    .append($("<td>").append(membership.role)).append("</td>")
                    .append($("<td>").append(membership.votingRight)).append("</td>")
                    .append($("<td>").append(membership.startDate)).append("</td>")
                    .append($("<td>").append(membership.endDate)).append("</td>")
                    .append($("<td>").append(membership.onBehalfOf)).append("</td>")
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
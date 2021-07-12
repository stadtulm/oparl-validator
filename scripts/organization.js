// Declaring required variables
let bodyUrl = "http://buergerinfo.ulm.de/oparl/bodies/0001";
let schemaUrl = bodyUrl + "/organizations";
let schema = "https://schema.oparl.org/1.1/Organization";
let followpage = true;
let page = 1;
var organizationData = "";

// Get data type per property from OParl schema
$.getJSON(schema)
.done(function(oparl_data) {
    target_val_id = oparl_data["properties"].id.type;
    target_val_type = oparl_data["properties"].type.type;
    target_val_body = oparl_data["properties"].body.type;
    target_val_name = oparl_data["properties"].name.type;
    target_val_membership = oparl_data["properties"].membership.type;
    target_val_membership_item = oparl_data["properties"].membership["items"].type;
    target_val_meeting = oparl_data["properties"].meeting.type;
    target_val_meeting_item = oparl_data["properties"].meeting["items"].type;
    target_val_consultation = oparl_data["properties"].consultation.type;
    target_val_consultation_item = oparl_data["properties"].consultation["items"].type;
    target_val_shortName = oparl_data["properties"].shortName.type;
    target_val_post = oparl_data["properties"].post.type;
    target_val_post_item = oparl_data["properties"].post["items"].type;
    target_val_subOrganizationOf = oparl_data["properties"].subOrganizationOf.type;
    target_val_organizationType = oparl_data["properties"].organizationType.type; 
    target_val_classification = oparl_data["properties"].classification.type;
    target_val_startDate = oparl_data["properties"].startDate.type;
    target_val_endDate = oparl_data["properties"].endDate.type;
    target_val_website = oparl_data["properties"].website.type; 
    target_val_location = oparl_data["properties"].location.type;
    target_val_externalBody = oparl_data["properties"].externalBody.type; 
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
                organizationData = $(data["data"]);
                $(array["links"]).each(function(i, links) {
                    if (links.next != undefined) {
                        console.log("true");
                        followpage = true;
                        page += 1
                        getData(organizationData);
                        loadPages();       
                    }
                    else {
                        console.log("false");
                        followpage = false;
                        getData(organizationData);
                    }
                });
            });          
        });
    };

    function getData (organizationData) {
        // Go through the pages of the organization objects until there is no following page
        try {
            // Retrieve and process JSON objects of the respective page 
            $(organizationData).each(function(i, organization) {
                // Declare variables for check result and message for wrong data
                let match = "ja";
                let incorrect = "";
                // Determine data type of the respective information
                actual_val_id = typeof organization.id;
                actual_val_body = typeof organization.body;
                actual_val_type = typeof organization.type;
                actual_val_name = typeof organization.name;
                actual_val_membership = typeof organization.membership;
                actual_val_meeting = typeof organization.meeting;
                actual_val_consultation = typeof organization.consultation; 
                actual_val_shortName = typeof organization.shortName;    
                actual_val_post = typeof organization.post;                              
                actual_val_subOrganizationOf = typeof organization.subOrganizationOf;
                actual_val_organizationType = typeof organization.organizationType;
                actual_val_classification = typeof organization.classification;
                actual_val_startDate = typeof organization.startDate;
                actual_val_endDate = typeof organization.endDate;
                actual_val_website = typeof organization.website;
                actual_val_location = typeof organization.location;
                actual_val_externalBody = typeof organization.externalBody;
                actual_val_license = typeof organization.license;
                actual_val_keyword = typeof organization.keyword;
                actual_val_created = typeof organization.created;
                actual_val_modified = typeof organization.modified;
                actual_val_web = typeof organization.web;
                actual_val_deleted = typeof organization.deleted;
                // Convert the created and modified string into date format
                organization_created = new Date(organization.created);
                organization_modified = new Date(organization.modified);
                organization_startDate = new Date(organization.startDate);
                organization_endDate = new Date(organization.endDate);
                // In arrays get the data type of the first element, if the array exists
                if (actual_val_membership != "undefined") {
                    actual_val_membership = typeof organization.membership[0];
                };
                if (actual_val_meeting != "undefined") {
                    organization.meeting = {meeting: organization.meeting};
                    actual_val_meeting = typeof organization.meeting[0];
                } else {
                    organization.meeting = {meeting: "1"};
                    actual_val_meeting = typeof organization.meeting[0];
                };
                if (actual_val_consultation != "undefined") {
                    actual_val_consultation = typeof organization.consultation[0];
                };
                if (actual_val_post != "undefined") {
                    actual_val_post = typeof organization.post[0];
                };
                if (actual_val_keyword != "undefined") {
                    actual_val_keyword = typeof organization.keyword[0];
                };
                /*  Checks mandatory and self-defined target fields for existing entry and the intended data type.
                    For optional fields that were only partially present or not present in the development cycle system, 
                    only the corresponding data type is checked if the information is present in the JSON object 
                    In case of deviations from the specifications, the "Match" result of the entire check of a organization is 
                    set to no and the corresponding message is added to the error string.*/
                if ((actual_val_id != target_val_id) || (organization.id.length == 0)) {
                    match = "nein";
                    if (actual_val_id != target_val_id) {
                        incorrect = incorrect.concat("ID: falscher Typ;<br>");
                    };
                    if (organization.id.length == 0) {
                        incorrect = incorrect.concat("ID: Keine ID;<br>");
                    };
                };
                if ((actual_val_body != target_val_body) || organization.body != bodyUrl) {
                    match = "nein";
                    if (actual_val_body != target_val_body) {
                        incorrect = incorrect.concat("Body: falscher Typ;<br>");
                    };
                    if (organization.body != bodyUrl) {
                        incorrect = incorrect.concat("Body: Inkorrekter Body;<br>");
                    };
                };
                if ((actual_val_type != target_val_type) || (organization.type != schema)) {
                    match = "nein";
                    if (actual_val_type != target_val_type) {
                        incorrect = incorrect.concat("Typ: falscher Typ;<br>");
                    };
                    if (organization.type != schema) {
                        incorrect = incorrect.concat("Typ: Inkorrektes Schema;<br>");
                    };
                };
                if ((actual_val_name != target_val_name) || (organization.name.length == 0)) {
                    match = "nein";
                    if (actual_val_name != target_val_name) {
                        incorrect = incorrect.concat("Name: falscher Typ;<br>");
                    };
                    if (organization.name.length == 0) {
                        incorrect = incorrect.concat("Name: Kein Name;<br>");
                    };
                };
                if (organization.membership != undefined && (actual_val_membership != target_val_membership_item)) {
                    match = "nein";
                    incorrect = incorrect.concat("Mitgliedschaft: falscher Typ;<br>");
                }; 
                if (organization.meeting != undefined && (actual_val_meeting != target_val_meeting_item)) {
                    match = "nein";
                    incorrect = incorrect.concat("Meeting: falscher Typ;<br>");
                };  
                if (organization.consultation != undefined && (actual_val_consultation != target_val_consultation_item)) {
                    match = "nein";
                    incorrect = incorrect.concat("Besprechung: falscher Typ;<br>");
                };  
                if (organization.shortName != undefined && (actual_val_shortName != target_val_shortName)) {
                    match = "nein";
                    incorrect = incorrect.concat("Kurzbezeichnung: falscher Typ;<br>");
                };  
                if (organization.post != undefined && (actual_val_post != target_val_post_item)) {
                    match = "nein";
                    incorrect = incorrect.concat("Post: falscher Typ;<br>");
                };  
                if (organization.subOrganizationOf != undefined && (actual_val_subOrganizationOf != target_val_subOrganizationOf)) {
                    match = "nein";
                    incorrect = incorrect.concat("Unterorganisation von: falscher Typ;<br>");
                };  
                if (organization.classification != undefined && (actual_val_classification != target_val_classification)) {
                    match = "nein";
                    incorrect = incorrect.concat("Klassifizierung: falscher Typ;<br>");
                };  
                if ((organization.startDate != undefined && (actual_val_startDate != target_val_startDate)) || (organization_startDate instanceof Date == false)) {
                    match = "nein";
                    if (actual_val_startDate != target_val_startDate) {
                        incorrect = incorrect.concat("Start: falscher Typ;<br>");
                    };
                    if (organization_startDate instanceof Date == false) {
                        incorrect = incorrect.concat("Start: kein Datumsformat;<br>");
                    };                      
                };
                if ((organization.endDate != undefined && (actual_val_endDate != target_val_endDate)) || (organization_endDate instanceof Date == false)) {
                    match = "nein";
                    if (actual_val_endDate != target_val_endDate) {
                        incorrect = incorrect.concat("Ende: falscher Typ;<br>");
                    };
                    if (organization_endDate instanceof Date == false) {
                        incorrect = incorrect.concat("Ende: kein Datumsformat;<br>");
                    };                      
                };
                if (organization.website != undefined && (actual_val_website != target_val_website)) {
                    match = "nein";
                    incorrect = incorrect.concat("Webseite: falscher Typ;<br>");
                }; 
                if (organization.location != undefined && (actual_val_location != target_val_location)) {
                    match = "nein";
                    incorrect = incorrect.concat("Ort: falscher Typ;<br>");
                }; 
                if (organization.externalBody != undefined && (actual_val_externalBody != target_val_externalBody)) {
                    match = "nein";
                    incorrect = incorrect.concat("Externer Inhalt: falscher Typ;<br>");
                }; 
                if (organization.license != undefined && (actual_val_license != target_val_license)) {
                    match = "nein";
                    incorrect = incorrect.concat("Lizenz: falscher Typ;<br>");
                };
                if (organization["keyword"] != undefined && (actual_val_keyword != target_val_keyword)) {
                    match = "nein";
                    incorrect = incorrect.concat("Ortsobjekt: falscher Typ;<br>");
                };
                if ((organization.created != undefined && (actual_val_created != target_val_created)) || (organization_created instanceof Date == false)) {
                    match = "nein";
                    if (actual_val_created != target_val_created) {
                        incorrect = incorrect.concat("Erstelldatum: falscher Typ;<br>");
                    };
                    if (organization_created instanceof Date == false) {
                        incorrect = incorrect.concat("Erstelldatum: kein Datumsformat;<br>");
                    };                      
                };
                if ((organization.modified != undefined && (actual_val_modified != target_val_modified)) || (organization_modified instanceof Date == false)) {
                    match = "nein";
                    if (actual_val_modified != target_val_modified) {
                        incorrect = incorrect.concat("&Auml;nderungsdatum: falscher Typ;<br>");
                    };
                    if (organization_modified instanceof Date == false) {
                        incorrect = incorrect.concat("&Auml;nderungsdatum: kein Datumsformat;<br>");
                    };                        
                };
                if (organization.web != undefined && (actual_val_web != target_val_web)) {
                    match = "nein";
                    incorrect = incorrect.concat("Web: falscher Typ;<br>");
                };
                if (organization.deleted != undefined && (actual_val_deleted != target_val_deleted)) {
                    match = "nein";
                    incorrect = incorrect.concat("Gel&ouml;scht: falscher Typ;<br>");
                };
                // Output of selected information with result and error to the table with ID "organizationBody" for clear presentation.
                if (match == "ja") {
                    $('#organizationBody').append($("<tr>")
                    .append($("<td onclick='location.href=`" + organization.id + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(organization.id.slice(61))).append("</td>")
                    .append($("<td>").append(organization.name)).append("</td>")
                    .append($("<td>").append(organization.shortName)).append("</td>")
                    .append($("<td onclick='location.href=`" + organization.meeting + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(organization.meeting.meeting.slice(61))).append("</td>")
                    .append($("<td>").append(organization.startDate)).append("</td>")
                    .append($("<td>").append(organization.endDate)).append("</td>")
                    .append($("<td>").append(match)).append("</td>")
                    .append($("<td>").append(incorrect)).append("</td>")
                    .append("</tr>"));
                }
                if (match == "nein") {
                    $('#organizationBody').append($("<tr style='background-color: #FF6F6C'>")
                    .append($("<td onclick='location.href=`" + organization.id + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(organization.id.slice(61))).append("</td>")
                    .append($("<td>").append(organization.name)).append("</td>")
                    .append($("<td>").append(organization.shortName)).append("</td>")
                    .append($("<td onclick='location.href=`" + organization.meeting + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(organization.meeting.meeting.slice(61))).append("</td>")
                    .append($("<td>").append(organization.startDate)).append("</td>")
                    .append($("<td>").append(organization.endDate)).append("</td>")
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
        }
    }
});
// Declaring required variables
let bodyUrl = "http://buergerinfo.ulm.de/oparl/bodies/0001";
let schemaUrl = bodyUrl + "/papers/";
let schema = "https://schema.oparl.org/1.1/Paper";
let followpage = true;
let page = 1;
var paperData = "";

// Get data type per property from OParl schema
$.getJSON(schema, function(oparl_data) {
    target_val_id = oparl_data["properties"].id.type;
    target_val_type = oparl_data["properties"].type.type;
    target_val_body = oparl_data["properties"].body.type;
    target_val_name = oparl_data["properties"].name.type;
    target_val_reference = oparl_data["properties"].reference.type;
    target_val_date = oparl_data["properties"].date.type;
    target_val_paperType = oparl_data["properties"].paperType.type;
    target_val_relatedPaper = oparl_data["properties"].relatedPaper.type;
    target_val_relatedPaper_item = oparl_data["properties"].relatedPaper["items"].type; 
    target_val_superordinatedPaper = oparl_data["properties"].superordinatedPaper.type;
    target_val_superordinatedPaper_item = oparl_data["properties"].superordinatedPaper["items"].type;
    target_val_subordinatedPaper = oparl_data["properties"].subordinatedPaper.type;
    target_val_subordinatedPaper_item = oparl_data["properties"].subordinatedPaper["items"].type;    
    target_val_mainFile = oparl_data["properties"].mainFile.type;    
    target_val_auxiliaryFile = oparl_data["properties"].auxiliaryFile.type;  
    target_val_auxiliaryFile_item = oparl_data["properties"].auxiliaryFile["items"].type; 
    target_val_location = oparl_data["properties"].location.type;
    target_val_location_item = oparl_data["properties"].location["items"].type;    
    target_val_originatorPerson = oparl_data["properties"].originatorPerson.type;
    target_val_originatorPerson_item = oparl_data["properties"].originatorPerson["items"].type; 
    target_val_underDirectionOf = oparl_data["properties"].underDirectionOf.type;
    target_val_underDirectionOf_item = oparl_data["properties"].underDirectionOf["items"].type; 
    target_val_originatorOrganization = oparl_data["properties"].originatorOrganization.type;
    target_val_originatorOrganization_item = oparl_data["properties"].originatorOrganization["items"].type; 
    target_val_consultation = oparl_data["properties"].consultation.type;
    target_val_consultation_item = oparl_data["properties"].consultation["items"].type;
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
                paperData = $(data["data"]);
                $(array["links"]).each(function(i, links) {
                    if (links.next != undefined) {
                        console.log("true");
                        followpage = true;
                        page += 1
                        getData(paperData);
                        loadPages();       
                    }
                    else {
                        console.log("false");
                        followpage = false;
                        getData(paperData);
                    }
                });
            });            
        });
    };
    
    function getData (paperData) {
    // Go through the pages of the paper objects until there is no following page
        try {
            // Retrieve and process JSON objects of the respective page
            $(paperData).each(function(i, paper) {
                // Declare variables for check result and message for wrong data
                let match = "ja";
                let incorrect = "";
                // Determine data type of the respective information
                actual_val_id = typeof paper.id;
                actual_val_type = typeof paper.type;
                actual_val_body = typeof paper.body;  
                actual_val_name = typeof paper.name;                  
                actual_val_reference = typeof paper.reference;
                actual_val_date = typeof paper.date;
                actual_val_paperType = typeof paper.paperType;
                actual_val_relatedPaper = typeof paper.relatedPaper;
                actual_val_superordinatedPaper = typeof paper.superordinatedPaper; 
                actual_val_subordinatedPaper = typeof paper.subordinatedPaper;
                actual_val_mainFile = typeof paper.mainFile;
                actual_val_auxiliaryFile = typeof paper.auxiliaryFile;
                actual_val_location = typeof paper.location;
                actual_val_originatorPerson = typeof paper.originatorPerson;               
                actual_val_underDirectionOf = typeof paper.underDirectionOf;
                actual_val_originatorOrganization = typeof paper.originatorOrganization;
                actual_val_consultation = typeof paper.consultation;
                actual_val_license = typeof paper.license;
                actual_val_keyword = typeof paper.keyword;
                actual_val_created = typeof paper.created;
                actual_val_modified = typeof paper.modified;
                actual_val_web = typeof paper.web;
                actual_val_deleted = typeof paper.deleted;
                // Convert the created and modified string into date format
                paper_created = new Date(paper.created);
                paper_modified = new Date(paper.modified);
                paper.date = new Date(paper.date);
                // In arrays get the data type of the first element, if the array exists
                if (actual_val_relatedPaper != "undefined") {
                    actual_val_relatedPaper = typeof paper.relatedPaper[0];
                };
                if (actual_val_superordinatedPaper != "undefined") {
                    actual_val_superordinatedPaper = typeof paper.superordinatedPaper[0];
                };
                if (actual_val_subordinatedPaper != "undefined") {
                    actual_val_subordinatedPaper = typeof paper.subordinatedPaper[0];
                };
                if (actual_val_auxiliaryFile != "undefined") {
                    actual_val_auxiliaryFile = typeof paper.auxiliaryFile[0];
                };
                if (actual_val_location != "undefined") {
                    actual_val_location = typeof paper.location[0];
                };
                if (actual_val_originatorPerson != "undefined") {
                    actual_val_originatorPerson = typeof paper.originatorOrganization[0];
                };
                if (actual_val_underDirectionOf != "undefined") {
                    actual_val_underDirectionOf = typeof paper.underDirectionOf[0];
                };
                if (actual_val_originatorOrganization != "undefined") {
                    actual_val_originatorOrganization = typeof paper.originatorOrganization[0];
                };
                if (actual_val_consultation != "undefined") {
                    actual_val_consultation = typeof paper.consultation[0];
                };
                if (actual_val_keyword != "undefined") {
                    actual_val_keyword = typeof paper.keyword[0];
                };
                /*  Checks mandatory and self-defined target fields for existing entry and the intended data type.
                    For optional fields that were only partially present or not present in the development cycle system, 
                    only the corresponding data type is checked if the information is present in the JSON object 
                    In case of deviations from the specifications, the "Match" result of the entire check of a paper is 
                    set to no and the corresponding message is added to the error string.*/
                if ((actual_val_id != target_val_id) || (paper.id.length == 0)) {
                    match = "nein";
                    if (actual_val_id != target_val_id) {
                        incorrect = incorrect.concat("ID: falscher Typ;<br>");
                    };
                    if (paper.id.length == 0) {
                        incorrect = incorrect.concat("ID: Keine ID;<br>");
                    };
                };
                if ((actual_val_body != target_val_body) || paper.body != bodyUrl) {
                    match = "nein";
                    if (actual_val_body != target_val_body) {
                        incorrect = incorrect.concat("Body: falscher Typ;<br>");
                    };
                    if (paper.body != bodyUrl) {
                        incorrect = incorrect.concat("Body: Inkorrekter Body;<br>");
                    };
                };
                if ((actual_val_type != target_val_type) || (paper.type != schema)) {
                    match = "nein";
                    if (actual_val_type != target_val_type) {
                        incorrect = incorrect.concat("Typ: falscher Typ;<br>");
                    };
                    if (paper.type != schema) {
                        incorrect = incorrect.concat("Typ: Inkorrektes Schema;<br>");
                    };
                };
                if ((actual_val_name != target_val_name) || (paper.name.length == 0)) {
                    match = "nein";
                    if (actual_val_name != target_val_name) {
                        incorrect = incorrect.concat("Name: falscher Typ;<br>");
                    };
                    if (paper.name.length == 0) {
                        incorrect = incorrect.concat("Name: Kein Name;<br>");
                    };
                };
                if (paper.reference != undefined && (actual_val_reference != target_val_reference)) {
                    match = "nein";
                    incorrect = incorrect.concat("Referenz: falscher Typ;<br>");
                };
                if ((paper.date != undefined && (actual_val_date != target_val_date)) || (paper.date instanceof Date == false)) {
                    match = "nein";
                    if (actual_val_date != target_val_date) {
                        incorrect = incorrect.concat("Datum: falscher Typ;<br>");
                    };
                    if (paper.date instanceof Date == false) {
                        incorrect = incorrect.concat("Datum: kein Datumsformat;<br>");
                    };                      
                };
                if (paper.paperType != undefined && (actual_val_paperType != target_val_paperType)) {
                    match = "nein";
                    incorrect = incorrect.concat("Datum: falscher Typ;<br>");
                };
                if (paper.relatedPaper != undefined && (actual_val_relatedPaper != target_val_relatedPaper_item)) {
                    match = "nein";
                    incorrect = incorrect.concat("Datum: falscher Typ;<br>");
                };
                if (paper.superordinatedPaper != undefined && (actual_val_superordinatedPaper != target_val_superordinatedPaper_item)) {
                    match = "nein";
                    incorrect = incorrect.concat("&Uuml;bergeordnet: falscher Typ;<br>");
                } else if (paper.superordinatedPaper == undefined) {
                    paper.superordinatedPaper = [""];
                };
                if (paper.subordinatedPaper != undefined && (actual_val_subordinatedPaper != target_val_subordinatedPaper_item)) {
                    match = "nein";
                    incorrect = incorrect.concat("Untergeordnet: falscher Typ;<br>");
                } else if (paper.subordinatedPaper == undefined) {
                    paper.subordinatedPaper = [""];
                };
                if (paper.mainFile != undefined && (actual_val_mainFile != target_val_mainFile)) {
                    match = "nein";
                    incorrect = incorrect.concat("Hauptdatei: falscher Typ;<br>");
                };
                if (paper.auxiliaryFile != undefined && (actual_val_auxiliaryFile != target_val_auxiliaryFile_item)) {
                    match = "nein";
                    incorrect = incorrect.concat("Datum: falscher Typ;<br>");
                };
                if (paper.location != undefined && (actual_val_location != target_val_location)) {
                    match = "nein";
                    incorrect = incorrect.concat("Ort: falscher Typ;<br>");
                };
                if (paper.originatorPerson != undefined && (actual_val_originatorPerson != target_val_originatorPerson_item)) {
                    match = "nein";
                    incorrect = incorrect.concat("Ersteller: falscher Typ;<br>");
                };
                if (paper.underDirectionOf != undefined && (actual_val_underDirectionOf != target_val_underDirectionOf_item)) {
                    match = "nein";
                    incorrect = incorrect.concat("Leitung: falscher Typ;<br>");
                } else if (paper.underDirectionOf == undefined) {
                    paper.underDirectionOf = [""];
                };
                if (paper.originatorOrganization != undefined && (actual_val_originatorOrganization != target_val_originatorOrganization_item)) {
                    match = "nein";
                    incorrect = incorrect.concat("Erstellorganisation: falscher Typ;<br>");
                };
                if (paper.consultation != undefined && (actual_val_consultation != target_val_consultation_item)) {
                    match = "nein";
                    incorrect = incorrect.concat("Besprechung: falscher Typ;<br>");
                };
                if (paper.license != undefined && (actual_val_license != target_val_license)) {
                    match = "nein";
                    incorrect = incorrect.concat("Lizenz: falscher Typ;<br>");
                };
                if (paper["keyword"] != undefined && (actual_val_keyword != target_val_keyword)) {
                    match = "nein";
                    incorrect = incorrect.concat("Ortsobjekt: falscher Typ;<br>");
                };
                if ((paper.created != undefined && (actual_val_created != target_val_created)) || (paper_created instanceof Date == false)) {
                    match = "nein";
                    if (actual_val_created != target_val_created) {
                        incorrect = incorrect.concat("Erstelldatum: falscher Typ;<br>");
                    };
                    if (paper_created instanceof Date == false) {
                        incorrect = incorrect.concat("Erstelldatum: kein Datumsformat;<br>");
                    };                      
                };
                if ((paper.modified != undefined && (actual_val_modified != target_val_modified)) || (paper_modified instanceof Date == false)) {
                    match = "nein";
                    if (actual_val_modified != target_val_modified) {
                        incorrect = incorrect.concat("&Auml;nderungsdatum: falscher Typ;<br>");
                    };
                    if (paper_modified instanceof Date == false) {
                        incorrect = incorrect.concat("&Auml;nderungsdatum: kein Datumsformat;<br>");
                    };                        
                };
                if (paper.web != undefined && (actual_val_web != target_val_web)) {
                    match = "nein";
                    incorrect = incorrect.concat("Web: falscher Typ;<br>");
                };
                if (paper.deleted != undefined && (actual_val_deleted != target_val_deleted)) {
                    match = "nein";
                    incorrect = incorrect.concat("Gel&ouml;scht: falscher Typ;<br>");
                };
                
                // Output of selected information with result and error to the table with ID "paperBody" for clear presentation.
                if (match == "ja") {
                    $('#paperBody').append($("<tr>")
                    .append($("<td onclick='location.href=`" + paper.id + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(paper.id.slice(54))).append("</td>")
                    .append($("<td>").append(paper.name)).append("</td>")
                    .append($("<td>").append(paper.paperType)).append("</td>")
                    .append($("<td>").append(paper.reference)).append("</td>")
                    .append($("<td onclick='location.href=`" + paper.underDirectionOf + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(paper.underDirectionOf[0].slice(62))).append("</td>")
                    .append($("<td onclick='location.href=`" + paper.superordinatedPaper + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(paper.superordinatedPaper[0].slice(54))).append("</td>")
                    .append($("<td onclick='location.href=`" + paper.subordinatedPaper + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(paper.subordinatedPaper[0].slice(54))).append("</td>")
                    .append($("<td>").append(match)).append("</td>")
                    .append($("<td>").append(incorrect)).append("</td>")
                    .append("</tr>"));
                };
                if (match == "nein") {
                    $('#paperBody').append($("<tr style='background-color: #FF6F6C'>")
                    .append($("<td onclick='location.href=`" + paper.id + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(paper.id.slice(54))).append("</td>")
                    .append($("<td>").append(paper.name)).append("</td>")
                    .append($("<td>").append(paper.paperType)).append("</td>")
                    .append($("<td>").append(paper.reference)).append("</td>")
                    .append($("<td onclick='location.href=`" + paper.underDirectionOf + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(paper.underDirectionOf[0].slice(62))).append("</td>")
                    .append($("<td onclick='location.href=`" + paper.superordinatedPaper + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(paper.superordinatedPaper[0].slice(54))).append("</td>")
                    .append($("<td onclick='location.href=`" + paper.subordinatedPaper + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(paper.subordinatedPaper[0].slice(54))).append("</td>")
                    .append($("<td>").append(match)).append("</td>")
                    .append($("<td>").append(incorrect)).append("</td>")
                    .append("</tr>"));
                };
                
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
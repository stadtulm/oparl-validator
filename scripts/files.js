// Declaring required variables
let bodyUrl = "http://buergerinfo.ulm.de/oparl/bodies/0001";
let schemaUrl = bodyUrl + "/files/";
let schema = "https://schema.oparl.org/1.1/File";
let followpage = true;
let page = 1;
var fileData = "";

// Get data type per property from OParl schema
$.getJSON(schema, function(oparl_data) {
    target_val_id = oparl_data["properties"].id.type;
    target_val_type = oparl_data["properties"].type.type;
    target_val_name = oparl_data["properties"].name.type;
    target_val_fileName = oparl_data["properties"].fileName.type;
    target_val_mimeType = oparl_data["properties"].mimeType.type;
    target_val_date = oparl_data["properties"].date.type;
    target_val_size = oparl_data["properties"].size.type;
    target_val_sha1Checksum = oparl_data["properties"].sha1Checksum.type; 
    target_val_sha512Checksum = oparl_data["properties"].sha512Checksum.type;
    target_val_text = oparl_data["properties"].text.type;
    target_val_accessUrl = oparl_data["properties"].accessUrl.type;
    target_val_downloadUrl = oparl_data["properties"].downloadUrl.type;
    target_val_externalServiceUrl = oparl_data["properties"].externalServiceUrl.type;    
    target_val_masterFile = oparl_data["properties"].masterFile.type; 
    target_val_derivativeFile = oparl_data["properties"].derivativeFile.type;
    target_val_derivativeFile_item = oparl_data["properties"].derivativeFile["items"].type;    
    target_val_fileLicense = oparl_data["properties"].fileLicense.type;
    target_val_meeting = oparl_data["properties"].meeting.type;
    target_val_meeting_item = oparl_data["properties"].meeting["items"].type;
    target_val_agendaItem = oparl_data["properties"].agendaItem.type;
    target_val_agendaItem_item = oparl_data["properties"].agendaItem["items"].type;
    target_val_paper = oparl_data["properties"].paper.type;
    target_val_paper_item = oparl_data["properties"].paper["items"].type;
    target_val_license = oparl_data["properties"].license.type;    
    target_val_keyword = oparl_data["properties"].type; 
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
                fileData = $(data["data"]);
                $(array["links"]).each(function(i, links) {
                    if (links.next != undefined) {
                        console.log("true");
                        followpage = true;
                        page += 1
                        getData(fileData);
                        loadPages();       
                    }
                    else {
                        console.log("false");
                        followpage = false;
                        getData(fileData);
                    }
                });
            });            
        });
    };
    
    function getData (personData) {
    // Go through the pages of the file objects until there is no following page
        try {
            // Retrieve and process JSON objects of the respective page
            $(fileData).each(function(i, file) {
                // Declare variables for check result and message for wrong data
                let match = "ja";
                let incorrect = "";
                // Determine data type of the respective information
                actual_val_id = typeof file.id;
                actual_val_type = typeof file.type;
                actual_val_name = typeof file.name;
                actual_val_fileName = typeof file.fileName;
                actual_val_mimeType = typeof file.mimeType;
                actual_val_date = typeof file.date; 
                actual_val_size = typeof file.size;    
                actual_val_sha1Checksum = typeof file.sha1Checksum; 
                actual_val_sha512Checksum = typeof file.sha512Checksum;
                actual_val_text = typeof file.text;
                actual_val_accessUrl = typeof file.accessUrl;                    
                actual_val_downloadUrl = typeof file.downloadUrl;
                actual_val_externalServiceUrl = typeof file.externalServiceUrl;
                actual_val_masterFile = typeof file.masterFile;
                actual_val_derivativeFile = typeof file.derivativeFile;
                actual_val_fileLicense = typeof file.fileLicense;
                actual_val_meeting = typeof file.meeting;
                actual_val_agendaItem = typeof file.agendaItem;
                actual_val_paper = typeof file.paper;
                actual_val_license = typeof file.license;
                actual_val_keyword = typeof file.keyword;
                actual_val_created = typeof file.created;
                actual_val_modified = typeof file.modified;
                actual_val_web = typeof file.web;
                actual_val_deleted = typeof file.deleted;
                // Convert the created and modified string into date format
                file.date = new Date(file.date);
                file_created = new Date(file.created);
                file_modified = new Date(file.modified);
                // In arrays get the data type of the first element, if the array exists
                if (actual_val_derivativeFile != "undefined") {
                    actual_val_derivativeFile = typeof file.derivativeFile[0];
                };
                if (actual_val_meeting != "undefined") {
                    actual_val_meeting = typeof file.meeting[0];
                };
                if (actual_val_agendaItem != "undefined") {
                    actual_val_agendaItem = typeof file.agendaItem[0];
                };
                if (actual_val_paper != "undefined") {
                    actual_val_paper = typeof file.paper[0];
                };
                if (actual_val_keyword != "undefined") {
                    actual_val_keyword = typeof file.keyword[0];
                };
                /*  Checks mandatory and self-defined target fields for existing entry and the intended data type.
                    For optional fields that were only partially present or not present in the development cycle system, 
                    only the corresponding data type is checked if the information is present in the JSON object 
                    In case of deviations from the specifications, the "Match" result of the entire check of a file is 
                    set to no and the corresponding message is added to the error string.*/
                if ((actual_val_id != target_val_id) || (file.id.length == 0)) {
                    match = "nein";
                    if (actual_val_id != target_val_id) {
                        incorrect = incorrect.concat("ID: falscher Typ;<br>");
                    };
                    if (file.id.length == 0) {
                        incorrect = incorrect.concat("ID: Keine ID;<br>");
                    };
                };
                if ((actual_val_type != target_val_type) || (file.type != schema)) {
                    match = "nein";
                    if (actual_val_type != target_val_type) {
                        incorrect = incorrect.concat("Typ: falscher Typ;<br>");
                    };
                    if (file.type != schema) {
                        incorrect = incorrect.concat("Typ: Inkorrektes Schema;<br>");
                    };
                };
                if ((actual_val_name != target_val_name) || (file.name.length == 0)) {
                    match = "nein";
                    if (actual_val_name != target_val_name) {
                        incorrect = incorrect.concat("Name: falscher Typ;<br>");
                    };
                    if (file.name.length == 0) {
                        incorrect = incorrect.concat("Name: Kein Name;<br>");
                    };
                };
                if ((actual_val_fileName != target_val_fileName) || (file.fileName.length == 0)) {
                    match = "nein";
                    if (actual_val_fileName != target_val_fileName) {
                        incorrect = incorrect.concat("Dateiname: falscher Typ;<br>");
                    };
                    if (file.fileName.length == 0) {
                        incorrect = incorrect.concat("Dateiname: Kein Dateiname;<br>");
                    };
                };
                if (file.size != undefined && (actual_val_size != target_val_size)) {
                    match = "nein";
                    incorrect = incorrect.concat("Gr&uuml;&szlig;e: falscher Typ;<br>");
                };
                if (file.sha1Checksum != undefined && (actual_val_sha1Checksum != target_val_sha1Checksum)) {
                    match = "nein";
                    incorrect = incorrect.concat("SHA1Checksum: falscher Typ;<br>");
                };
                if (file.sha512Checksum != undefined && (actual_val_sha512Checksum != target_val_sha512Checksum)) {
                    match = "nein";
                    incorrect = incorrect.concat("SHA512Checksum: falscher Typ;<br>");
                };
                if (file.text != undefined && (actual_val_text != target_val_text)) {
                    match = "nein";
                    incorrect = incorrect.concat("Text: falscher Typ;<br>");
                };
                if ((actual_val_accessUrl != target_val_accessUrl) || (file.accessUrl.length == 0)) {
                    match = "nein";
                    if (actual_val_accessUrl != target_val_accessUrl) {
                        incorrect = incorrect.concat("Zugriffslink: falscher Typ;<br>");
                    };
                    if (file.accessUrl.length == 0) {
                        incorrect = incorrect.concat("Zugriffslink: Kein Link;<br>");
                    };
                };  
                if ((actual_val_downloadUrl != target_val_downloadUrl) || (file.downloadUrl.length == 0)) {
                    match = "nein";
                    if (actual_val_downloadUrl != target_val_downloadUrl) {
                        incorrect = incorrect.concat("Downloadlink: falscher Typ;<br>");
                    };
                    if (file.downloadUrl.length == 0) {
                        incorrect = incorrect.concat("Downloadlink: Kein Link;<br>");
                    };
                };  
                if (file.externalServiceUrl != undefined && (actual_val_externalServiceUrl != target_val_externalServiceUrl)) {
                    match = "nein";
                    incorrect = incorrect.concat("Externer Servicelink: falscher Typ;<br>");
                }; 
                if (file.masterFile != undefined && (actual_val_masterFile != target_val_masterFile)) {
                    match = "nein";
                    incorrect = incorrect.concat("Masterdatei: falscher Typ;<br>");
                }; 
                if (file.derivativeFile != undefined && (actual_val_derivativeFile != target_val_derivativeFile_item)) {
                    match = "nein";
                    incorrect = incorrect.concat("Abgeleitete Datei: falscher Typ;<br>");
                }; 
                if (file.fileLicense != undefined && (actual_val_fileLicense != target_val_fileLicense)) {
                    match = "nein";
                    incorrect = incorrect.concat("Dateilizenz: falscher Typ;<br>");
                }; 
                if (file.meeting != undefined && (actual_val_meeting != target_val_meeting_item)) {
                    match = "nein";
                    incorrect = incorrect.concat("Meeting: falscher Typ;<br>");
                };
                if (file.agendaItem != undefined && (actual_val_agendaItem != target_val_agendaItem_item)) {
                    match = "nein";
                    incorrect = incorrect.concat("Agendapunkt: falscher Typ;<br>");
                };
                if (file.paper != undefined && (actual_val_paper != target_val_paper_item)) {
                    match = "nein";
                    incorrect = incorrect.concat("Paper: falscher Typ;<br>");
                };
                if (file.license != undefined && (actual_val_license != target_val_license)) {
                    match = "nein";
                    incorrect = incorrect.concat("Lizenz: falscher Typ;<br>");
                };
                if (file["keyword"] != undefined && (actual_val_keyword != target_val_keyword_item)) {
                    match = "nein";
                    incorrect = incorrect.concat("Ortsobjekt: falscher Typ;<br>");
                };
                if ((file.created != undefined && (actual_val_created != target_val_created)) || (file_created instanceof Date == false)) {
                    match = "nein";
                    if (actual_val_created != target_val_created) {
                        incorrect = incorrect.concat("Erstelldatum: falscher Typ;<br>");
                    };
                    if (file_created instanceof Date == false) {
                        incorrect = incorrect.concat("Erstelldatum: kein Datumsformat;<br>");
                    };                      
                };
                if ((file.modified != undefined && (actual_val_modified != target_val_modified)) || (file_modified instanceof Date == false)) {
                    match = "nein";
                    if (actual_val_modified != target_val_modified) {
                        incorrect = incorrect.concat("&Auml;nderungsdatum: falscher Typ;<br>");
                    };
                    if (file_modified instanceof Date == false) {
                        incorrect = incorrect.concat("&Auml;nderungsdatum: kein Datumsformat;<br>");
                    };                        
                };
                if (file.web != undefined && (actual_val_web != target_val_web)) {
                    match = "nein";
                    incorrect = incorrect.concat("Web: falscher Typ;<br>");
                };
                if (file.deleted != undefined && (actual_val_deleted != target_val_deleted)) {
                    match = "nein";
                    incorrect = incorrect.concat("Gel&ouml;scht: falscher Typ;<br>");
                };

                // Output of selected information with result and error to the table with ID "fileBody" for clear presentation.
                if (match == "ja") {
                    $('#fileBody').append($("<tr>")
                    .append($("<td onclick='location.href=`" + file.id + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(file.id.slice(51))).append("</td>")
                    .append($("<td>").append(file.name)).append("</td>")
                    .append($("<td>").append("<a href='" + file.accessUrl + "'</a>" + file.fileName + "&nbsp;&nbsp;<a href='" + file.downloadUrl + "' style='color: black;' alt='Download'><img src='../images/download.jpg' style='height: 20px;'></a>")).append("</td>")
                    .append($("<td>").append(file.mimeType)).append("</td>")
                    .append($("<td>").append(file.date.toLocaleDateString('fr-ca'))).append("</td>")
                    .append($("<td>").append(file.meeting)).append("</td>")
                    .append($("<td>").append(match)).append("</td>")
                    .append($("<td>").append(incorrect)).append("</td>")
                    .append("</tr>"));
                }
                if (match == "nein") {
                    $('#fileBody').append($("<tr style='background-color: #FF6F6C'>")
                    .append($("<td onclick='location.href=`" + file.id + "`' style='text-decoration: underline; color: blue; cursor: pointer'>").append(file.id.slice(51))).append("</td>")
                    .append($("<td>").append(file.name)).append("</td>")
                    .append($("<td>").append("<a href='" + file.accessUrl + "'</a>" + file.fileName + "&nbsp;&nbsp;<a href='" + file.downloadUrl + "' style='color: black;' alt='Download'><img src='../images/download.jpg' style='height: 20px;'></a>")).append("</td>")
                    .append($("<td>").append(file.mimeType)).append("</td>")
                    .append($("<td>").append(file.date.toLocaleDateString('fr-ca'))).append("</td>")
                    .append($("<td>").append(file.meeting)).append("</td>")
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
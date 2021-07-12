// Declaring required variables
let bodyUrl = "http://buergerinfo.ulm.de/oparl/bodies/0001";
let schemaUrl = bodyUrl + "/people/";
let schema = "https://schema.oparl.org/1.1/Person";
let followpage = true;
let page = 1;
var personData = "";

let test = document.getElementById("inputtest");
console.log("abc " + test);

// Get data type per property from OParl schema
$.getJSON(schema)
.done(function(oparl_data) {
    target_val_id = oparl_data["properties"].id.type;
    target_val_type = oparl_data["properties"].type.type;
    target_val_body = oparl_data["properties"].body.type;
    target_val_name = oparl_data["properties"].name.type;
    target_val_familyName = oparl_data["properties"].familyName.type;
    target_val_givenName = oparl_data["properties"].givenName.type;
    target_val_formofAddress = oparl_data["properties"].formOfAddress.type;
    target_val_affix = oparl_data["properties"].affix.type;
    target_val_title = oparl_data["properties"].title["items"].type; 
    target_val_gender = oparl_data["properties"].gender.type;
    target_val_phone = oparl_data["properties"].phone["items"].type;
    target_val_email = oparl_data["properties"].email["items"].type;
    target_val_location = oparl_data["properties"].location.type;
    target_val_locationObject = oparl_data["properties"].locationObject.type;    
    target_val_status = oparl_data["properties"].status["items"].type; 
    target_val_membership = oparl_data["properties"].membership["items"].type;    
    target_val_life = oparl_data["properties"].life.type;
    target_val_lifeSource = oparl_data["properties"].lifeSource.type;
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
                personData = $(data["data"]);
                $(array["links"]).each(function(i, links) {
                    if (links.next != undefined) {
                        console.log("true");
                        followpage = true;
                        page += 1
                        getData(personData);
                        loadPages();       
                    }
                    else {
                        console.log("false");
                        followpage = false;
                        getData(personData);
                    }
                });
            });            
        });
    };
   
    function getData (personData) {
        // Go through the pages of the person objects until there is no following page
        try {
            // Retrieve and process JSON objects of the respective page
            $(personData).each(function(i, person) {
                // Declare variables for check result and message for wrong data
                let match = "ja";
                let incorrect = "";
                // Determine data type of the respective information
                actual_val_id = typeof person.id;
                actual_val_body = typeof person.body;
                actual_val_type = typeof person.type;
                actual_val_name = typeof person.name;
                actual_val_familyName = typeof person.familyName;
                actual_val_givenName = typeof person.givenName;
                actual_val_formofAddress = typeof person.formOfAddress; 
                actual_val_affix = typeof person.affix;    
                actual_val_title = typeof person.title;                              
                actual_val_gender = typeof person.gender;
                actual_val_phone = typeof person.phone;
                actual_val_email = typeof person.email;                    
                actual_val_location = typeof person.location;
                actual_val_locationObject = typeof person.locationObject;
                actual_val_status = typeof person.status;
                actual_val_membership = typeof person.membership;
                actual_val_life = typeof person.life;
                actual_val_lifeSource = typeof person.lifeSource;
                actual_val_license = typeof person.license;
                actual_val_keyword = typeof person.keyword;
                actual_val_created = typeof person.created;
                actual_val_modified = typeof person.modified;
                actual_val_web = typeof person.web;
                actual_val_deleted = typeof person.deleted;
                // Convert the created and modified string into date format
                person_created = new Date(person.created);
                person_modified = new Date(person.modified);
                // In arrays get the data type of the first element, if the array exists
                if (actual_val_title != "undefined") {
                    actual_val_title = typeof person.title[0];
                };
                if (actual_val_phone != "undefined") {
                    actual_val_phone = typeof person.phone[0];
                };
                if (actual_val_email != "undefined") {
                    actual_val_email = typeof person.email[0];
                };
                if (actual_val_status != "undefined") {
                    actual_val_status = typeof person.status[0];
                };
                if (actual_val_membership != "undefined") {
                    actual_val_membership = typeof person.membership[0];
                };
                if (actual_val_keyword != "undefined") {
                    actual_val_keyword = typeof person.keyword[0];
                };
                /*  Checks mandatory and self-defined target fields for existing entry and the intended data type.
                    For optional fields that were only partially present or not present in the development cycle system, 
                    only the corresponding data type is checked if the information is present in the JSON object 
                    In case of deviations from the specifications, the "Match" result of the entire check of a person is 
                    set to no and the corresponding message is added to the error string.*/
                if ((actual_val_id != target_val_id) || (person.id.length == 0)) {
                    match = "nein";
                    if (actual_val_id != target_val_id) {
                        incorrect = incorrect.concat("ID: falscher Typ;<br>");
                    };
                    if (person.id.length == 0) {
                        incorrect = incorrect.concat("ID: Keine ID;<br>");
                    };
                };
                if ((actual_val_body != target_val_body) || person.body != bodyUrl) {
                    match = "nein";
                    if (actual_val_body != target_val_body) {
                        incorrect = incorrect.concat("Body: falscher Typ;<br>");
                    };
                    if (person.body != bodyUrl) {
                        incorrect = incorrect.concat("Body: Inkorrekter Body;<br>");
                    };
                };
                if ((actual_val_type != target_val_type) || (person.type != schema)) {
                    match = "nein";
                    if (actual_val_type != target_val_type) {
                        incorrect = incorrect.concat("Typ: falscher Typ;<br>");
                    };
                    if (person.type != schema) {
                        incorrect = incorrect.concat("Typ: Inkorrektes Schema;<br>");
                    };
                };
                if ((actual_val_name != target_val_name) || (person.name.length == 0)) {
                    match = "nein";
                    if (actual_val_name != target_val_name) {
                        incorrect = incorrect.concat("Name: falscher Typ;<br>");
                    };
                    if (person.name.length == 0) {
                        incorrect = incorrect.concat("Name: Kein Name;<br>");
                    };
                };
                if ((actual_val_familyName != target_val_familyName) || (person.familyName.length == 0)) {
                    match = "nein";
                    if (actual_val_familyName != target_val_familyName) {
                        incorrect = incorrect.concat("Nachname: falscher Typ;<br>");
                    };
                    if (person.familyName.length == 0) {
                        incorrect = incorrect.concat("Nachname: Kein Nachname;<br>");
                    };
                };
                if ((actual_val_givenName != target_val_givenName) || (person.givenName.length == 0)) {
                    match = "nein";
                    if (actual_val_givenName != target_val_givenName) {
                        incorrect = incorrect.concat("Vorname: falscher Typ;<br>");
                    };
                    if (person.givenName.length == 0) {
                        incorrect = incorrect.concat("Vorname: Kein Vorname;<br>");
                    };
                };
                if ((actual_val_formofAddress != target_val_formofAddress) || (person.formOfAddress.length == 0)) {
                    match = "nein";
                    if (actual_val_formofAddress != target_val_formofAddress) {
                        incorrect = incorrect.concat("Anrede: falscher Typ;<br>");
                    };
                    if (person.formOfAddress.length == 0) {
                        incorrect = incorrect.concat("Anrede: Keine Anrede;<br>");
                    };
                };     
                if (person.affix != undefined && (actual_val_affix != target_val_affix)) {
                    match = "nein";
                    incorrect = incorrect.concat("Anf&uuml;gung: falscher Typ;<br>");
                };        
                if (person["title"] != undefined && (actual_val_title != target_val_title)) {
                    match = "nein";
                    incorrect = incorrect.concat("Telefon: falscher Typ;<br>");
                };        
                if ((actual_val_gender != target_val_gender) || (person.gender.length == 0)) {
                    match = "nein";
                    if (actual_val_gender != target_val_gender) {
                        incorrect = incorrect.concat("Geschlecht: falscher Typ;<br>");
                    };
                    if (person.gender.length == 0) {
                        incorrect = incorrect.concat("Geschlecht: Kein Geschlecht;<br>");
                    };
                };
                if (person["phone"] != undefined && (actual_val_phone != target_val_phone)) {
                    match = "nein";
                    incorrect = incorrect.concat("Telefon: falscher Typ;<br>");
                }; 
                if ((person["email"] != undefined) && (actual_val_email != target_val_email)) {
                    match = "nein";
                    incorrect = incorrect.concat("E-Mail: falscher Typ;<br>");
                }; 
                if (person.location != undefined && (actual_val_location != target_val_location)) {
                    match = "nein";
                    incorrect = incorrect.concat("Ort: falscher Typ;<br>");
                };
                if (person.locationObject != undefined && (actual_val_locationObject != target_val_locationObject)) {
                    match = "nein";
                    incorrect = incorrect.concat("Telefon: falscher Typ;<br>");
                };
                if (person["status"] != undefined && (actual_val_status != target_val_status)) {
                    match = "nein";
                    incorrect = incorrect.concat("Status: falscher Typ;<br>");
                };
                if (person["membership"] != undefined && (actual_val_membership != target_val_membership)) {
                    match = "nein";
                    incorrect = incorrect.concat("Mitgliedschaft: falscher Typ;<br>");
                };
                if (person.life != undefined && (actual_val_life != target_val_life)) {
                    match = "nein";
                    incorrect = incorrect.concat("Leben: falscher Typ;<br>");
                };
                if (person.lifeSource != undefined && (actual_val_lifeSource != target_val_lifeSource)) {
                    match = "nein";
                    incorrect = incorrect.concat("Quelle Leben: falscher Typ;<br>");
                };
                if (person.license != undefined && (actual_val_license != target_val_license)) {
                    match = "nein";
                    incorrect = incorrect.concat("Lizenz: falscher Typ;<br>");
                };
                if (person["keyword"] != undefined && (actual_val_keyword != target_val_keyword)) {
                    match = "nein";
                    incorrect = incorrect.concat("Ortsobjekt: falscher Typ;<br>");
                };
                if ((person.created != undefined && (actual_val_created != target_val_created)) || (person_created instanceof Date == false)) {
                    match = "nein";
                    if (actual_val_created != target_val_created) {
                        incorrect = incorrect.concat("Erstelldatum: falscher Typ;<br>");
                    };
                    if (person_created instanceof Date == false) {
                        incorrect = incorrect.concat("Erstelldatum: kein Datumsformat;<br>");
                    };                      
                };
                if ((person.modified != undefined && (actual_val_modified != target_val_modified)) || (person_modified instanceof Date == false)) {
                    match = "nein";
                    if (actual_val_modified != target_val_modified) {
                        incorrect = incorrect.concat("&Auml;nderungsdatum: falscher Typ;<br>");
                    };
                    if (person_modified instanceof Date == false) {
                        incorrect = incorrect.concat("&Auml;nderungsdatum: kein Datumsformat;<br>");
                    };                        
                };
                if (person.web != undefined && (actual_val_web != target_val_web)) {
                    match = "nein";
                    incorrect = incorrect.concat("Web: falscher Typ;<br>");
                };
                if (person.deleted != undefined && (actual_val_deleted != target_val_deleted)) {
                    match = "nein";
                    incorrect = incorrect.concat("Gel&ouml;scht: falscher Typ;<br>");
                };
                
                // Output of selected information with result and error to the table with ID "personBody" for clear presentation.
                if (match == "ja") {
                    $('#personBody').append($("<tr>")
                    .append($("<td onclick='location.href=`" + person.id + "`' style='text-decoration: underline; color: blue; cursor: pointer'>")
                    .append(person.id.slice(51))).append("</td>")
                    .append($("<td>").append(person.name)).append("</td>")
                    .append($("<td>").append(person.familyName)).append("</td>")
                    .append($("<td>").append(person.givenName)).append("</td>")
                    .append($("<td>").append(person.gender)).append("</td>")
                    .append($("<td>").append(person.formOfAddress)).append("</td>")
                    .append($("<td>").append(match)).append("</td>")
                    .append($("<td>").append(incorrect)).append("</td>")
                    .append("</tr>"));
                };
                if (match == "nein") {
                    $('#personBody').append($("<tr style='background-color: #FF6F6C'>")
                    .append($("<td onclick='location.href=`" + person.id + "`' style='text-decoration: underline; color: blue; cursor: pointer'>")
                    .append(person.id.slice(51))).append("</td>")
                    .append($("<td>").append(person.name)).append("</td>")
                    .append($("<td>").append(person.familyName)).append("</td>")
                    .append($("<td>").append(person.givenName)).append("</td>")
                    .append($("<td>").append(person.gender)).append("</td>")
                    .append($("<td>").append(person.formOfAddress)).append("</td>")
                    .append($("<td>").append(match)).append("</td>")
                    .append($("<td>").append(incorrect)).append("</td>")
                    .append("</tr>"));
                };              
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
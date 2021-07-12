OParl Validator

This application is used to check a correct implementation of the OParl interface.

OParl (https://oparl.org/) is an initiative to create a standard for open access to parliamentary content of municipal council information systems in order to be able to use them for different purposes according to Open Data.

As a practical part of a final thesis, the validator was developed for the council information system of the city of Ulm (https://buergerinfo.ulm.de/info.php) and checks the JSON objects (https://buergerinfo.ulm.de/oparl/bodies/0001 as well as subpages) for the specified types of OParl. This check is performed using JavaScript code, the results are displayed in tabular form on an HTML page.

The application is designed in such a way that it can be adapted to other council information systems with little effort. By exchanging the variable "bodyUrl" in the JavaScript codes and the purely informative links in the HTML pages, the application can be used for other cities and municipalities. The prerequisite is the implementation according to the OParl scheme of the body.
'use strict';

(function(){
    $(document).ready(initExtension)

    function initExtension(){
        tableau.extensions.initializeAsync({'configure':configure}).then(() => {
            buildMessage();
            var worksheetName = tableau.extensions.settings.get("worksheet");
            var worksheet = getWorksheetByName(worksheetName);
            worksheet.addEventListener(tableau.TableauEventType.FilterChanged, (event) => {
                buildMessage();
            }, function() {
                console.log("Error while initializing:" + err.toString()); 
            });
        })

    }

    function getWorksheetByName(worksheetName){
        const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
        
        var worksheet = worksheets.find(function(sheet){
            return sheet.name === worksheetName;
        });

        return worksheet;
    }

    function buildMessage() {
        var worksheetName = tableau.extensions.settings.get("worksheet");
        var message = tableau.extensions.settings.get("message");
        var messageWithData = tableau.extensions.settings.get("messageWithData");

        console.log(worksheetName);
        console.log(message);
        console.log(messageWithData);
        
        var worksheet = getWorksheetByName(worksheetName);

        worksheet.getSummaryDataAsync().then((sumdata) =>{
            var dataLength = sumdata.data.length;
            if (dataLength > 0){
                if (messageWithData === undefined){
                    var recordString = "There are " + dataLength + " records";
                } else {
                    var recordString = messageWithData;
                }
                $(".msg").text(recordString);
            }else {
                (message) ? $(".msg").text(message) : $(".msg").text("Set your message in Configuration menu")
            }
         });
    };

    function configure() {

        const popupUrl = `${window.location.origin}/dialog.html`;
        let defaultPayload = "";
        tableau.extensions.ui.displayDialogAsync(popupUrl, defaultPayload, { height:300, width:500 }).then((closePayload) => {
            initExtension();
        }).catch((error) => {
            switch (error.errorCode) {
                case tableau.ErrorCodes.DialogClosedByUser:
                   console.log("Dialog was closed by user");
                   break;
                default:
                   console.error(error.message);
            }
        });
    }

})();
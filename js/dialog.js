'use strict';

(function(){

    $(document).ready(function(){
        tableau.extensions.initializeDialogAsync().then(function(openPayload){
            buildDialog();
        });
    });

    function buildDialog(){
        console.log("Opening config");
        let dashboard = tableau.extensions.dashboardContent.dashboard;
        dashboard.worksheets.forEach(function(worksheet){
            $("#selectWorksheet").append("<option value='" + 
                worksheet.name + "'>" + worksheet.name + "</option>");
        });

        $("#cancel").click(closeDialog);
        $("#save").click(saveButton);
    }

    function closeDialog(){
        tableau.extensions.ui.closeDialog("10");
    }

    function saveButton() {
        console.log("Saving");
        tableau.extensions.settings.set("worksheet", $("#selectWorksheet").val());
        tableau.extensions.settings.set("message", $("#messageText").val());
        tableau.extensions.settings.set("messageWithData", $("#messageTextWithData").val());
        // console.log(tableau.extensions.settings.get("worksheet"));
        // console.log(tableau.extensions.settings.get("message"));

        tableau.extensions.settings.saveAsync().then((currentSettings) => {
            tableau.extensions.ui.closeDialog("10");
        })
    }

})();
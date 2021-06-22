({
    //Init methods called when the component is loaded. This method calls the apex method to get the JSON
	doInit : function(component, event, helper) {
		var action = component.get("c.getparseJSONResponse");
        action.setCallback(this, function(response) {
            var state = response.getState();
             if (state === "SUCCESS") {
                 component.set('v.wrapperList', response.getReturnValue());
                 var totalLength = response.getReturnValue().length ;
                 //When the component initially loads, set the length of returned JSON as Total recs count
                 component.set("v.totalRecordsCount", totalLength);
             }
        });
         $A.enqueueAction(action);
	},
    
    
    //Actions when the Header checkbox is updated -
    selectAllCheckbox: function(component, event, helper) {
        var selectedHeaderCheck = event.getSource().get("v.value");
        var updatedAllRecords = [];
        var sumofdebts = 0;
        var wrapperList = component.get("v.wrapperList");
        // play a for loop on all records list 
        for (var i = 0; i < wrapperList.length; i++) {
            // check if header checkbox is 'true' then update all checkbox with true and update selected records count
            // else update all records with false and set selectedCount with 0  
            if (selectedHeaderCheck == true) {
                wrapperList[i].checked = true;
                component.set("v.selectedCount", wrapperList.length);
                sumofdebts = sumofdebts + wrapperList[i].balance;
            } else {
                wrapperList[i].checked = false;
                component.set("v.selectedCount", 0);
            }
            updatedAllRecords.push(wrapperList[i]);
            
        }
        component.set("v.wrapperList", updatedAllRecords);
        component.set("v.totaldebt", sumofdebts);
        
    },
 
    checkboxSelect: function(component, event, helper) {
        // on each checkbox selection update the selected record count 
        var selectedRec = event.getSource().get("v.value");
        var getSelectedNumber = component.get("v.selectedCount");
        var wrapperList = component.get("v.wrapperList");
        var sumofdebts = 0;
        if (selectedRec == true) {
            getSelectedNumber++;
        } else {
            getSelectedNumber--;
            component.find("selectAllId").set("v.value", false);
        }
        component.set("v.selectedCount", getSelectedNumber);
        // if all checkboxes are checked then set header checkbox with true   
        if (getSelectedNumber == component.get("v.totalRecordsCount")) {
            component.find("selectAllId").set("v.value", true);
        }
        //Update the Sum
        for (var i = 0; i < wrapperList.length; i++) {
            if(wrapperList[i].checked == true){
               sumofdebts = sumofdebts + wrapperList[i].balance; 
            }
        }
        component.set("v.totaldebt", sumofdebts);
    },
    
   
    //Method for adding a new debt row
    addDebt: function(component, event, helper){
        var wrapperList = component.get("v.wrapperList");
        var i = wrapperList.length;
        wrapperList.push({
            'wrapperList[i].checked' : false,
            'wrapperList[i].id' : i,
            'wrapperList[i].creditorName' : '',
            'wrapperList[i].firstname' : '',
            'wrapperList[i].lastname' : '',
            'wrapperList[i].minPaymentPercentage' : '',
            'wrapperList[i].balance' : '',
        });
        component.set("v.wrapperList", wrapperList);
        component.set("v.totalRecordsCount", i+1);
        
    },
    
    //Method for deleting a debt row
    removeDebt: function(component, event, helper) {
        var wrapperList = component.get("v.wrapperList");
        var index;
        var countitems = 0;
        var totalRecordsCount = component.get("v.totalRecordsCount");
        //var totaldebt = component.get("v.totaldebt");
        for(var i=0; i<wrapperList.length; i++){
            if(wrapperList[i].checked == true){
                index = i;
                countitems++;
            }
        }
        if(countitems == 1){
            totalRecordsCount--;
            wrapperList.splice(index,1);
            component.set("v.wrapperList", wrapperList);
            component.set("v.selectedCount", 0);
            component.set("v.totaldebt", '' );
            component.set("v.totalRecordsCount", totalRecordsCount);
        }
        else{
            alert('Please select exactly 1 row at a time for deletion');
        }
    
}

})
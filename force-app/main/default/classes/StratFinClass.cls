global class StratFinClass {
    
    //Constructor - Do nothing here - just initialize
    public void StratFinClass (){
    }
    
    @AuraEnabled
    public static list<CreditData> getparseJSONResponse(){
        Http httpProtocol = new Http();
        // Create HTTP request to send.
        HttpRequest request = new HttpRequest();
        // Set the endpoint URL.
        String endpoint = 'https://raw.githubusercontent.com/StrategicFS/Recruitment/master/data.json' ;
        request.setEndPoint(endpoint);
        // Set the HTTP verb to GET.
        request.setMethod('GET');
        // Send the HTTP request and get the response.
        // The response is in JSON format.
        HttpResponse response = httpProtocol.send(request);
        System.debug(response.getBody());
        string jsonStr = response.getBody();
        List<CreditData> cdList = new list<CreditData>();
        // Parse entire JSON response.
        JSONParser parser = JSON.createParser(jsonStr);
        while (parser.nextToken() != null) {
            // Start at the array of debts.
            if (parser.getCurrentToken() == JSONToken.START_ARRAY) {
                while (parser.nextToken() != null) {
                    if (parser.getCurrentToken() == JSONToken.START_OBJECT) {
                        // Read entire debts object.
                        CreditData cd = (CreditData)parser.readValueAs(CreditData.class);
                        cdList.add(cd);
                        parser.skipChildren();
                    }
                }
            }
        }
        system.debug(cdList.size());
        system.debug('cdList : '+cdList);
        return cdList;
        
    }
    
    
    //Class for storing parsed Data into a wrapper apex object
    global class CreditData {
        @AuraEnabled
        public boolean checked;
        @AuraEnabled
        public String id;
        @AuraEnabled
        public String creditorName;
        @AuraEnabled
        public String firstname;
        @AuraEnabled
        public String lastname;
        @AuraEnabled
        public Double minPaymentPercentage;
        @AuraEnabled
        public Double balance;
        
        global creditData(String id, String creditorName, String firstname, String lastname, Double minPaymentPercentage, Double balance){
            checked = false;
            id = id;
            creditorName = creditorName;
            firstname = firstname;
            lastname = lastname;
            minPaymentPercentage = minPaymentPercentage;
            balance = balance;
        }
        
    }

}
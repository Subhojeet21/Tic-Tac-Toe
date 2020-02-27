({
	subscribe: function(component, event, helper) {
        
        // Get the empApi component.
        var empApi = component.find("empApi");
        // Get the channel name from attribute
        var channel = component.get("v.channelName");
        console.log('channel-'+channel);
        //fetch latest events
        var replayId = -1;
        
        // Callback function to be passed in the subscribe call.
        // After an event is received, this callback fire a custom
        // event to notify parent component and pass payload object
        var subscribeCallback = function (message) {
            //Fire the component event to notify parent component
            var gameReqEvent = component.getEvent("sendRequestEvent");
            alert(gameReqEvent);
            if(gameReqEvent != null) {
                console.log('message.data');
                console.log(JSON.stringify(message));
                /*gameReqEvent.setParams({
                    "player1Id" : message.data.payload.Player_1__c,
                    "player2Id" : message.data.payload.Player_2__c,
                    "gameId" : message.data.payload.Game__c,
                    "isRequestAccepted" : message.data.payload.Request_Accepted__c
                });*/
                gameReqEvent.setParam("GameRequestData",message.data.payload);
                gameReqEvent.fire();                            
            }
            //Display event data in browser console
            console.log("Received [" + message.channel +" : " + message.data.event.replayId + "] payload=" + JSON.stringify(message.data.payload));
        }.bind(this);
    
        
        
        // Register error listener and pass in the error handler function.
        empApi.onError(function(error){
            console.log("Received error ", error);
        }.bind(this));
        
        // Subscribe to the channel and save the returned subscription object.
        empApi.subscribe(channel, replayId, subscribeCallback).then(function(value) {
            console.log("Subscribed to channel " + channel);
            component.set("v.subscription", value);
        });
    },
    
    /**
     * This function will be fired once the component is destroyed
     * It will call unsubscribe method of empApi component
     * */
    unsubscribe : function (component, event, helper) {
        try{
            // Get the empApi component.
            var empApi = component.find("empApi");
            // Get the channel name from attribute
            var channel = component.get("v.channelName");
            
            // Callback function to be passed in the unsubscribe call.
            var unsubscribeCallback = function (message) {
                console.log("Unsubscribed from channel " + channel);
            }.bind(this);
            
            // Error handler function that prints the error to the console.
            var errorHandler = function (message) {
                console.log("Received error ", message);
            }.bind(this);
            
            // Object that contains subscription attributes used to
            // unsubscribe.
            var subscription = {"id": component.get("v.subscription")["id"],
                                "channel": component.get("v.subscription")["channel"]};
            
            // Register error listener and pass in the error handler function.
            empApi.onError(function (error) {
                console.log("Received error ", error);
            }.bind(this));
            
            // Unsubscribe from the channel using the sub object.
            empApi.unsubscribe(subscription, unsubscribeCallback);
        }catch(e){}
    },
})

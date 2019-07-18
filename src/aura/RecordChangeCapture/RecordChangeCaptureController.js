({
	/*subscribe: function(component, event, helper) {
        
        var empApi = component.find("empApi");
        var channel = component.get("v.channelName");
        console.log('channel-'+channel);
        var replayId = -1;
        
        var subscribeCallback = function (message) {
            console.log('inside subscribeCallback');
            var messageEvent = component.getEvent("gameCaptureEvent");
            alert(messageEvent);
            if(messageEvent != null) {
                console.log('message.data');
                console.log(JSON.stringify(message));
                messageEvent.setParam("GameRecData", message.data);
                messageEvent.fire();                            
            }
            //Display event data in browser console
            console.log("Received [" + message.channel +" : " + message.data.event.replayId + "] payload=" + JSON.stringify(message.data.payload));
        }.bind(this);
    
        
        //empApi.setDebugFlag(true);
        empApi.onError(function(error){
            console.log("Received error "+ JSON.stringify(error));
        }.bind(this));
        
        // Subscribe to the channel and save the returned subscription object.
        empApi.subscribe(channel, replayId, subscribeCallback).then(function(value) {
            console.log("Subscribed to channel " + channel);
            component.set("v.subscription", value);
        });
        
    },*/
    
    subscribe : function(component, event, helper) {
        // Get the empApi component
        const empApi = component.find('empApi');
        // Get the channel from the input box
        var channel = component.get("v.channelName");
        console.log('channel-'+channel);
        // Replay option to get new events
        const replayId = -1;
        
        empApi.onError($A.getCallback(error => {
            // Error can be any type of error (subscribe, unsubscribe...)
            console.error('EMP API error: '+ JSON.stringify(error));
        }));

        // Subscribe to an event
        empApi.subscribe(channel, replayId, $A.getCallback(eventReceived => {
            // Process event (this is called each time we receive an event)
            var messageEvent = component.getEvent("gameCaptureEvent");
            console.log('Received event '+ JSON.stringify(eventReceived));
            alert(messageEvent);
            if(messageEvent != null) {
                console.log('message.data');
                console.log(JSON.stringify(message));
                messageEvent.setParam("GameRecData", message.data);
                messageEvent.fire();                            
            }
        }))
        .then(subscription => {
            // Confirm that we have subscribed to the event channel.
            // We haven't received an event yet.
            console.log('inside subscribe');
            console.log('Subscribed to channel '+ subscription.channel);
            // Save subscription to unsubscribe later
            component.set('v.subscription', subscription);
        });
    },
    
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
({
    loadGame : function(component, event, helper) {
        var action = component.get('c.loadGame');
        action.setParams({
            player1 : component.get('v.playerIcon')
        });
        action.setCallback(this, function(response){
            if(component.isValid() && response !== null && response.getState() === 'SUCCESS'){
                console.log('Game loaded successfully for--'+component.get('v.playerIcon'));
                console.log(response.getReturnValue());
                //component.set('v.gameId',response.getReturnValue());
                component.set('v.game',response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
    
    loadExistingGame : function(component, event, helper, existingGameId) {
        var action = component.get('c.loadExistingGame');
        action.setParams({
            gameId : existingGameId
        });
        action.setCallback(this, function(response){
            if(component.isValid() && response !== null && response.getState() === 'SUCCESS'){
                console.log('Exsting Game loaded successfully for--');
                console.log(response.getReturnValue());
                component.set('v.game',response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
    
    /*setChannelName : function(component, objectName) {
    	if(objectName.includes("__c")){//Custom Object
            objectName = objectName.slice(0, -3); //removing __c from the end
            objectName += "__ChangeEvent"; //appending __ChangeEvent in the end of custom object
            console.log('channelName--'+'/data/Game__ChangeEvent')
            component.set("v.channelName", '/data/Game__ChangeEvent'); ;
        }
    },*/
    
    processEachTurn : function(component, event, helper, cellNo) {
        console.log('inside pricess turn');
        var action = component.get('c.processTurn');
        action.setParams({
            chosenVal : component.get('v.playerIcon'),
            cell : cellNo,
            gameId : component.get('v.game.Id')
        });
        action.setCallback(this, function(response){
            if(component.isValid() && response !== null && response.getState() === 'SUCCESS'){
                console.log('Turn processed for--'+component.get('v.playerIcon'));
                var player = component.get('v.playerIcon');
                var player2 = component.get('v.player2');
                component.set('v.nextTurn',player2+'\'s Turn');
                component.set('v.waitForNextTurn',true);
                var isWinner = this.checkForMatch(player, component, event, helper);
                //component.set('v.game',response.getReturnValue());
                if(isWinner){
                    this.markGameOver(component, helper);
                    component.set('v.finalResult', 'You WON!!!!');
                }
            }
        });
        $A.enqueueAction(action);
    },
    
	checkForMatch : function(player, component, event, helper) {
        var isWinner = false;
        console.log('checkMatch---'+component.get('v.game.Cell_11__c'));
        console.log('player--'+player);
        if((player && component.get('v.game.Cell_11__c') == player && component.get('v.game.Cell_21__c') == player && component.get('v.game.Cell_31__c') == player)){
           	this.markAsWinner('label11', 'label21', 'label31', component, helper);
            isWinner = true;
        }else if((player && component.get('v.game.Cell_11__c') == player && component.get('v.game.Cell_12__c') == player && component.get('v.game.Cell_13__c') == player)){
            this.markAsWinner('label11', 'label12', 'label13', component, helper);
            isWinner = true;
        }else if((player && component.get('v.game.Cell_11__c') == player && component.get('v.game.Cell_22__c') == player && component.get('v.game.Cell_33__c') == player)){
            this.markAsWinner('label11', 'label22', 'label33', component, helper);
            isWinner = true;
        }else if((player && component.get('v.game.Cell_21__c') == player && component.get('v.game.Cell_22__c') == player && component.get('v.game.Cell_23__c') == player)){
            this.markAsWinner('label21', 'label22', 'label23', component, helper);
            isWinner = true;
        }else if((player && component.get('v.game.Cell_31__c') == player && component.get('v.game.Cell_32__c') == player && component.get('v.game.Cell_33__c') == player)){
            this.markAsWinner('label31', 'label32', 'label33', component, helper);
            isWinner = true;
        }else if((player && component.get('v.game.Cell_31__c') == player && component.get('v.game.Cell_22__c') == player && component.get('v.game.Cell_13__c') == player)){
            this.markAsWinner('label31', 'label22', 'label13', component, helper);
            isWinner = true;
        }else if((player && component.get('v.game.Cell_12__c') == player && component.get('v.game.Cell_22__c') == player && component.get('v.game.Cell_32__c') == player)){
            this.markAsWinner('label12', 'label22', 'label32', component, helper);
            isWinner = true;
        }else if((player && component.get('v.game.Cell_13__c') == player && component.get('v.game.Cell_23__c') == player && component.get('v.game.Cell_33__c') == player)){
            this.markAsWinner('label13', 'label23', 'label33', component, helper);
            isWinner = true;
        }
        return isWinner;
    },
    
   markAsWinner : function(label1, label2, label3, component, helper) {
       	this.changeWinnerCss(label1, label2, label3);
       	//this.markGameOver(component, helper);
       	//this.showToast(helper);
       	//component.set('v.finalResult', 'You WON!!!!');
       	//this.fireGameOverEvent(component, label1, label2, label3);
    },
    
    changeWinnerCss : function(label1, label2, label3) {
       	console.log(label1+'--'+label2+'--'+label3);
        var td1Id = 'td'+label1.substring(5);
        var td1Elem = document.getElementById(td1Id);
        var td2Id = 'td'+label2.substring(5);
        var td2Elem = document.getElementById(td2Id);
        var td3Id = 'td'+label3.substring(5);
        var td3Elem = document.getElementById(td3Id);
        $A.util.addClass(td1Elem, 'cellColor');
        $A.util.addClass(td2Elem, 'cellColor');
        $A.util.addClass(td3Elem, 'cellColor');
    },
    
    removeWinnerCss : function(component) {
        console.log('inside removeClass');
        var elems = document.getElementsByClassName('cellColor');
        console.log('elems.length'+elems.length);
        //for(var elem in elems){
        /*for (var i=0; i<elems.length; ) {
            console.log('elem'+i);
            console.log(elems[i]);
            elems[i].classList.remove("cellColor");
            console.log('removed class from elem'+i);
            i++;
        }*/
        console.log('removing css');
        //$A.util.removeClass(elems[0], 'cellColor');
        //$A.util.removeClass(elems[2], 'cellColor');
        //$A.util.removeClass(elems[1], 'cellColor');
    },
    
    markGameOver : function(component, helper) {
        console.log('inside markGameOver');
        component.set('v.gameOver', true);
        var action = component.get('c.processGameOver');
        action.setParams({
            gameId : component.get('v.game.Id')
        });
        action.setCallback(this, function(response){
            if(component.isValid() && response !== null && response.getState() === 'SUCCESS'){
                console.log('Processed GameOver for--'+component.get('v.playerIcon'));
            }
        });
        $A.enqueueAction(action);
    },
    
    /*fireGameOverEvent : function(component, label1, label2, label3) {
        console.log('game over event fired');
        var gameOvrEvt = component.getEvent("gameOverEvt");
        gameOvrEvt.setParams({
            "label1" : label1,
            "label2" : label2,
            "label3" : label3,
            "player" : component.get('v.playerIcon'),
            "gameId" : component.get('v.game.id')
        });
        gameOvrEvt.fire();
    },
    
    showToast : function(helper) {
        console.log('toast event fire');
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : 'GAME OVER',
            message : 'You WON !!!!!!',
            type : 'info',
            mode : 'sticky'
        });
        toastEvent.fire();
    }*/
    
    fetchOnlineUsers : function (component, event, helper) {
        //this.enableSpinner( 'userSpinner', component, event, helper );
		var action = component.get("c.getOnlineUsers");
		action.setCallback(this, function(response){
            if(component.isValid() && response !== null && response.getState() === 'SUCCESS'){
                console.log('online users');
                console.log(response.getReturnValue());
                let updatedData = this.getUpdatedRecords(response.getReturnValue());
                component.set("v.data", updatedData);
            }
            //this.disableSpinner( 'userSpinner', component, event, helper );
        });
    
        $A.enqueueAction(action);
	},
    
    getUpdatedRecords : function(records) {
        for(var i=0; i< records.length ; i++){
           records[i]['UserName']=records[i]['Users']['Name'];
        }
        return records;
    },
    
    sendRequest : function(component, event, helper, player2Id) {
        var action = component.get('c.sendGameRequest');
        action.setParams({
            gameId : component.get('v.game.Id'),
            player2UserId : player2Id
        });
        action.setCallback(this, function(response){
            if(component.isValid() && response !== null && response.getState() === 'SUCCESS'){
                console.log('Game request sent successfully to--'+player2Id);
                component.set('v.gameRequest', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
    
    processUserResponse : function(component, event, helper, userResponse, gameReqRecId) {
        var action = component.get('c.processUserResponse');
        action.setParams({
            gameReqId : gameReqRecId,
            isReqAccepted : userResponse
        });
        action.setCallback(this, function(response){
            if(component.isValid() && response !== null && response.getState() === 'SUCCESS'){
                console.log('Game request userResponse updated successfully ');
                //component.set('v.gameRequest', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
    
    refreshGame : function(component, gameRec) {
        if(gameRec.Cell_11__c){
            component.set('v.game.Cell_11__c',gameRec.Cell_11__c);
        }
        if(gameRec.Cell_12__c){
            component.set('v.game.Cell_12__c',gameRec.Cell_12__c);
        }
        if(gameRec.Cell_13__c){
            component.set('v.game.Cell_13__c',gameRec.Cell_13__c);
        }
        if(gameRec.Cell_21__c){
            component.set('v.game.Cell_21__c',gameRec.Cell_21__c);
        }
        if(gameRec.Cell_22__c){
            component.set('v.game.Cell_22__c',gameRec.Cell_22__c);
        }
        if(gameRec.Cell_23__c){
            component.set('v.game.Cell_23__c',gameRec.Cell_23__c);
        }
        if(gameRec.Cell_31__c){
            component.set('v.game.Cell_31__c',gameRec.Cell_31__c);
        }
        if(gameRec.Cell_32__c){
            component.set('v.game.Cell_32__c',gameRec.Cell_32__c);
        }
        if(gameRec.Cell_33__c){
            component.set('v.game.Cell_33__c',gameRec.Cell_33__c);
        }
    },
})
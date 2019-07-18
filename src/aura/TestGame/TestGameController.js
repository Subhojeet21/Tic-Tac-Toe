({
    doInit : function(component, event, helper){
        console.log('this is init');
        console.log('player--'+component.get('v.playerIcon'));
        var player1 = component.get('v.playerIcon');
        component.set('v.nextTurn', player1+'\'s Turn');
        component.set('v.possiblePlayerVals',['X','O']);
        //helper.fetchOnlineUsers(component, event, helper);
        //helper.loadGame(component, event, helper);
        
    },
    
    handleGameCaptureEvent : function(component, event, helper) {
        console.log('inside game capture event');
        var player = component.get('v.playerIcon');
        var gameRec = event.getParam('GameRecData');
        var player2 = component.get('v.player2');
        console.log(player2+'-----'+player);
        helper.refreshGame(component, gameRec);
        var isLoser = helper.checkForMatch(player2, component, event, helper);
        console.log('isLoser--'+isLoser);
        if(isLoser){
            component.set('v.gameOver', true);
            component.set('v.finalResult', 'Oops, You Lost The Game!!!!');
        }
        
        var nextPlayer = gameRec.Next_Turn__c;
        console.log('nextPlayer--'+nextPlayer);
        var userId = $A.get("$SObjectType.CurrentUser.Id");
		console.log('currentUserId--'+userId);
        var winner = gameRec.Winner__c;
        console.log('winner--'+winner);
        var currentGameId = gameRec.ChangeEventHeader.recordIds[0];
        
        if(winner && winner != userId && currentGameId == component.get('v.game.Id')){
            var isWinner = helper.checkForMatch(player, component, event, helper);
            if(isWinner){
                component.set('v.gameOver', true);
                component.set('v.finalResult', 'Oops, You Lost!!!!');
            }
            event.stopPropagation();
        }
        if(nextPlayer == player && currentGameId == component.get('v.game.Id')){
            component.set('v.game', gameRec);
            component.set('v.nextTurn', nextPlayer+'\'s Turn');
            component.set('v.waitForNextTurn',false);
            event.stopPropagation();
        }
    },
    
    requestUser : function(component, event, helper) {
        console.log('inside requestUser--');
        let source = event.getSource();
        let rowIndex = source.get('v.class');
        let dataRecs = component.get('v.data');
        //alert(dataRecs[rowIndex].UsersId);
        component.set('v.chosenPlayer2Id',dataRecs[rowIndex].UsersId);
        helper.sendRequest(component, event, helper, dataRecs[rowIndex].UsersId);
    },
    
    handleSendRequestEvent : function(component, event, helper) {
        console.log('inside send request event handler');
        var gameRequestData = event.getParam('GameRequestData');
        //var player1Id = gameRequestData.Player_1__c;
        var player1Id = component.get('v.gameRequest.Player_1__c');
        var player2Id = gameRequestData.Player_2__c;
        var gameIdFromEvent = gameRequestData.Game__c;
        var gameId = component.get('v.gameRequest.Game__c');
        var isRequestAccepted = gameRequestData.Request_Accepted__c;
        var existingIsRequestAccepted = component.get('v.gameRequest.Request_Accepted__c');
        var gameReqRecId = gameRequestData.ChangeEventHeader.recordIds[0];
        console.log(player1Id+'---'+player2Id+'--'+gameId+'---'+isRequestAccepted);
        var existingGameId = component.get('v.game.Id');
        var existingGameReqId = component.get('v.gameRequest.Id');
        var currentUserId = $A.get("$SObjectType.CurrentUser.Id");
        //if(existingGameId && existingGameId == gameId && currentUserId == player1Id && isRequestAccepted){
        if(existingGameReqId == gameReqRecId && existingGameId == gameId && currentUserId == player1Id && isRequestAccepted){
            component.set('v.playRequestAccepted', true);
            var possiblePlayers = component.get('v.possiblePlayerVals');
            let index = possiblePlayers.indexOf(component.get('v.playerIcon'));
            possiblePlayers.splice(index, 1);
            component.set('v.player2',possiblePlayers[0]);
        }else if(existingGameReqId == gameReqRecId && existingGameId == gameId && currentUserId == player1Id && isRequestAccepted == 'undefined' && !existingIsRequestAccepted){
            alert('Player 2 declined the game request');
        }else if(currentUserId == player2Id){
            var userResponse = confirm('You are invited to play Tic Tac Toe. Please confirm.');
            if(userResponse){
                helper.processUserResponse(component, event, helper, userResponse, gameReqRecId);
                helper.loadExistingGame(component, event, helper, gameIdFromEvent);
                var player1 = component.get('v.game.Player_1_Icon__c');
                component.set('v.playRequestAccepted', true);
                component.set('v.gameOver', false);
                component.set('v.finalResult', '');
                var possiblePlayers = component.get('v.possiblePlayerVals');
                let index = possiblePlayers.indexOf(player1);
                possiblePlayers.splice(index, 1);
                component.set('v.player2',player1);
                component.set('v.playerIcon',possiblePlayers[0]);
                component.set('v.nextTurn',player1+'\'s Turn');
                component.set('v.waitForNextTurn',true);
                helper.removeWinnerCss(component);
            }else{
                helper.processUserResponse(component, event, helper, userResponse, gameReqRecId);
            }
        }
        event.stopPropagation();
    },
    
    /*handleGameOvrEvt : function(component, event, helper) {
        console.log('inside game over event');
        var player = event.getParam("player");
        var gameId = event.getParam("gameId");
        if(player != component.get('v.playerIcon') && gameId == component.get('v.game.Id')){
            var label1 = event.getParam('label1');
            var label2 = event.getParam('label2');
            var label3 = event.getParam('label3');
            helper.changeWinnerCss(label1, label2, label3);
            component.set('v.gameOver', true);
            component.set('v.finalResult', 'Oops, You Lost!!!!');
            event.stopPropagation();
        }
    },*/
    
	handleClick11 : function(component, event, helper) {
        console.log('inside cell 11');
        if(!component.get('v.gameOver')){
            component.set('v.game.Cell_11__c', component.get('v.playerIcon'));
            //component.set('v.nextTurn', '');
            helper.processEachTurn(component, event, helper, 'Cell_11__c');
        }
    },
    
    handleClick12 : function(component, event, helper) {
        console.log('inside cell 12--');
        if(!component.get('v.gameOver')){
            component.set('v.game.Cell_12__c', component.get('v.playerIcon'));
            //component.set('v.nextTurn', '');
            helper.processEachTurn(component, event, helper, 'Cell_12__c');
        }
	},
    
    handleClick13 : function(component, event, helper) {
        console.log('inside cell 13');
        if(!component.get('v.gameOver')){
            component.set('v.game.Cell_13__c', component.get('v.playerIcon'));
            //component.set('v.nextTurn', '');
            helper.processEachTurn(component, event, helper, 'Cell_13__c');
        }
	},
    
    handleClick21 : function(component, event, helper) {
        console.log('inside cell 21');
		if(!component.get('v.gameOver')){
            component.set('v.game.Cell_21__c', component.get('v.playerIcon'));
            //component.set('v.nextTurn', '');
            helper.processEachTurn(component, event, helper, 'Cell_21__c');
        }
    },
    
    handleClick22 : function(component, event, helper) {
        console.log('inside cell 22');
		if(!component.get('v.gameOver')){
            component.set('v.game.Cell_22__c', component.get('v.playerIcon'));
            //component.set('v.nextTurn', '');
            helper.processEachTurn(component, event, helper, 'Cell_22__c');
        }
    },
    
    handleClick23 : function(component, event, helper) {
        console.log('inside cell 23');
		if(!component.get('v.gameOver')){
            component.set('v.game.Cell_23__c', component.get('v.playerIcon'));
            //component.set('v.nextTurn', '');
            helper.processEachTurn(component, event, helper, 'Cell_23__c');
        }
    },
    
    handleClick31 : function(component, event, helper) {
        console.log('inside cell 31');
		if(!component.get('v.gameOver')){
            component.set('v.game.Cell_31__c', component.get('v.playerIcon'));
            //component.set('v.nextTurn', '');
            helper.processEachTurn(component, event, helper, 'Cell_31__c');
        }
    },
    
    handleClick32 : function(component, event, helper) {
        console.log('inside cell 32');
		if(!component.get('v.gameOver')){
            component.set('v.game.Cell_32__c', component.get('v.playerIcon'));
            //component.set('v.nextTurn', '');
            helper.processEachTurn(component, event, helper, 'Cell_32__c');
        }
    },
    
    handleClick33 : function(component, event, helper) {
        console.log('inside cell 33');
		if(!component.get('v.gameOver')){
            component.set('v.game.Cell_33__c', component.get('v.playerIcon'));
            //component.set('v.nextTurn', '');
            helper.processEachTurn(component, event, helper, 'Cell_33__c');
        }
    },
    
})
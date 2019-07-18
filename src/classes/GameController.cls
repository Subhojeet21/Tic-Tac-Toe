public class GameController {
	
    public static final List<String> playerList = new List<String>{'X','O'};
    
    @AuraEnabled
    public static Game__c loadGame(String player1){
        try{
            Game__c gameRec = new Game__c(Player_1__c = UserInfo.getUserId(), Player_1_Icon__c = player1);
        	insert gameRec;
            return gameRec;
        }catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    @AuraEnabled
    public static void processTurn(String chosenVal, String cell, String gameId){
        system.debug('inside proces turn');
        try{
            List<String> tempPlayerList = playerList;
            tempPlayerList.remove(tempPlayerList.indexOf(chosenVal));
            Game__c gameRec = new Game__c(id = gameId);
            gameRec.put(cell, chosenVal);
            gameRec.Next_Turn__c = tempPlayerList[0];
            update gameRec;
            //return gameRec;
        }catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }
        
    @AuraEnabled
    public static void processGameOver(String chosenVal, String gameId){
        system.debug('inside proces turn');
        try{
            Game__c gameRec = new Game__c(id = gameId);
            gameRec.Winner__C = UserInfo.getUserId();
            gameRec.Winning_Player_Icon__c = chosenVal;
            update gameRec;
        }catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    @AuraEnabled
    public static List<AuthSession> getOnlineUsers(){
        String currentUserId = UserInfo.getUserId();
        List<AuthSession> onlineSessions = [Select UsersId, users.name, UserType, SessionType, ParentId, LoginType, Id From AuthSession where sessionType = 'UI' and UsersId != :currentUserId];
        //return JSON.serialize(onlineSessions);
        return onlineSessions;
    }
    
    @AuraEnabled
    public static Game_Request__c sendGameRequest(STring gameId, String player2UserId){
        try{
            Game_Request__c gameReq = new Game_Request__c(Player_1__c = UserInfo.getUserId(), Player_2__c = player2UserId, Game__c = gameId);
        	insert gameReq;
            return gameReq;
        }catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    @AuraEnabled
    public static Game_Request__c processUserResponse(STring gameReqId, String isReqAccepted){
        try{
            Game_Request__c gameReq = new Game_Request__c(id=gameReqId);
            gameReq.Request_Accepted__c = Boolean.valueOf(isReqAccepted);
        	update gameReq;
            return gameReq;
        }catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }
    
   @AuraEnabled
    public static Game__c loadExistingGame(STring gameId){
        Game__c game = [select id, Next_Turn__c,Player_1__c,Player_1_Icon__c,Player_2__c from Game__c where id = :gameId];
        return game;
    }
}
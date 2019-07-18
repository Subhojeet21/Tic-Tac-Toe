# Tic-Tac-Toe

# 1. Add Push Topic

PushTopic pushTopic = new PushTopic(); <br/>
pushTopic.Name = 'GameUpdates'; <br/>
pushTopic.Query = 'SELECT Id, Cell_11__c,Cell_12__c,Cell_13__c,Cell_21__c,Cell_22__c,Cell_23__c,Cell_31__c,Cell_32__c,Cell_33__c, Name, Next_Turn__c,Player_1__c,Player_1_Icon__c,Player_2__c,Winner__c,Winning_Player_Icon__c FROM Game__c'; <br/>
pushTopic.ApiVersion = 44.0; <br/>
pushTopic.NotifyForOperationCreate = true; <br/>
pushTopic.NotifyForOperationUpdate = true; <br/>
pushTopic.NotifyForFields = 'Referenced'; <br/>
insert pushTopic;

# 2. Query push topic

select id, name, Query, NotifyForFields, NotifyForOperationCreate, NotifyForOperationUpdate, ApiVersion from PushTopic 

"_"	"Id"	"Name"	"Query"	"NotifyForFields"	"NotifyForOperationCreate"	"NotifyForOperationUpdate"	"ApiVersion"
"[PushTopic]"	"0IF0I000000bn2pWAA"	"GameUpdates"	"SELECT Id, Cell_11__c,Cell_12__c,Cell_13__c,Cell_21__c,Cell_22__c,Cell_23__c,Cell_31__c,Cell_32__c,Cell_33__c, Name, Next_Turn__c,Player_1__c,Player_1_Icon__c,Player_2__c,Winner__c,Winning_Player_Icon__c FROM Game__c"	"Referenced"	"true"	"true"	"44"

